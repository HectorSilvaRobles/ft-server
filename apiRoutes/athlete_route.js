const express = require('express');
const router = express.Router();
const {Athletes} = require('../models/athleteSchema');

// Adding new athlete to database endpoint
router.post('/add-athlete', (req, res) => {
    // creating a new athlete
    const athlete = new Athletes(req.body)

    athlete.save((err, doc) => {
        if(err){
            return res.status(400).json({
                message: 'Could not add new athlete to database',
                error: err
            })
        }

        return res.status(200).json({
            success: true,
            new_athlete: athlete
        })
    })
})


// Removing Athelte from database, endpoint
router.delete('/remove-athlete/:id', (req, res) => {
    Athletes.findById(req.params.id)
    .then(athlete => athlete.remove()
        .then(() => res.status(200).json({
            success: true,
            removedAthlete: athlete
            })
        )
        .catch(err => res.status(400).json({
            success: false,
            error: err
        }))
    )
    .catch(err => res.status(400).json({
        success: false,
        error: err
    }))
})


// Getting all athletes in Athlete schema in database, endpoint
router.get('/all-athletes', (req, res) => {
    Athletes.find()
        .then(athletes => res.status(200).json({
            success: true,
            all_Athletes: athletes
        }))
})


// get a specific player from Athlete schema in database
router.get('/get-this-athlete/:athlete_id', (req, res) => {
    const param = req.params.athlete_id

    Athletes.findById(param)
    .then(athlete => res.status(200).json({
        success: true,
        specificAthlete: athlete
    }))
    .catch(err => res.status(400).json({
        success: false,
        message: 'could not get specific athlete'
    }))
    
})


// Update athlete details in database, endpoint
router.put('/update-athlete/:athlete_id', (req, res, next) => {
    var param = req.params.athlete_id
    Athletes.findByIdAndUpdate(param, req.body, (err, updated_athlete) => {
        if(err){
            return res.status(400).json({
                message: 'Could not update athlete information',
                error: err
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully updated athletes information',
            updated_athlete: updated_athlete
        })
    })
})


module.exports = router