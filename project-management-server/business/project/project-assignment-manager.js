const assignedProjectRepository = require('../../repository/project-assignment-repository');

exports.saveAssignedProjects = async (assignedProjects) => {
    try {
        const savedResult = await assignedProjectRepository.saveDetails(assignedProjects);
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

exports.saveAssignedProject = async (assignProject) => {
    try {
        const savedResult = await assignedProjectRepository.save(assignProject);
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

exports.updateAssignedProject = async (assignedProject) => {
    try {
        const updatedResult = await assignedProjectRepository.updateAssignedProject(assignedProject);
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

exports.getAllAssignedProjects = async () => {
    try {
        const assignedSkills = await assignedProjectRepository.getAssignedProject();
        return {
            validity: true,
            result: assignedSkills
        }
    } catch (error) {
        throw error;
    }
}

exports.getAssignedProject = async (assignedProjectId) => {
    try {
        const assignedSkill = await assignedProjectRepository.getAssignedProjectDetailsById(assignedProjectId);
        return assignedSkill;
    } catch (error) {
        throw error;
    }
}

exports.deleteDetails = async (assignedProjectIds, userId) => {
    try {
        const deletedResult = await assignedProjectRepository.deleteDetails(assignedProjectIds, userId);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}