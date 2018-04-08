const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projects = new Schema({
 project_id : { type : String },
 title : { type : String},
 description : { type : String, default : null},
 skills_required : { type : Number, default : null},
 employer : { type : String },
 budget_range : { type : Number, default : null},
 hiredbidder : { type : String, default : null},
 hiredbiddername : { type : String, default : null},
 status : { type : String, default : "PENDING"},
 file : { type : String, default : null}
});

module.exports = mongoose.model('projects', projects);