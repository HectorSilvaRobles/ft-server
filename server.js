require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Connecting Mongoose Database
mongoose.connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('There was an error when connected to MongoDB', err))


// coach user endpoints
app.use('/api/coach-users', require('./apiRoutes/coach_user_route'))

// Athletes Endpoints
app.use('/api/athletes', require('./apiRoutes/athlete_route'));

// Coach to Athlete Endpoints
app.use('/api/coach_to_athlete', require('./apiRoutes/coach_to_athlete_route'))

// get all pending requests
app.use('/api/pending', require('./apiRoutes/pending_route'))



const PORT = process.env.PORT || 4000

app.listen(4000, () => console.log(`server running on port ${PORT}`))