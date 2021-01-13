const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// import model
const AddRoom = require('../models/addRoom');

// handle incoming GET requests to /orders
router.get('/', (req, res, next) => {
    AddRoom.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    })
});

// store data in db
router.post('/', (req, res, next) => {
    const roomDetails = new AddRoom({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        numberOfSeats: req.body.numberOfSeats,
        floorNumber: req.body.floorNumber,
        whiteboard: req.body.whiteboard,
        roomPic : req.body.roomPic,
        conference_cost_in_credits: req.body.conference_cost_in_credits
    });

    roomDetails
    .save()
    .then(item => {
        console.log(item);
        res.status(201).json({
            message: 'room was created',
            Room: roomDetails
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    });

    
});

// fetch data of /order/roomId
router.get('/:roomId', (req, res, next) => {
    const id = req.params.roomId;
    AddRoom.findById(id)
    .exec()
    .then(doc => {
        console.log("roomDetails",doc);
        if(doc){
            res.status(200).json(doc);
        }
        else{
            res.status(404).json({message : "id not found"})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    });
});

module.exports = router;