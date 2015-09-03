// add scripts


$(document).on('ready', function() {
  $('form').on('submit', function(e){
    e.preventDefault();
    $.ajax({
      method: 'post',
      url: '/',
      data: {
        fromLanguage: $('#fromLanguage').val(),
        toLanguage: $('#toLanguage').val(),
        translateWord: $('#translateWord').val()
      }
    })
    .done(function(data){
      console.log(data);
    })
    .fail(function(err){
      console.log(err);
    });
    $(':input').val('');
  });
});
