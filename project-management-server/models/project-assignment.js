const mongoose = require('mongoose')

const projectAssignmentSchema = mongoose.Schema({
    projectAssignUniqueId: { type: String },
    userId: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false },
    projectAllocation: { type: String },
    comments: { type: String },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const AssignedProjects = mongoose.model('AssignedProjects', projectAssignmentSchema)
module.exports = AssignedProjects;