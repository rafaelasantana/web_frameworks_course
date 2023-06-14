const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// mongoose schema:
// define object with field names as keys and desired datatype as values
// can nest other fields within a field as necessary

// HighscoreSchema with username, score and date fields
const HighscoreSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// HighscoreListSchema consists of a list of HighscoreSchemas
const HighscoreListSchema = new Schema({
    highscores: [HighscoreSchema]
});

// UserSchema with email, password, token and createdAt date
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
});

// create mongoose models
// use these models as an interface to interact with the database
const Highscore = mongoose.model('Highscore', HighscoreSchema);
const HighscoreList = mongoose.model('HighscoreList', HighscoreListSchema);
const User = mongoose.model('User', UserSchema);

// export mongoose models for use in other parts of the app
// can access models in other files that import them
module.exports = {
    Highscore,
    HighscoreList,
    User
};