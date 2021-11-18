const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const assignedSkillManager = require('../business/skill/skill-assignment-manager');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {
    switch (method) {
        case 'saveAssignedSkill': {
            return [
                body('skill', 'Skill is required.').notEmpty(),
                body('rating', 'Rating is required.').notEmpty(),
            ]
        }
        case 'updateAssignedSkill':
            return [
                body('skill', 'Skill is required.').notEmpty(),
                body('rating', 'Rating is required.').notEmpty(),
            ]
    }
}

exports.getAllAssignedSkills = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const details = await assignedSkillManager.getAllAssignedSkills();
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

exports.getAssignedSkill = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const assignedUniqueId = req.params.assignedUniqueId;
            const detail = await assignedSkillManager.getAssignedSkill(assignedUniqueId);
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

exports.saveAssignedSkills = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors && errors.isEmpty()) {
            const skills = req.body
            if (skills && skills.length > 0) {
                const savedResult = await assignedSkillManager.saveAssignedSkills(skills)
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

exports.saveAssignedSkill = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;

            const assignedSkill = {
                skill: payload.skill,
                user: payload.user,
                rating: payload.rating,
                ratingCard: payload.ratingCard,
                comments: payload.comments,
            }
            
            const savedResult = await assignedSkillManager.saveAssignedSkill(assignedSkill);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save skill assignment', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.updateAssignedSkill = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;

            const assignedSkill = {
                _id: payload._id,
                assignedUniqueId: payload.assignedUniqueId,
                user: payload.user,
                skill: payload.skill,
                rating: payload.rating,
                ratingCard: payload.ratingCard,
                comments: payload.comments,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode,
            }

            const updatedResult = await assignedSkillManager.updateAssignedSkill(assignedSkill);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to save assigned skill', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}


exports.deleteSkill = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const assignedSkillIds = JSON.parse(req.body.assignedSkillIds);
            const userId = JSON.parse(req.body.userId);
            if (assignedSkillIds) {
                const deleted = await assignedSkillManager.deleteDetails(assignedSkillIds, userId);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Assigned skill id's required.", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}