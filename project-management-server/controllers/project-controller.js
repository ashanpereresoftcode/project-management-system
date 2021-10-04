const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const projectManager = require('../business/project/project-manager');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {
    switch (method) {
        case 'saveProject': {
            return [
                body('projectName', 'Project name is required.').notEmpty(),
                body('projectCode', 'Project code is required.').notEmpty(),
            ]
        }
        case 'updateProject':
            return [
                body('projectName', 'Project name is required.').notEmpty(),
                body('projectCode', 'Project code is required.').notEmpty(),
            ]
    }
}

exports.getAllDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const projectDetails = await projectManager.getAllDetails();
            if (projectDetails) {
                res.status(201).json(projectDetails);
            } else {
                res.status(202).json(null)
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.getProjectDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const projectId = req.params.projectId;
            const projectDetail = await projectManager.getDetail(projectId);
            if (projectDetail) {
                res.status(201).json(projectDetail);
            } else {
                res.status(202).json(null)
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.saveProjects = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors && errors.isEmpty()) {
            const projects = req.body
            if (projects && projects.length > 0) {
                const savedResult = await projectManager.saveDetails(projects)
                if (savedResult.validity) {
                    res.status(201).json(savedResult)
                } else {
                    res.status(500).json({ error: savedResult.error, success: false })
                }
            } else {
                res.status(400).json({ error: "Invalid model", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.saveProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;

            const project = {
                projectName: payload.projectName,
                projectCode: payload.projectCode,
                projectDescription: payload.projectDescription,
                projectStatus: payload.projectStatus,
            }
            const savedResult = await projectManager.saveDetail(project);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save project', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.updateProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;

            const project = {
                _id: payload._id,
                projectId: payload.projectId,
                projectName: payload.projectName,
                projectCode: payload.projectCode,
                projectDescription: payload.projectDescription,
                projectStatus: payload.projectStatus,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await projectManager.updateDetail(project);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to save project', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.deleteProjects = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const projectIds = JSON.parse(req.body.projectIds);
            if (projectIds) {
                const deleted = await projectManager.deleteDetails(projectIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Project id's required.", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error, success: false })
    }
}