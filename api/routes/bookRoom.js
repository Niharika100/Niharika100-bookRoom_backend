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

router.patch('/', (req, res, next) => {
    var flag = 0;
    const id = req.body.roomId;
    const date = req.body.dateToBook;
    const slotsRequired = req.body.slotsRequired;
    BookRoom.findOne({ roomId: mongoose.Types.ObjectId(id)})
        .exec()
        .then(data => {
            for (var i = 0; i < slotsRequired.length; i++) {
                for (var j = 0; j < data.reservations.length; j++) {
                    console.log(data.reservations[j].slotNumber + " " + slotsRequired[i]);
                    if (data.reservations[j].slotNumber.includes(slotsRequired[i])) {
                        console.log("found the match " + data.reservations[j].slotNumber + " " + slotsRequired[i]);
                        flag = 1;
                        next();
                        // break;
                        // return res.json({
                        //     message: 'slots alerady booked'
                        // });
                    }
                }
            }
            if(flag == 0){
                flag = 2;
                // return res.json({
                //     message: 'slots will be booked'
                // });
            }
        })
        .catch(err => {
            console.log(err);
        });

    if (flag == 2) {
        console.log("No match found")
        BookRoom.findOneAndUpdate(
            { roomId: mongoose.Types.ObjectId(id), dateToBook: date },
            // {"$where" : "req.body.slotsRequired[i] != doc.reservations[]slotNumber"},
            {
                // function (err,doc){
                //     if(req.body.slotsRequired[i] in doc.reservations && req.body.dateToBook == doc.dateToBook){
                //             console.log('Slots already booked')
                //             res.end()
                //     }
                // },
                $push: {
                    "reservations": {
                        "slotNumber": req.body.slotsRequired,
                        "userName": req.body.userName
                    }
                }
            },
            // function(err,result){
            //     if(err){
            //         res.status(500).json({ error: err });
            //     }
            //     else{
            //         res.status(200).json({
            //             message: 'booked'
            //         })
            //     }
            // }
        ).exec()
        .then(data => {
            // if(slotsRequired[i] in slotNumber){

            // }
            console.log(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
            res.end();
        });
        res.status(200).json({ 
            message : 'booked'
         });
    }
    // if(flag == 2){
    // }
    // else if(flag == 1){
    //     res.status(404).json({
    //         message : 'slots already booked'
    //     });
    // }
});

// book slots of a 
// router.patch('/', (req, res, next) => {
//     const id = req.body.roomId;
//     const date = req.body.dateToBook;
//     const slotsRequired = req.body.slotsRequired;

//     for (var j = 0; j < req.body.slotsRequired.length; j++) {
//         BookRoom.findOneAndUpdate(
//             { roomId: mongoose.Types.ObjectId(id) },
//             {
//                 $push: {
//                     "reservations": {
//                         "slotNumber": req.body.slotsRequired[j],
//                         "userName": req.body.userName
//                     }
//                 }
//             }
//         ).exec()
//             .then(data => {
//                 console.log(data);
//             })
//             .catch(err => {
//                 console.log(err);
//                 res.status(500).json({ error: err });
//             });
//     }
//     res.status(200).json({
//         message: 'booked'
//     })
// });

module.exports = router;

// Routing refers to how an application’s endpoints (URIs) respond to client requests. 
// get is a method that handles incoming requests
// POST handle post request
// '/' is used to make it as '/products' bcs if '/products' will be used so the url will become '/products/products'
// products are created in post method
