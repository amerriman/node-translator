var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TranslateSchema = new Schema({
  user: String,
  currentChallenge: [],
  language: String,
  stats:[
    {
    word: String,
    timesSeen: Number,
    timesCorrect: Number,
    timesIncorrect: Number
    }
  ]
});

mongoose.model('TranslateSchema', TranslateSchema);
mongoose.connect('mongodb://localhost/translator');
