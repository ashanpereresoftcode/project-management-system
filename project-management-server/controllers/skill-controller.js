const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const skillManager = require('../business/skill/skill-manager');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {
    switch (method) {
        case 'saveSkill': {
            return [
                body('skillName', 'Project name is required.').notEmpty(),
            ]
        }
        case 'updateSkill':
            return [
                body('skillName', 'Project name is required.').notEmpty(),
            ]
    }
}

exports.getAllDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const details = await skillManager.getAllDetails();
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

exports.getSkill = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const skillId = req.params.skillId;
            const detail = await skillManager.getDetail(skillId);
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

exports.saveSkills = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors && errors.isEmpty()) {
            const skills = req.body
            if (skills && skills.length > 0) {
                const savedResult = await skillManager.saveDetails(skills)
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

exports.saveSkill = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;

            const skill = {
                skillName: payload.skillName,
                skillCode: payload.skillCode,
                skillDescription: payload.skillDescription,
            }
            const savedResult = await skillManager.saveDetail(skill);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save skill', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.updateSkill = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;

            const skill = {
                _id: payload._id,
                skillId: payload.skillId,
                skillName: payload.skillName,
                skillCode: payload.skillCode,
                skillDescription: payload.skillDescription,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode,
            }

            const updatedResult = await skillManager.updateDetail(skill);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to save skill', success: false })
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
            const skillIds = JSON.parse(req.body.skillIds);
            if (skillIds) {
                const deleted = await skillManager.deleteDetails(skillIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Skill id's required.", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}