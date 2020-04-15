const express = require('express');
const router = express.Router();
const {Pending} = require('../models/pendingSchema')


// Send requests to pending list
router.post('/send-request', (req, res) => {
    const newRequest = new Pending(req.body)
    newRequest.save((err, doc) => {
        if(err){
            return res.status(400).json({
                success: false,
                message: 'Error saving request in pending list',
                error: err
            })
        }
        return res.status(200).json({
            success: true,
            newRequest: newRequest
        })
    })
})


// Get all request in pending list
router.get('/all-requests', (req, res) => {
    Pending.find()
    .then(requests => res.status(200).json({
        success: true,
        all_pending_requests: requests
    }))
})


// Remove requests after the admin approves or rejects
router.delete('/remove/:request_id', (req, res) => {
    const param = req.params.request_id

    Pending.findById(param)
    .then(request => request.remove()
        .then(() => res.status(200).json({
            success: true,
            message: 'Successfully removed request from pending list',
            removedRequest: request
        })
        ).catch(err => res.status(400).json({
            success: false,
            error: err,
            message: 'failed to remove request from pending list'
        }))
    ).catch(err => res.status(400).json({
        success: false,
        error: err
    }))
})


module.exports = router