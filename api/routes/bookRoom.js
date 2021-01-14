const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const BookRoom = require('../models/bookRoom');
const addRoomData = require('../models/addRoom');

router.get('/', (req, res, next) => {
    BookRoom.find()
        .select('roomId dateToBook reservations')
        .exec()
        .then(data => {
            console.log(data);
            res.status(201).json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post('/', (req, res, next) => {
    const id = req.body.roomId;
    const BookingData = new BookRoom(
        {
            roomId: id,
            dateToBook: req.body.dateToBook,
            reservations: [
                {
                    slotNumber: req.body.slotsRequired,
                    userName: req.body.userName
                }
            ]
        });

    BookingData.save()
        .then(data => {
            console.log(data);
            res.status(201).json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch('/', async function (req, res, next) {
    addRoomData.findById(req.body.roomId)
        .then(async rooms => {
            const id = req.body.roomId;
            const date = req.body.dateToBook;
            const slotsRequired = req.body.slotsRequired;
            var slots = [];
            var DBDate = null;
            debugger;
            const DataId = addRoomData._id;
            console.log(DataId);

            const retData = await findDetails();
            function findDetails() {
                try {
                    return BookRoom.find({ roomId: mongoose.Types.ObjectId(id), dateToBook: date });
                }
                catch (error) {
                    console.log(error);
                }
            }

            if (retData.length == 0) {
                console.log('no data found');
                console.log(slotsRequired.length)
                if (slotsRequired.length > 1) {
                    const BookingData = new BookRoom(
                        {
                            roomId: id,
                            dateToBook: date,
                            reservations: [
                                {
                                    slotNumber: slotsRequired[0],
                                    userName: req.body.userName
                                }
                            ]
                        }
                    );

                    BookingData.save()
                        .then(data => {
                            console.log(data);
                            updateData(1);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err });
                        });
                    console.log('data Saved');
                }
                else {
                    updateData(0);
                }

            }
            else {
                DBDate = retData[0].dateToBook;
                for (var i = 0; i < retData[0].reservations.length; i++) {
                    slots[i] = retData[0].reservations[i].slotNumber;
                }
                console.log(slots);
                updateData(0);
            }

            function updateData(val) {
                for (var j = val; j < slotsRequired.length; j++) {
                    if (slots.includes(slotsRequired[j])) {
                        console.log(slotsRequired[j] + ' Slot already booked');
                        flag = 1;
                    }
                    else {
                        BookRoom.updateOne(
                            {
                                roomId: mongoose.Types.ObjectId(id),
                                dateToBook: date
                            },
                            {
                                $addToSet: {
                                    "reservations": {
                                        "slotNumber": req.body.slotsRequired[j],
                                        "userName": req.body.userName
                                    }
                                }
                            })
                            .exec()
                            .then(data => {
                                console.log(data);
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({ error: err });
                            });
                    }
                }
            }
            res.status(200).json({
                message: 'Executed'
            });
        }
        )
        .catch(err => {
            res.status(500).json({
                message: 'room not found',
                error: err
            });
        });
});

module.exports = router;

// Routing refers to how an application’s endpoints (URIs) respond to client requests. 
// get is a method that handles incoming requests
// POST handle post request
// '/' is used to make it as '/products' bcs if '/products' will be used so the url will become '/products/products'
// products are created in post method
