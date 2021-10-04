const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const skillAssignmentController = require('../controllers/skill-assignment-controller');

const environmentConfigs = process.env;

router.get(`${environmentConfigs.skillAssignmentDetailsAction}`, skillAssignmentController.validateHeaders(), skillAssignmentController.getAllAssignedSkills)
router.get(`${environmentConfigs.skillAssignmentDetailAction}`, skillAssignmentController.validateHeaders(), skillAssignmentController.getAssignedSkill)
router.post(`${environmentConfigs.skillAssignmentCreateAction}`, skillAssignmentController.validateHeaders(), skillAssignmentController.validate('saveAssignedSkill'), skillAssignmentController.saveAssignedSkill)
router.post(`${environmentConfigs.skillAssignmentCollectionAction}`, skillAssignmentController.validateHeaders(), skillAssignmentController.saveAssignedSkills)
router.put(`${environmentConfigs.skillAssignmentUpdateAction}`, skillAssignmentController.validateHeaders(), skillAssignmentController.validate('updateAssignedSkill'), skillAssignmentController.updateAssignedSkill)
router.post(`${environmentConfigs.skillAssignmentDeleteAction}`, skillAssignmentController.validateHeaders(), skillAssignmentController.deleteSkill)


module.exports = router;