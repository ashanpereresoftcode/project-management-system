const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const skillController = require('../controllers/skill-controller')

const environmentConfigs = process.env

router.get(`${environmentConfigs.skillDetailsAction}`, skillController.validateHeaders(), skillController.getAllDetails)
router.get(`${environmentConfigs.skillDetailAction}`, skillController.validateHeaders(), skillController.getSkill)
router.post(`${environmentConfigs.skillCreateAction}`, skillController.validateHeaders(), skillController.validate('saveSkill'), skillController.saveSkill)
router.post(`${environmentConfigs.skillCollectionAction}`, skillController.validateHeaders(), skillController.saveSkills)
router.put(`${environmentConfigs.skillUpdateAction}`, skillController.validateHeaders(), skillController.validate('updateSkill'), skillController.updateSkill)
router.post(`${environmentConfigs.skillDeleteAction}`, skillController.validateHeaders(), skillController.deleteSkill)

module.exports = router;