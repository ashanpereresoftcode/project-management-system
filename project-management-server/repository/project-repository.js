const mongoose = require('mongoose');
const projectManagementModel = require('../models/project-management');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveDetails = async (projectManagementDetail) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    if (projectManagementDetail && projectManagementDetail.length > 0) {
        
        projectManagementDetail.forEach(harvest => {
            harvest.projectId = uuidv4();
            harvest.isActive = true;
            harvest.createdOn = new Date();
            harvest.createdBy = headerDetails.user;
            harvest.clientTenentId = headerDetails.clientId;
            harvest.countryCode = headerDetails.countryCode;
        });

        const session = await mongoose.startSession();

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        try {
            await session.withTransaction(async () => {
                const savedResult = await projectManagementModel.insertMany(projectManagementDetail);
                if (savedResult) {
                    response = {};
                    response['projectDetail'] = savedResult;
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

exports.save = async (projectManagement) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    projectManagement.projectId = uuidv4();
    projectManagement.isActive = true;
    projectManagement.createdOn = new Date();
    projectManagement.createdBy = headerDetails.user;
    projectManagement.clientTenentId = headerDetails.clientId;
    projectManagement.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const savedFarm = await projectManagementModel.create(projectManagement);

            if (savedFarm) {
                response = {};
                response['projectDetail'] = savedFarm;
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

    return await projectManagementModel.find({ ...query, isActive: true })
        // .populate({
        //     path: 'owner',
        //     model: 'ClubMember',
        // })
        .sort({ createdOn: 'descending' });
}

exports.updateDetail = async (projectManagement) => {
    const headerDetails = headerReader.getHeaderDetails();
    projectManagement.clientTenentId = headerDetails.clientId;
    projectManagement.countryCode = headerDetails.countryCode;
    projectManagement.modifiedBy = headerDetails.user;
    projectManagement.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { projectId: projectManagement.projectId };
    const updateDoc = {
        $set: { ...projectManagement },
    };
    return await projectManagementModel.updateOne(filter, updateDoc, options);
}

exports.getProjectManagementDetails = async () => {
    return await projectManagementModel.find({ isActive: true })
        // .populate({
        //     path: 'owner',
        //     model: 'ClubMember',
        // })
        .sort({ createdOn: 'descending' });
}

exports.getProjectDetailById = async (projectId) => {
    return await projectManagementModel.find({ isActive: true, projectId: projectId });
}


exports.deleteProjectDetail = async (payload) => {
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

    const deletedRes = await projectManagementModel.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}