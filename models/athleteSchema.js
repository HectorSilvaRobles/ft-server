const mongoose = require('mongoose');

const coachPostsSchema = mongoose.Schema({
    coach_writer: {
        type: String
    },
    coach_id : {
        type: String
    },
    coach_profile_pic: {
        type: String
    }, 
    date_of_post : {
        type: String
    },
    coach_message: {
        type: String,
        maxlength: 280,
        minglength: 10
    },
    type_of_post : {
        type: String
    },
    position : {
        type: String
    }
})


const highlightSchema = mongoose.Schema({
    coach_writer: {
        type: String
    },
    coach_id: {
        type: String
    },
    video_link : {
        type: String
    },

    video_thumbnail : {
        type: String
    },
    date_of_post : {
        type : String
    }
})


const performanceLog = mongoose.Schema({
    coach_writer: {
        type: String
    },
    date_of_post : {
        type: String
    },
    leadership_rating : {
        type: Number
    },
    focus_rating : {
        type: Number
    },
    energy_rating: {
        type: Number
    }
})


const athleteSchema = mongoose.Schema({
    athlete_pic : {
        type: String
    },
    lastname: {
        type: String,
        maxlength: 70
    },
    firstname: {
        type: String,
        maxlength:70
    },
    age : {
        type: Number
    },
    coach_posts: [coachPostsSchema],
    performance_logs : [performanceLog],
    highlights: [highlightSchema]
})


const Athletes = mongoose.model('Athlete', athleteSchema)

module.exports = {Athletes}