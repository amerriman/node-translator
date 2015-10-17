var currentList;
var currentWord;
var questionNum = 0;
var ansWrong = 0;

//returns translated text
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

//initiates quiz
function startQuiz() {
  currentWord = currentList.pop();
  $('#front').text(currentWord.nativeWord);
  $('#back').text(currentWord.foreignWord);
  $('#next-question').hide();
  $('#quiz-answer').show();
  $('.flashcard').removeClass('flipped');
}

//pops off next word and adds to flashcard
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

//shows answer and plays word
function displayAnswer() {
  $('.flashcard').toggleClass('flipped');
  responsiveVoice.speak(currentWord.foreignWord, speechLanguage[$('#toLanguage').val()]);
}

//string comparison and scoring conditionals
var result = function() {
  var numWrong = 0;
  var splitWord = currentWord.foreignWord.split('');
  var answer = $('#answer').val();
  var splitAnswer = answer.toLowerCase().split('');

  //if the length of the answer and user input are equal, check each character
  if (splitAnswer.length === splitWord.length) {
    for (i=0; i<splitAnswer.length; i++) {
      if (splitAnswer[i] !== splitWord[i]) {
        numWrong++;
      }
    }

    //if the user input is blank, don't score, skips word, display warning
  } else if ($('#answer').val() === '') {
    $('#quiz-results').html('<div class="alert alert-warning" role="alert">You didn\'t enter anything!</div>');
    $('#back').css('color', 'rgb(250, 149, 0)');
    return false;

    //otherwise check each char but considers levenshtein distance
  } else {
    if (levenshtein_distance(answer, currentWord.foreignWord) < 3) {
      numWrong = 1;
    } else {
      for (i=0; i<splitWord.length; i++) {
        if (splitWord[i] !== splitAnswer[i]){
          numWrong++;
        }
      }
    }
  }

  //if more than one character was wrong display incorrect message
  if (numWrong > 1) {
    ansWrong++;
    questionNum++;
    currentList.unshift(currentWord);
    $('#quiz-results').html('<div class="alert alert-danger" role="alert">Incorrect! <strong> Current score: '+ (questionNum-ansWrong)+'</strong> out of <strong>'+questionNum+'</strong></div>');
    $('#back').css('color', 'red');

    //if user inputs 5 wrong answers this restarts quiz
    if (ansWrong === 5) {
      $('#quiz-results').html('<div class="alert alert-danger" role="alert">You missed 5...starting quiz over!</div>');
      $.ajax({
        method: 'get',
        url: '/list'
      }).done(function(data){
        currentList = data;
        ansWrong = 0;
        questionNum = 0;
      });
    }
    return false;

    //otherwise mark correct and display success message
  } else {
    questionNum++;
    $('#quiz-results').html('<div class="alert alert-success" role="alert">Correct! <strong>Current score: '+(questionNum-ansWrong)+'</strong> out of <strong>'+questionNum+'</strong></div>');
    $('#back').css('color', 'rgb(94, 198, 93)');
    return true;
  }
};
