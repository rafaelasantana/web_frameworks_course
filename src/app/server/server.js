const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');
const bodyParser = require('body-parser');
// package to generate universally unique identifiers (UUIDs)
const { v4: uuidv4 } = require('uuid');

// in-memory database of users with default user
const usersDB = [
    {
        email: 'test@test.at',
        password: '12345678',
        token: uuidv4()
    }
];

// in-memory database of highscores
const highscoresDB = [];

// bodyParser parses the request body and makes it available as req.body object
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// enable cross-origin requests
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// users POST Route
app.post('/users', (req, res) => {
    // extract data from the post request using the req.body object
    // destructuring assignment:
    // takes the email and password (keys in post request) values and stores them in the email, password variables
    const { email, password } = req.body;

    // check if email already exists in the in-memory database
    if (usersDB.includes(email)) {
        // return error message (400 status -> bad request)
        return res.status(400).json({ error: 'email already exists'});
    }

    // generate token for this user
    const token = uuidv4();

    // add email, password and token to the in-memory database
    usersDB.push({ email, password, token });

    // send success response to client with the authentification token (200 status -> OK)
    res.status(201).json({ message: 'User registered successfully', token });
});

// Sessions DELETE route
app.delete('/sessions', (req, res) => {
    // get token from the request headers
    const token = req.headers.authorization?.split(' ')[1];

    console.log('token: ' + token);
    // check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized'});
    }
    // get index for the user with this token in the in-memory db
    const userIndex = usersDB.findIndex((user) => user.token === token);

    // check if the index is valid
    if (userIndex !== -1) {
        // set user's token to null
        usersDB[userIndex].token = null;
        // return success response
        return res.status(200).json({ message: 'Logout successful.'});
    }

    // send error response if token is invalid
    return res.status(401).json({ message: 'Invalid token' });

})

// Sessions POST routes
app.post('/sessions', (req, res) => {
    const { email, password } = req.body;

    // check if credentials are valid
    const user = usersDB.find(u => u.email === email && u.password === password);
    // set this user's token in the in-memory db and send success message
    if(user) {
        // check if user has no token yet
        if (!user.token) {
            // generate new token
            const newToken = uuidv4();
            // set new token for this user
            user.token = newToken;
        }
        // send success response
        res.status(200).json({ message: 'Login successful', username: user.email, token: user.token});
    }
    // send error response
    else {
        res.status(401).json({ message: 'Invalid credentials.' })
    }
})

// Highscores POST route
app.post('/highscores', (req, res) => {
    const { username, score } = req.body;
    // add highscore and username to the database
    highscoresDB.push({ username, score });
    // send success status code and success message
    res.status(201).json({ message: 'Highscore added successfully' });
})

// Highscores GET route
app.get('/highscores', (req, res) => {
    // send highscoresDB array as json object
    res.status(200).json(highscoresDB);
})