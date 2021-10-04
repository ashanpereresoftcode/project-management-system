const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    projectId: { type: String },
    projectName: { type: String },
    projectCode: { type: String },
    projectDescription: { type: String },
    projectStatus: { type: String },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const Project = mongoose.model('Project', projectSchema)
module.exports = Project;