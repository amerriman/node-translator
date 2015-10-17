//on ready hide quiz features
$(document).on('ready', function() {
  $('.translator').hide();
  $('.flashcard').hide();
  $('#answer-form').hide();
  $('#next-question').hide();
});

//translate form submit handler
$('#translate-form').on('submit', function(e){
  e.preventDefault();

  //user selections
  var translateData = {
    fromLanguage: $('#fromLanguage').val(),
    toLanguage: $('#toLanguage').val(),
    translateWord: $('#translateWord').val()
  };

  //recieve and output translated text
  transText(translateData, function(err, data){
    if(!err) {
      responsiveVoice.speak(data, speechLanguage[$('#toLanguage').val()]);
      $('#results').text(data);
      $('#results').addClass('animated tada');
      setTimeout(function() {
        $('#results').removeClass('animated tada');
      },3000);
    }
  });
});

//quiz start click handler
$('.start-quiz').on('click', function() {
  $('#translateWord').val('');
  $('#translated-word').hide();
  $('.flashcard').show();
  $('#answer-form').show();
  $('#results').hide();
  $('#results').html('');
  $('#translate').hide();
  $('.translator').show();
  $('.start-quiz').hide();
  $('#next-question').hide();
  $('.language-picker').hide();
  window.scrollTo(0,document.body.scrollHeight);

  //send language selection
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

//back to translator click handler from quiz feature
$('.translator').on('click', function() {
  $('#translated-word').show();
  $('.flashcard').hide();
  $('#answer-form').hide();
  $('#results').show();
  $('#translate').show();
  $('.translator').hide();
  $('.start-quiz').show();
  $('#quiz-results').hide();
  $('#next-question').hide();
  $('#front').val('');
  $('#back').val('');
  $('#answer').val('');
  $('.language-picker').show();
});

//obligatory jurrasic park theme
// $('#dinosaur').on('click', function() {
//   $("<audio class='jpark'></audio>").attr({
//     'src':'css/jparktheme.mp3',
//     'volume':0.4,
//     'autoplay':'autoplay'
//   });
// });
// $('.glyphicon-volume-off').on('click', function() {
//   console.log('test');
//   $('.jpark').prop('volume', 0.0);
// });


//quiz answer post request
$('#answer-form').on('submit', function(event) {
  event.preventDefault();

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
  $('#quiz-answer').prop("disabled", true);
});


//next question click handler
$('#next-question').on('click', function(event) {
  event.preventDefault();
  nextWord();
  $('#answer').val('');
  $('#quiz-answer').prop("disabled", false);
});
