const mongoose = require('mongoose');
const skillModel = require('../models/skill');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveDetails = async (skillDetails) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    if (skillDetails && skillDetails.length > 0) {
        
        skillDetails.forEach(skill => {
            skill.skillId = uuidv4();
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
                const savedResult = await skillModel.insertMany(skillDetails);
                if (savedResult) {
                    response = {};
                    response['skillDetails'] = savedResult;
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

exports.save = async (skillDetail) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    skillDetail.skillId = uuidv4();
    skillDetail.isActive = true;
    skillDetail.createdOn = new Date();
    skillDetail.createdBy = headerDetails.user;
    skillDetail.clientTenentId = headerDetails.clientId;
    skillDetail.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const savedFarm = await skillModel.create(skillDetail);

            if (savedFarm) {
                response = {};
                response['skillDetail'] = savedFarm;
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

    return await skillModel.find({ ...query, isActive: true })
        // .populate({
        //     path: 'owner',
        //     model: 'ClubMember',
        // })
        .sort({ createdOn: 'descending' });
}

exports.updateDetail = async (skillAssessment) => {
    const headerDetails = headerReader.getHeaderDetails();
    skillAssessment.clientTenentId = headerDetails.clientId;
    skillAssessment.countryCode = headerDetails.countryCode;
    skillAssessment.modifiedBy = headerDetails.user;
    skillAssessment.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { skillId: skillAssessment.skillId };
    const updateDoc = {
        $set: { ...skillAssessment },
    };
    return await skillModel.updateOne(filter, updateDoc, options);
}

exports.getSkillDetails = async () => {
    return await skillModel.find({ isActive: true })
        // .populate({
        //     path: 'owner',
        //     model: 'ClubMember',
        // })
        .sort({ createdOn: 'descending' });
}

exports.getSkillDetailById = async (skillId) => {
    return await skillModel.find({ isActive: true, skillId: skillId });
}


exports.deleteDetails = async (payload) => {
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

    const deletedRes = await skillModel.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}