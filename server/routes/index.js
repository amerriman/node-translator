var keys = require('./keys');
var express = require('express');
var router = express.Router();
var bt = require('../../node_modules/bing-translate/lib/bing-translate.js').init({
  client_id: keys.client_id,
  client_secret: keys.client_secret
});
var randomWords = require('random-words');

var wordGroup = randomWords(20);
wordGrouplength = wordGroup.length;
for (i=0; i<wordGrouplength; i++) {
  console.log(wordGroup[i]);
}

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next){
  var fromLanguage = req.body.fromLanguage;
  var toLanguage = req.body.toLanguage;
  var translateWord = req.body.translateWord;
  bt.translate(translateWord, fromLanguage, toLanguage, function(err, response){
    res.send(response);
  });
});

module.exports = router;
