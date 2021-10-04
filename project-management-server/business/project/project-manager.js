const projectRepository = require('../../repository/project-repository');

exports.saveDetails = async (projectDetails) => {
    try {
        const savedResult = await projectRepository.saveDetails(projectDetails);
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

exports.saveDetail = async (project) => {
    try {
        const savedResult = await projectRepository.save(project);
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

exports.updateDetail = async (project) => {
    try {
        const updatedResult = await projectRepository.updateDetail(project);
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
        const projects = await projectRepository.getProjectManagementDetails();
        return {
            validity: true,
            result: projects
        }
    } catch (error) {
        throw error;
    }
}

exports.getDetail = async (projectId) => {
    try {
        const project = await projectRepository.getProjectDetailById(projectId);
        return project;
    } catch (error) {
        throw error;
    }
}

exports.deleteDetails = async (projectIds) => {
    try {
        const deletedResult = await projectRepository.deleteProjectDetail(projectIds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}