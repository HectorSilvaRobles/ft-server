const express = require('express');
const router = express.Router();
const {Athletes} = require('../models/athleteSchema')


// Create a new coach post 
router.put('/coach-post/:athlete_id', (req, res, next) => {
    const param = req.params.athlete_id
    
    Athletes.findByIdAndUpdate(param, { $push: req.body }, (err, updated_athlete) => {
        if(err){
            return res.status(400).json({
                message: 'Could not create new coach post to athlete newsfeed',
                error: err
            })
        }

        return res.status(200).json({
            success: true,
            message: "Successfully created a new coach post to athlete's newsfeed",
            created_post: updated_athlete
        })
    })
})



// Removing coach post
router.put('/remove-coach-post/:athlete_id', (req, res) => {
    console.log('this is req.body', req.body)
    console.log('this is param', req.params)
    const param = req.params.athlete_id
    const post = req.body.post_id

    Athletes.updateOne(
        {_id: param}, 
        {$pull : {'coach_posts' : {"_id" : post}}}
    ).then(() => res.status(200).json({
        success: true,
        message: "Successfully removed a coach post from athlete's newsfeed"
    }))
    .catch(err => res.status(400).json({
        success: false,
        message: "Could not remove coach post from athlete's newsfeed",
        error: err
    }))
})



// create a performance log for specific athlete
router.put('/performance-log/:athlete_id', (req, res) => {
    const param = req.params.athlete_id

    Athletes.findByIdAndUpdate(param, {$push : req.body}, (err , updatedAthlete) => {
        if(err){
            return res.status(400).json({
                success: false,
                error: err,
                message: 'could not make a new performance log for athlete'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'successfully created performance log for athlete',
            updatedAthlete: updatedAthlete
        })
    })
})



router.put('/upload-highlight/:athlete_id', (req, res) => {
    const param = req.params.athlete_id

    Athletes.findByIdAndUpdate(param, {$push : req.body}, (err, updatedAthlete) => {
        if(err){
            return res.status(400).json({
                success: false,
                error: err,
                message: 'could not save video highlight for athlete'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully created performance log for athlete'
        })
    })
 
})

module.exports = router