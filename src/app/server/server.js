const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');
const bodyParser = require('body-parser');
// package to generate universally unique identifiers (UUIDs)
const { v4: uuidv4 } = require('uuid');
// connect to mongoDB
const mongoose = require('mongoose');
// import mongoose models
const { Highscore, HighscoreList, User } = require('../models/db-schemas.model.ts');

// start my-mongodb container directly in Docker dashboard
// or start a new container with:
// $ docker run --name my-mongodb-container -p 27017:27017 -d mongo

// connection URL to MongoDB running on Docker
const mongoURL = 'mongodb://localhost:27017/my-mongodb';

// Connect to MongoDB
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Test connection to MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// bodyParser parses the request body and makes it available as req.body object
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// enable cross-origin requests
app.use(cors());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// users POST Route
// creates a new user with a token or returns an error if the user email already exists in the DB
app.post('/users', async (req, res) => {
    // extract data from the post request using the req.body object
    // destructuring assignment:
    // takes the email and password (keys in post request) values and stores them in the email, password variables
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        // check if user already exists
        if (existingUser) {
            // send error response
            return res.status(400).json({ error: 'Email already in use' });
        }
        // generate token for this user
        const token = uuidv4();
        // create new user
        const newUser = new User({ email, password, token });
        // save user to the database
        await newUser.save().exec();
        // send success response
        res.status(201).json({ message: 'User registered successfully', token })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Sessions POST routes
// logs user in by setting a new access token or returns an error if the user credentials are invalid
app.post('/sessions', async (req, res) => {
    // get user credentials from request body
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email, password });

        // check if login credentials are valid
        if (existingUser) {
            // set token for user if not set yet
            if (!existingUser.token) {
                // generate new token
                const newToken = uuidv4();
                // set new token for this user
                existingUser.token = newToken;
                // save to DB
                existingUser.save();
            }
            // send success response
            res.status(200).json({ message: 'Login successful', username: existingUser.email, token: existingUser.token });
        }
        // send error response
        else {
            res.status(401).json({ message: 'Invalid credentials' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Sessions DELETE route
// logs user out by deleting the access token or returns an error if the token does not exist or is invalid
app.delete('/sessions', async (req, res) => {
    // get token from the request headers with the authorization key
    const token = req.headers.authorization?.split(' ')[1];

    try {
        // check if a token was sent in the header
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // find the user with this token
        const user = await User.findOne({ token });

        // check if user with this token exists in the DB
        if (user) {
            // set user's token to null
            user.token = null;
            // sav changes to user
            await user.save();
            // return success response
            return res.status(200).json({ message: 'Logout successful.' });
        }
        // send error response if token is invalid
        return res.status(401).json({ message: 'Invalid token' });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }

})

// Highscores POST route
// updates the highscore for this user in the HighScoreList
// or adds a new highscore entry to the HighScoreList if there is no entry with this username yet
app.post('/highscores', async (req, res) => {
    const { username, score } = req.body;

    try {
        // Find the existing highscore list or create a new one if it doesn't exist
        let highscoreList = await HighscoreList.findOne();

        if (!highscoreList) {
            highscoreList = new HighscoreList();
        }

        // search for this username in the highscores list
        const existingUserInList = highscoreList.highscores.find(
            (highscore) => highscore.username === username
        );

        // check if username already exists in the highscores list
        if (existingUserInList) {
            // update highscore for this username with new score
            existingUserInList.score = score;
        }
        // create new highscore entry for this user
        else {
            // create new highscore entry with username and score
            const newHighscore = new Highscore({ username, score });
            // push new entry to the list
            highscoreList.highscores.push(newHighscore);
        }

        // save new highscore
        await highscoreList.save();
        // send success status code and success message
        res.status(201).json({ message: 'Highscore added successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Highscores GET route
// returns all unique highscores from HighscoreList in the database
app.get('/highscores', async (req, res) => {
    try {
        // retrieve HighscoreList from the database
        const highscoreList = await HighscoreList.findOne();
        // extract highscores array from the list
        const highscores = highscoreList.highscores;
        // send highscores array as json object
        res.status(200).json(highscores);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})