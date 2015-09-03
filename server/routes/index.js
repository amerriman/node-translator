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

router.post('/', function(req, res, next){
  var fromLanguage = req.body.fromLanguage;
  var toLanguage = req.body.toLanguage;
  var translateWord = req.body.translateWord;

  var newEntry = new TranslateSchema({
    user: 'Keith',
    currentChallenge: [],
    language: 'Spanish',
    stats:[
      {
        word: 'hello',
        timesSeen: 45,
        timesCorrect: 4,
        timesIncorrect: 41
      }
    ]
  });

  router.put()


  newEntry.save(function(err){
    if(err) throw err;
    console.log('success');
  });

  bt.translate(translateWord, fromLanguage, toLanguage, function(err, response){
    res.send(response);
  });
});

module.exports = router;
