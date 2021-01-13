const mongoose = require('mongoose');

const bookRoomSchema = mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'addroom', require : true },
    dateToBook: {type : String, require : true},
    reservations: {
        type: mongoose.Schema.Types.Array, default: [{
            slotNumber: {type : Number, require : true, unique : true},
            userName: {type : String, require : true}
        }]
    }
});
bookRoomSchema.index({ roomId: 1, dateToBook: 1 }, { unique: true });

module.exports = mongoose.model('BookRoom', bookRoomSchema);