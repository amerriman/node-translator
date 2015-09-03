var keys = require('./keys');
var express = require('express');
var router = express.Router();
var bt = require('../../node_modules/bing-translate/lib/bing-translate.js').init({
  client_id: keys.client_id,
  client_secret: keys.client_secret
});

router.get('/', function(req, res, next) {
  res.render('index');
  // bt.translate('This hotel is located close to the centre of Paris.', 'en', 'ro', function(err, res){
  //   // console.log(err, res);
  // });
});

router.post('/', function(req, res, next){
  var fromLanguage = req.body.fromLanguage;
  var toLanguage = req.body.toLanguage;
  var translateWord = req.body.translateWord;
  bt.translate(translateWord, fromLanguage, toLanguage, function(err, res){
    console.log(err, res);
  })
  res.end();
});

module.exports = router;
