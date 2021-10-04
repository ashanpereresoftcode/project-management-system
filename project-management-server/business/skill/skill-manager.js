const skillRepository = require('../../repository/skill-repository');

exports.saveDetails = async (skillDetails) => {
    try {
        const savedResult = await skillRepository.saveDetails(skillDetails);
        if (savedResult) {
            return {
                validity: true,
                result: savedResult
            }
        } else {
            return {
                validity: false,
                result: null
            }
        }
    } catch (error) {
        throw error;
    }
}

exports.saveDetail = async (skill) => {
    try {
        const savedResult = await skillRepository.save(skill);
        if (savedResult) {
            return {
                validity: true,
                result: savedResult
            }
        } else {
            return {
                validity: false,
                result: null
            }
        }
    } catch (error) {
        throw error;
    }
}

exports.updateDetail = async (skill) => {
    try {
        const updatedResult = await skillRepository.updateDetail(skill);
        if (updatedResult) {
            return {
                validity: true,
                result: updatedResult
            }
        } else {
            return {
                validity: false,
                result: null
            }
        }
    } catch (error) {
        throw error;
    }
}

exports.getAllDetails = async () => {
    try {
        const skills = await skillRepository.getSkillDetails();
        return {
            validity: true,
            result: skills
        }
    } catch (error) {
        throw error;
    }
}

exports.getDetail = async (skillId) => {
    try {
        const skill = await skillRepository.getSkillDetailById(skillId);
        return skill;
    } catch (error) {
        throw error;
    }
}

exports.deleteDetails = async (skillIds) => {
    try {
        const deletedResult = await skillRepository.deleteDetails(skillIds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}