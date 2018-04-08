const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var users = new Schema({
 name : { type : String},
 email : { type : String},
 password : { type : String},
 phone_number : { type : Number, default : null},
 skills : { type : String,default : null},
 about_me : { type : String, default : null},
 profile_image : { type : String, default : null},
 assigned_project_id: { type : Array },
 balance : {type : Number, default : 0},
 transaction : {type : String}
});

module.exports = mongoose.model('User', users);