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

router.post('/quiz', function(req, res, next){
  var words = randomWords(20);

  var newEntry = new TranslateSchema({
    user: 'User',
    currentChallenge: words,
    language: req.body.language,
    stats:[
      {
        word: null,
        timesSeen: 0,
        timesCorrect: 0,
        timesIncorrect: 0
      }
    ]
  });

  res.send(words);
});

router.put('/', function(req, res){

});






  // newEntry.save(function(err){
  //   if(err) throw err;
  //   console.log('success');
  // });


module.exports = router;
