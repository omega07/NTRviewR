const {Schema, model} = require('mongoose');

const schema = new Schema({
    email: String,
    bug: String
})

module.exports = model("Document", schema);