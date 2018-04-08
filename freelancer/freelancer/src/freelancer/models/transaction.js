const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transaction = new Schema({
 email : { type : String},
 transaction_details : {type : Object}
});

module.exports = mongoose.model('transaction', transaction);