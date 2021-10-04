const assignedSkillRepository = require('../../repository/skill-assignment-repository');

exports.saveAssignedSkills = async (assignedSkillDetails) => {
    try {
        const savedResult = await assignedSkillRepository.saveDetails(assignedSkillDetails);
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

exports.saveAssignedSkill = async (assignedSkill) => {
    try {
        const savedResult = await assignedSkillRepository.save(assignedSkill);
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

exports.updateAssignedSkill = async (assignedSkill) => {
    try {
        const updatedResult = await assignedSkillRepository.updateAssignedSkill(assignedSkill);
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

exports.getAllAssignedSkills = async () => {
    try {
        const assignedSkills = await assignedSkillRepository.getAssignedSkills();
        return {
            validity: true,
            result: assignedSkills
        }
    } catch (error) {
        throw error;
    }
}

exports.getAssignedSkill = async (assignedSkillId) => {
    try {
        const assignedSkill = await assignedSkillRepository.getAssignedDetailById(assignedSkillId);
        return assignedSkill;
    } catch (error) {
        throw error;
    }
}

exports.deleteDetails = async (assignedSkillIds, userId) => {
    try {
        const deletedResult = await assignedSkillRepository.deleteDetails(assignedSkillIds, userId);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}