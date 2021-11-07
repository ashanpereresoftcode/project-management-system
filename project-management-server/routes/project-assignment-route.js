const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const projectAssignmentController = require('../controllers/project-assignment-controller');

const environmentConfigs = process.env;

router.get(`${environmentConfigs.projectAssignmentDetailsAction}`, projectAssignmentController.validateHeaders(), projectAssignmentController.getAllAssignedProjects)
router.get(`${environmentConfigs.projectAssignmentDetailAction}`, projectAssignmentController.validateHeaders(), projectAssignmentController.getAssignedProject)
router.post(`${environmentConfigs.projectAssignmentCreateAction}`, projectAssignmentController.validateHeaders(), projectAssignmentController.validate('saveAssignedProject'), projectAssignmentController.saveAssignedProject)
router.post(`${environmentConfigs.projectAssignmentCollectionAction}`, projectAssignmentController.validateHeaders(), projectAssignmentController.saveAssignedProjects)
router.put(`${environmentConfigs.projectAssignmentUpdateAction}`, projectAssignmentController.validateHeaders(), projectAssignmentController.validate('updateAssignedProject'), projectAssignmentController.updateAssignedProject)
router.post(`${environmentConfigs.projectAssignmentDeleteAction}`, projectAssignmentController.validateHeaders(), projectAssignmentController.deleteProject)


module.exports = router;