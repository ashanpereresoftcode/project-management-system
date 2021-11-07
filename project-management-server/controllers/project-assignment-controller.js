const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const assignedProjectManager = require('../business/project/project-assignment-manager');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {
    switch (method) {
        case 'saveAssignedProject': {
            return [
                body('project', 'Project is required.').notEmpty(),
            ]
        }
        case 'updateAssignedProject':
            return [
                body('project', 'Proejct is required.').notEmpty(),
            ]
    }
}

exports.getAllAssignedProjects = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const details = await assignedProjectManager.getAllAssignedProjects();
            if (details) {
                res.status(201).json(details);
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

exports.getAssignedProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const projectAssignUniqueId = req.params.projectAssignUniqueId;
            const detail = await assignedProjectManager.getAssignedProject(projectAssignUniqueId);
            if (detail) {
                res.status(201).json(detail);
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

exports.saveAssignedProjects = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors && errors.isEmpty()) {
            const projects = req.body
            if (projects && projects.length > 0) {
                const savedResult = await assignedProjectManager.saveAssignedProjects(projects)
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

exports.saveAssignedProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;
            const assignedProject = {
                project: payload.project,
                userId: payload.userId,
                projectAllocation: payload.projectAllocation,
                comments: payload.comments,
            }

            const savedResult = await assignedProjectManager.saveAssignedProject(assignedProject);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save project assignment', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.updateAssignedProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;

            const assignedProject = {
                _id: payload._id,
                projectAssignUniqueId: payload.projectAssignUniqueId,
                project: payload.project,
                userId: payload.userId,
                projectAllocation: payload.projectAllocation,
                comments: payload.comments,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode,
            }

            const updatedResult = await assignedProjectManager.updateAssignedProject(assignedProject);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to save assigned project', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}


exports.deleteProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const assignedProjectIds = JSON.parse(req.body.assignedProjectIds);
            const userId = JSON.parse(req.body.userId);
            if (assignedProjectIds) {
                const deleted = await assignedProjectManager.deleteDetails(assignedProjectIds, userId);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Assigned project id's required.", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}