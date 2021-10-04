const mongoose = require('mongoose')

const skillSchema = mongoose.Schema({
    skillId: { type: String },
    skillName: { type: String },
    skillCode: { type: String },
    skillDescription: { type: String },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const Skill = mongoose.model('Skill', skillSchema)
module.exports = Skill;