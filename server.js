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

//Enables CORS
// allow multiple origins
var allowedOrigins = ["https://www.abfutboltraining.com/", "https://www.abfutboltraining.com", "http://localhost:3000"];
app.use(cors({
    credentials: true,
    origin: function(origin, callback){
        if(allowedOrigins.indexOf(origin) !== -1){
            callback(null, true)
        } else {
            callback(new Error('not allowed by cors'))
        }
    }
}));

app.use(function(req, res, next) {
        // allow access for multiple origins
        var origin = req.headers.origin;
        if(allowedOrigins.indexOf(origin) > -1){
            res.setHeader("Access-Control-Allow-Origin", origin)
        }

        // res.header("Access-Control-Allow-Origin","http://localhost:3000");
        // res.header("Access-Control-Allow-Origin", "https://www.abfutboltraining.com/","https://www.abfutboltraining.com");
        res.header('Access-Control-Allow-Headers: Accept, Content-Type, X-Requested-With, x-api-key')
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