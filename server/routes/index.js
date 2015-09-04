var keys = require('./keys');
var express = require('express');
var router = express.Router();
var bt = require('../../node_modules/bing-translate/lib/bing-translate.js').init({
  client_id: keys.client_id,
  client_secret: keys.client_secret
});
var randomWords = require('random-words');
var mongoose = require('mongoose');
var TranslateSchema = mongoose.model('TranslateSchema');


router.get('/', function(req, res, next) {
  res.render('index');
});


router.post('/translate', function(req, res, next){
  var fromLanguage = req.body.fromLanguage;
  var toLanguage = req.body.toLanguage;
  var translateWord = req.body.translateWord;
  console.log(req.body, "rqbody");

  bt.translate(translateWord, fromLanguage, toLanguage, function(err, response){
    res.send(response);

  });
});

router.post('/quiz', function(req, res){
  var words = randomWords(20);
  var query = {"user": "User"};
  var options = {upsert: true, new: true};
  var update = {currentChallenge: words, language: req.body.language};

  TranslateSchema.update(query, update, options, function(err){
    if (err) throw err;
    console.log("success");
  });
  res.send(words);
});

  // var newEntry = new TranslateSchema({
  //   user: 'User',
  //   currentChallenge: words,
  //   language: req.body.language,
    // stats:[
      // {
      //   word: null,
      //   timesSeen: 0,
      //   timesCorrect: 0,
      //   timesIncorrect: 0
      // }
    // ]
  // });
  // newEntry.save(function(err){
  //   if(err) throw err;
  //   console.log('success');
  // });

router.post('/answer', function(req, res){
var currentWord = req.body.word;
var correct = req.body.correct;
console.log('correct');
  TranslateSchema.findOne({user: "User"}, function(err, entry){
    console.log(entry);
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
    if (!found){
      if(correct){
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
  });
  res.end();
});



module.exports = router;
