const mongoose = require('mongoose')

const assignedSkillSchema = mongoose.Schema({
    assignedUniqueId: { type: String },
    userId: { type: String },
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: false },
    rating: { type: String },
    ratingCard: { type: String },
    comments: { type: String },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const AssignedSkill = mongoose.model('AssignedSkill', assignedSkillSchema)
module.exports = AssignedSkill;