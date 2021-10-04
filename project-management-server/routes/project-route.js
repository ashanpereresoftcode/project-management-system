const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const projectController = require('../controllers/project-controller')

const environmentConfigs = process.env

router.get(`${environmentConfigs.projectDetailsAction}`, projectController.validateHeaders(), projectController.getAllDetails)
router.get(`${environmentConfigs.projectDetailAction}`, projectController.validateHeaders(), projectController.getProjectDetail)
router.post(`${environmentConfigs.projectCreateAction}`, projectController.validateHeaders(), projectController.validate('saveProject'), projectController.saveProject)
router.post(`${environmentConfigs.projectCollectionAction}`, projectController.validateHeaders(), projectController.saveProjects)
router.put(`${environmentConfigs.projectUpdateAction}`, projectController.validateHeaders(), projectController.validate('updateProject'), projectController.updateProject)
router.post(`${environmentConfigs.projectDeleteAction}`, projectController.validateHeaders(), projectController.deleteProjects)

module.exports = router;