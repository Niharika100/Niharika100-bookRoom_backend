const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const BookRoom = require('../models/bookRoom');

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

// book slots of a 
router.patch('/', (req, res, next) => {
    const id = req.body.roomId;
    const date = req.body.dateToBook;
    const slotsRequired = req.body.slotsRequired;

    for (var j = 0; j < req.body.slotsRequired.length; j++) {
        BookRoom.findOneAndUpdate(
            { roomId: mongoose.Types.ObjectId(id) },
            {
                $push: {
                    "reservations": {
                        "slotNumber": req.body.slotsRequired[j],
                        "userName": req.body.userName
                    }
                }
            }
        ).exec()
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    }
    res.status(200).json({
        message: 'booked'
    })
});

module.exports = router;

// Routing refers to how an application’s endpoints (URIs) respond to client requests. 
// get is a method that handles incoming requests
// POST handle post request
// '/' is used to make it as '/products' bcs if '/products' will be used so the url will become '/products/products'
// products are created in post method