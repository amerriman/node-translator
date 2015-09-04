// add scripts
var currentList;
var currentWord;

$('.start-quiz').on('click', function() {
  $('#translated-word').hide();
  $('.flashcard').show();
  $('#answer-form').show();
  $('#results').hide();
  $('#translate').hide();
  $('.translator').show();
});

$('.translator').on('click', function() {
  $('#translated-word').show();
  $('.flashcard').hide();
  $('#answer-form').hide();
  $('#results').show();
  $('#translate').show();
  $('.translator').hide();
});

$(document).on('ready', function() {
  $('.translator').hide();
  $('.flashcard').hide();
  $('#answer-form').hide();
  $('.flashcard').on('click', function() {
    $('.flashcard').toggleClass('flipped');
  });

  $('.start-quiz').on('click', function() {
    $.ajax({
      method: 'post',
      url: '/quiz',
      data: {
        language: $('#toLanguage').val()
      }
    })
    .done(function(data){
      currentList = data;
    });
  });

  var result = function() {
    currentWord = currentList[0];
    var numWrong = 0;
    var splitWord = currentWord.split('') ;
    var splitAnswer = $('#answer').val().split('');
    for (i=0; i<splitWord.length; i++) {
      if (splitWord[i] !== splitAnswer[i])
      numWrong++;
      console.log(numWrong);
    }
    if (numWrong > 1)
    return false;
    else
    return true;
  };

  $('#quiz-answer').on('click', function() {
    console.log('test');
    var res = result();
    $.ajax({
      method: 'post',
      url: '/answer',
      data: {
        word: currentWord,
        correct: res
      }
    });
  });

  $('form').on('submit', function(e){
    e.preventDefault();
    $.ajax({
      method: 'post',
      url: '/translate',
      data: {
        fromLanguage: $('#fromLanguage').val(),
        toLanguage: $('#toLanguage').val(),
        translateWord: $('#translateWord').val()
      }
    })
    .done(function(data){
      $('#results').text(data.translated_text);
    })
    .fail(function(err){
      console.log(err);
    });
  });
});
