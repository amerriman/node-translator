var currentList;
var currentWord;
var ansWrong = 0;

function nextWord(){
  currentWord = currentList.pop();
  $('#front').text(currentWord.nativeWord);
  setTimeout(function(){
  $('#back').text(currentWord.foreignWord);
}, 500);
  $('#next-question').hide();
  $('#quiz-answer').show();
  $('.flashcard').toggleClass('flipped');
}

function startQuiz() {
  currentWord = currentList.pop();
  $('#front').text(currentWord.nativeWord);
  $('#back').text(currentWord.foreignWord);
  $('#next-question').hide();
  $('#quiz-answer').show();
  $('.flashcard').removeClass('flipped');
}

function displayAnswer() {
  $('.flashcard').toggleClass('flipped');
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
  var splitWord = currentWord.foreignWord.split('');
  var splitAnswer = $('#answer').val().toLowerCase().split('');

  for (i=0; i<splitAnswer.length; i++) {
    if (splitWord[i] !== splitAnswer[i])
      numWrong++;
      console.log(numWrong);
  }
  if (numWrong > 1) {
    ansWrong++;
    currentList.unshift(currentWord);
    $('#quiz-results').text('Nice Try! But its WRONG!');
    if (ansWrong === 5) {
      $.ajax({
        method: 'get',
        url: '/list'
      }).done(function(data){
        currentList = data;
        ansWrong = 0;
      });
    }
      return false;

  }else{
    $('#quiz-results').text('Hey that is correct! You\'re a smart guy!');
    return true;
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
