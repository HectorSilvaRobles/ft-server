const mongoose = require('mongoose');

const pendingSchema = mongoose.Schema({
    coach_writer: {
        type: String
    },
    coach_profile_pic : {
        type: String
    },
    dataToSubmit : {
        type: Object
    },
    typeOfEndpoint: {
        type: String
    }
})

const Pending = mongoose.model('Pending Requests', pendingSchema);

module.exports = {Pending}