const mongoose = require('mongoose');
const skillAssignmentModel = require('../models/skill-assignment');
const userRepo = require('../repository/user-repository');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveDetails = async (assignmentDetails) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    if (assignmentDetails && assignmentDetails.length > 0) {

        assignmentDetails.forEach(skill => {
            skill.assignedUniqueId = uuidv4();
            skill.isActive = true;
            skill.createdOn = new Date();
            skill.createdBy = headerDetails.user;
            skill.clientTenentId = headerDetails.clientId;
            skill.countryCode = headerDetails.countryCode;
        });

        const session = await mongoose.startSession();

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        try {
            await session.withTransaction(async () => {
                const savedResult = await skillAssignmentModel.insertMany(assignmentDetails);
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

exports.save = async (skillAssignmentDetail) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    skillAssignmentDetail.assignedUniqueId = uuidv4();
    skillAssignmentDetail.isActive = true;
    skillAssignmentDetail.createdOn = new Date();
    skillAssignmentDetail.createdBy = headerDetails.user;
    skillAssignmentDetail.clientTenentId = headerDetails.clientId;
    skillAssignmentDetail.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const savedRes = await skillAssignmentModel.create(skillAssignmentDetail);
            const result = await userRepo.getUserById(skillAssignmentDetail.user);
            if (result && result.length > 0) {
                const user = result[0];
                if (user['assignedSkills'] && user['assignedSkills'].length > 0) {
                    const skillIds = user.assignedSkills.map(x => x._id.toString());
                    skillIds.push(savedRes._id.toString());
                    user['assignedSkills'] = [];
                    user.assignedSkills = skillIds;
                } else {
                    user['assignedSkills'] = [].concat(savedRes._id.toString());
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

    return await skillAssignmentModel.find({ ...query, isActive: true })
        // .populate({
        //     path: 'owner',
        //     model: 'ClubMember',
        // })
        .sort({ createdOn: 'descending' });
}

exports.updateAssignedSkill = async (skillAssignment) => {
    const headerDetails = headerReader.getHeaderDetails();
    skillAssignment.clientTenentId = headerDetails.clientId;
    skillAssignment.countryCode = headerDetails.countryCode;
    skillAssignment.modifiedBy = headerDetails.user;
    skillAssignment.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { assignedUniqueId: skillAssignment.assignedUniqueId };
    const updateDoc = {
        $set: { ...skillAssignment },
    };

    const result = await userRepo.getUserById(skillAssignment.user);
    if (result && result.length > 0) {
        const user = result[0];
        if (user['assignedSkills'] && user['assignedSkills'].length > 0) {
            const skillIds = user.assignedSkills.filter(x => x._id !== skillAssignment.skill).map(i => i._id)
            user.assignedSkills = skillIds;
        }
        await userRepo.updateUser(user);
        console.log('Successfully updated the user.');
    } else {
        console.log('Failed to load user .');
    }
    return await skillAssignmentModel.updateOne(filter, updateDoc, options);
}

exports.getAssignedSkills = async () => {
    return await skillAssignmentModel.find({ isActive: true })
        .populate({
            path: "user",
            model: "User",
            match: { isActive: true },
            select: "-password -passwordSalt"
        })
        .populate({
            path: "skill",
            model: "Skill",
            match: { isActive: true },
        })
        .sort({ createdOn: 'descending' });
}

exports.getAssignedDetailById = async (assignedUniqueId) => {
    return await skillAssignmentModel.find({ isActive: true, assignedUniqueId: assignedUniqueId });
}

exports.deleteDetails = async (payload, userId) => {

    const user = await userRepo.getUserById(userId);
    let skillIds = [];
    let filteredArray = [];

    if (user) {
        skillIds = user[0].assignedSkills.map(x => x._id.toString());
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

    filteredArray = skillIds.filter(item => !payload.includes(item));
    user['assignedSkills'] = filteredArray;
    const updatedRes = await userRepo.updateUser(user);

    const deletedRes = await skillAssignmentModel.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}