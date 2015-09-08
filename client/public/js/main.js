$(document).on('ready', function() {
  $('.translator').hide();
  $('.flashcard').hide();
  $('#answer-form').hide();
  $('.flashcard').on('click', function() {

  });
});

// add scripts
$('form').on('submit', function(e){
  e.preventDefault();

  var translateData = {
    fromLanguage: $('#fromLanguage').val(),
    toLanguage: $('#toLanguage').val(),
    translateWord: $('#translateWord').val()
  };

  transText(translateData, function(err, data){
    if(!err) {
      $('#results').text(data);
    }
  });
});

$('.start-quiz').on('click', function() {
  $('#translated-word').hide();
  $('.flashcard').show();
  $('#answer-form').show();
  $('#results').hide();
  $('#translate').hide();
  $('.translator').show();
  $('.start-quiz').hide();
  $('#next-question').hide();

  $.ajax({
    method: 'post',
    url: '/quiz',
    data: {
      fromLanguage: $('#fromLanguage').val(),
      toLanguage: $('#toLanguage').val()
    }
  })
  .done(function(data){
    currentList = data;
      startQuiz();
  });
});

$('.translator').on('click', function() {
  $('#translated-word').show();
  $('.flashcard').hide();
  $('#answer-form').hide();
  $('#results').show();
  $('#translate').show();
  $('.translator').hide();
  $('.start-quiz').show();
});

$('#quiz-answer').on('click', function() {
  var res = result();
  $.ajax({
    method: 'post',
    url: '/answer',
    data: {
      word: currentWord,
      correct: res
    }
  }).done(function() {
    displayAnswer();
  });
  $('#quiz-answer').hide();
  $('#next-question').show();
});

$('#next-question').on('click', function() {
  nextWord();
  $('#answer').val('');
});
