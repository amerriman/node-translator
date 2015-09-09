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
  responsiveVoice.speak(currentWord.foreignWord, speechLanguage[$('#toLanguage').val()]);

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
  var answer = $('#answer').val();
  var splitAnswer = answer.toLowerCase().split('');

  if (splitAnswer.length === splitWord.length) {
  for (i=0; i<splitAnswer.length; i++) {
    if (splitAnswer[i] !== splitWord[i]) {
      numWrong++;
}
}
} else if ($('#answer').val() === '') {
    $('#quiz-results').html('<div class="alert alert-warning" role="alert">You didn\'t enter anything!</div>');
    $('#back').css('color', 'rgb(250, 149, 0)');

    return false;

  } else {
    console.log(levenshtein_distance(answer, currentWord.foreignWord));
    if (levenshtein_distance(answer, currentWord.foreignWord) < 3) {
      numWrong = 1;
    } else {
    for (i=0; i<splitWord.length; i++) {
      if (splitWord[i] !== splitAnswer[i]){
        numWrong++;
  }}
  }
  }

  if (numWrong > 1) {
    ansWrong++;
    console.log(ansWrong);
    currentList.unshift(currentWord);
    $('#quiz-results').html('<div class="alert alert-danger" role="alert">Incorrect!</div>');
    $('#back').css('color', 'red');
    if (ansWrong === 5) {
      alert('you missed more than 5');
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
    $('#quiz-results').html('<div class="alert alert-success" role="alert">Correct!</div>');
    $('#back').css('color', 'rgb(94, 198, 93)');
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
