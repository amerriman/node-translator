// var keys = require('./keys');
var express = require('express');
var router = express.Router();
var bt = require('../../node_modules/bing-translate/lib/bing-translate.js').init(
  {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  });
// var bt = require('../../node_modules/bing-translate/lib/bing-translate.js').init(
//   {
//     client_id: keys.client_id,
//     client_secret: keys.client_secret
//   });

var randomWords = require('random-words');
var mongoose = require('mongoose');
var TranslateSchema = mongoose.model('TranslateSchema');

router.get('/', function(req, res, next) {
  res.render('../views/index.html');
});

//translate word post requet
router.post('/translate', function(req, res, next){
  var fromLanguage = req.body.fromLanguage;
  var toLanguage = req.body.toLanguage;
  var translateWord = req.body.translateWord;

  bt.translate(translateWord, fromLanguage, toLanguage, function(err, response){
    res.send(response);
  });
});

//start quiz post request
router.post('/quiz', function(req, res){
  var random = randomWords(20);
  var counter = 0;
  var words = [];
  for(var i=0; i<random.length; i++){
    var currentWord = random[i];

    bt.translate(currentWord, req.body.fromLanguage, req.body.toLanguage, function(err, response){
      if(err) throw err;
      counter++;
      words.push({
        nativeWord: response.original_text.toLowerCase(),
        foreignWord: response.translated_text.toLowerCase()
      });

      if (counter===19) {
        var query = {"user": "User"};
        var options = {upsert: true, new: true};
        var update = {currentChallenge: words, language: req.body.toLanguage};

        TranslateSchema.update(query, update, options, function(err){
          if (err) throw err;
        });
        console.log(words);
        res.send(words);
      }
    });
  }
});
//answer and stats post request
router.post('/answer', function(req, res){
  var currentWord = req.body.word;
  var correct = JSON.parse(req.body.correct);
  TranslateSchema.findOne({user: "User"}, function(err, entry){
    var found = false;
    for (var i = 0; i < entry.stats.length; i++) {
      if(entry.stats[i].word === currentWord) {
        found = true;
        entry.stats[i].timesSeen++;
        if(correct){
          entry.stats[i].timesCorrect++;
        } else {
          entry.stats[i].timesIncorrect++;
        }
      }
    }

    //persist stats
    if (!found){
      if (correct){
        entry.stats.push(  {
          word: currentWord,
          timesSeen: 1,
          timesCorrect: 1,
          timesIncorrect: 0
        });
      } else {
        entry.stats.push({
          word: currentWord,
          timesSeen: 1,
          timesCorrect: 0,
          timesIncorrect: 1
        });
      }
    }

    TranslateSchema.update({user: "User"}, entry, {upsert: true, new: true}, function(err){
      if (err){
        throw err;
      }
    });
  });
  res.end();
});

//find users current challenge
router.get('/list', function(req, res){
  TranslateSchema.findOne({user: "User"}, function(err, entry){
    res.send(entry.currentChallenge);
  });
});

module.exports = router;
