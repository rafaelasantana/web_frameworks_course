import { mongo } from "mongoose";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// mongoose schema:
// define object with field names as keys and desired datatype as values
// can nest other fields within a field as necessary


// HighscoreSchema with username and score fields
const HighscoreSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

// HighscoreListSchema consists of a list of HighscoreSchemas
const HighscoreListSchema = new Schema({
    highscores: [HighscoreSchema]
})

// create mongoose models
// use these models as interface to interact with the database
const Highscore = mongoose.model('Highscore', HighscoreSchema);
const HighscoreList = mongoose.model('HighscoreList', HighscoreListSchema);

// export mongoose models for use in other parts of the app
// can access models in other files that import them
module.exports = {
    Highscore,
    HighscoreList
}