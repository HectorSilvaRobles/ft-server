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

//enables cors
// app.use(cors())
app.use(cors({credentials: true, origin: 'http://127.0.0.1'}));
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin","http://127.0.0.1");
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header('Access-Control-Allow-Credentials', true);
        next();
});


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