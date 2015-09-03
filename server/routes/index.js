var keys = require('./keys');
var express = require('express');
var router = express.Router();
var bt = require('../../node_modules/bing-translate/lib/bing-translate.js').init({
  client_id: keys.client_id,
  client_secret: keys.client_secret
});
var randomWords = require('random-words');
<<<<<<< HEAD
var mongoose = require('mongoose');
var TranslateSchema = mongoose.model('TranslateSchema');
=======

var wordGroup = randomWords(20);
wordGrouplength = wordGroup.length;
for (i=0; i<wordGrouplength; i++) {
  console.log(wordGroup[i]);
}
>>>>>>> 62cc313338b350f5a06114627972ce455e7553c9

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

router.get('/quiz', function(req, res, next){
  var words = randomWords(20);
  console.log(words);
  res.send(words);
});


// router.post('/', function(req, res, next){
//   // var fromLanguage = req.body.fromLanguage;
//   // var toLanguage = req.body.toLanguage;
//   // var translateWord = req.body.translateWord;

//   // bt.translate(translateWord, fromLanguage, toLanguage, function(err, response){
//   //   res.send(response);
//   // });
// });

  // var newEntry = new TranslateSchema({
  //   user: 'Keith',
  //   currentChallenge: [],
  //   language: 'Spanish',
  //   stats:[
  //     {
  //       word: 'hello',
  //       timesSeen: 45,
  //       timesCorrect: 4,
  //       timesIncorrect: 41
  //     }
  //   ]
  // });



  // newEntry.save(function(err){
  //   if(err) throw err;
  //   console.log('success');
  // });


module.exports = router;
