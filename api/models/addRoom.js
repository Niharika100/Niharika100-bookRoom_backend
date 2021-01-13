const mongoose = require('mongoose');

// create a schema of how our data should look like
const addRoomSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type : String, require : true},
    numberOfSeats : {type : Number, require : true},
    floorNumber : {type : String, require : true},
    whiteboard : Boolean,
    roomPic : String,
    conference_cose_in_credits : Number
});
//                             (model name, schema for model)
module.exports = mongoose.model('AddRoom', addRoomSchema);