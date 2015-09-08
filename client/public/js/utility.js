var currentList;
var currentWord;

function displayAnswer(){
  var translateData = {
    fromLanguage: $('#fromLanguage').val(),
    toLanguage: $('#toLanguage').val(),
    translateWord: currentWord
  };
  transText(translateData, function(err, data){
    $('#back').text(data);
  });
}

function setFront(){
  $('#front').text(currentWord);
}

function nextWord(){
  currentWord = currentList.pop();
  $('.front').append(currentWord);
  // var transWord = transText(currentWord, function() {
  //
  // })
  // $('.back').append()
}

function transText(sendData, cb){

  $.ajax({
    method: 'post',
    url: '/translate',
    data: sendData
  })
  .done(function(data){
    return cb(null, data.translated_text);
  })
  .fail(function(err){
    return cb(err);
  });
}

var result = function() {
  var numWrong = 0;
  var ansWrong = 0;
  var splitWord = currentWord.split('');
  var splitAnswer = $('#answer').val().toLowerCase().split('');

  for (i=0; i<splitAnswer.length; i++) {
    if (splitWord[i] !== splitAnswer[i])
      numWrong++;
    console.log(numWrong);
  }
  if (numWrong > 1) {
    console.log('false');
    ansWrong++;
    currentWord.unshift(currentList);
    return false;
  }else{
    console.log('true');
    return true;
  }
  if (ansWrong === 5) {
    console.log('you lost');
    $.ajax({
      method: 'get',
      url: '/list'
    }).done(function(data){
      console.log(data);
      currentList = data;
    });
  }
};

// $('.start-quiz').on('click', function() {
//   $.ajax({
//     method: 'post',
//     url: '/quiz',
//     data: {
//       language: $('#toLanguage').val()
//     }
//   })
//   .done(function(data){
//     currentList = data;
//   });
// });
