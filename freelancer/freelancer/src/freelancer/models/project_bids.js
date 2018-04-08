const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var project_bids = new Schema({
 bid_id : { type : String },
 project_id : { type : String},
 days : { type : Number, default : null},
 usd : { type : Number, default : null},
 bidder_email : { type : String },
 bidder_name : { type : String }
});

module.exports = mongoose.model('project_bids', project_bids);