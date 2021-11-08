const mongoose = require('mongoose');
const projectAssignmentModel = require('../models/project-assignment');
const userRepo = require('../repository/user-repository');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveDetails = async (assignmentDetails) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    if (assignmentDetails && assignmentDetails.length > 0) {

        assignmentDetails.forEach(project => {
            project.projectAssignUniqueId = uuidv4();
            project.isActive = true;
            project.createdOn = new Date();
            project.createdBy = headerDetails.user;
            project.clientTenentId = headerDetails.clientId;
            project.countryCode = headerDetails.countryCode;
        });

        const session = await mongoose.startSession();

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        try {
            await session.withTransaction(async () => {
                const savedResult = await projectAssignmentModel.insertMany(assignmentDetails);
                if (savedResult) {
                    response = {};
                    response['assignmentDetails'] = savedResult;
                    await session.commitTransaction();
                } else {
                    await session.abortTransaction();
                }
            }, transactionOptions);
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
        session.endSession();
    }
    return response;
}

exports.save = async (projectAssignmentDetail) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    projectAssignmentDetail.projectAssignUniqueId = uuidv4();
    projectAssignmentDetail.isActive = true;
    projectAssignmentDetail.createdOn = new Date();
    projectAssignmentDetail.createdBy = headerDetails.user;
    projectAssignmentDetail.clientTenentId = headerDetails.clientId;
    projectAssignmentDetail.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const savedRes = await projectAssignmentModel.create(projectAssignmentDetail);
            const result = await userRepo.getUserDetail(projectAssignmentDetail.userId);
            if (result && result.length > 0) {
                const user = result[0];
                if (user['assignedProjects'] && user['assignedProjects'].length > 0) {
                    const projectIds = user.assignedProjects.map(x => x._id.toString());
                    projectIds.push(savedRes._id.toString());
                    user['assignedProjects'] = [];
                    user.assignedProjects = projectIds;
                } else {
                    user['assignedProjects'] = [].concat(savedRes._id.toString());
                }

                await userRepo.updateUser(user);
                console.log('Successfully updated the user.');
            } else {
                console.log('Failed to load user .');
            }
            if (savedRes) {
                response = {};
                response['assignmentDetail'] = savedRes;
                await session.commitTransaction();
            } else {
                await session.abortTransaction();
            }
        }, transactionOptions);
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
    session.endSession();
    return response;
}

exports.filterDetail = async (filterParam) => {
    let query = {};
    const param = Object.keys(filterParam);
    param.forEach(p => {
        if (filterParam[p]) {
            query[p] = filterParam[p]
        }
    })

    return await projectAssignmentModel.find({ ...query, isActive: true })
        // .populate({
        //     path: 'owner',
        //     model: 'ClubMember',
        // })
        .sort({ createdOn: 'descending' });
}

exports.updateAssignedProject = async (projectAssignment) => {
    const headerDetails = headerReader.getHeaderDetails();
    projectAssignment.clientTenentId = headerDetails.clientId;
    projectAssignment.countryCode = headerDetails.countryCode;
    projectAssignment.modifiedBy = headerDetails.user;
    projectAssignment.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { projectAssignUniqueId: projectAssignment.projectAssignUniqueId };
    const updateDoc = {
        $set: { ...projectAssignment },
    };
    return await projectAssignmentModel.updateOne(filter, updateDoc, options);
}

exports.getAssignedProject = async () => {
    return await projectAssignmentModel.find({ isActive: true })
        // .populate({
        //     path: 'owner',
        //     model: 'ClubMember',
        // })
        .sort({ createdOn: 'descending' });
}

exports.getAssignedProjectDetailsById = async (projectAssignUniqueId) => {
    return await projectAssignmentModel.find({ isActive: true, projectAssignUniqueId: projectAssignUniqueId });
}

exports.deleteDetails = async (payload, userId) => {

    const user = await userRepo.getUserDetail(userId);
    let projectIds = [];
    let filteredArray = [];

    if (user) {
        projectIds = user[0].assignedProjects.map(x => x._id.toString());
    }

    let query = null;
    if (payload.length === 0) {
        query = { _id: payload[0] };
    } else {
        let queryList = [];
        payload.forEach(e => {
            queryList.push({ _id: e });
        })
        query = { $or: queryList };
    }

    filteredArray = projectIds.filter(item => !payload.includes(item));
    user['assignedProjects'] = filteredArray;
    await userRepo.updateUser(user);
    const deletedRes = await projectAssignmentModel.deleteMany(query);

    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}