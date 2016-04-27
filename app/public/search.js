/////////////////////
//BEGIN SEARCH JS
////////////////////

var searchFormatted = [];

  $('#container').css("display","none");
  $('#songs').css("display","");

  $(document).ready(function() {
    console.log("readied form");
      // Get the form.
      var form = $('#form-ajax');

      // Get the messages div.
      var formMessages = $('#search-results');

      // Set up an event listener for the contact form.
  $(form).submit(function(event) {
      // Stop the browser from submitting the form.
      event.preventDefault();

      $('#container').css("display","");
      $('#songs').css("display","none");


      // Serialize the form data.
      var formData = $(form).serialize();
      formData += '&type=track&limit=5';

      // Submit the form using AJAX.
      $.ajax({
          type: 'GET',
          url: $(form).attr('action'),
          data: formData
      })
      .done(function(response) {
          // Make sure that the formMessages div has the 'success' class.
          $(formMessages).removeClass('error');
          $(formMessages).addClass('success');

          //var to be appended
          searchFormatted.length = 0;
          $(formMessages).empty();

          //loop through tracks
          returnedTracks = response.tracks.items;
          returnedTracks.forEach(function(element) {
            searchFormatted.push({
              name: element.name,
              artist: element.artists[0].name,
              image: element.album.images[2].url,
              uri: element.uri
            });
            
          });

          //appended to html variable
          var searchAppend = '<br><br>';

          searchFormatted.forEach(function(element) {
            searchAppend += '<div class="song-listing elem-inline">';
            searchAppend += '<img class="elem-inline" src="' + element.image + '" />';
            searchAppend += '<ul>';
            searchAppend += '<li class="track">' + element.name + '</li>';
            searchAppend += '<li class="artist">' + element.artist + '</li>';
            searchAppend += '</ul>';
            searchAppend += '<button class="add" tname="'+ element.name + '" aname="' + element.artist + '" image="' + element.image + '" uri="' + element.uri + '" >Add to Queue</button>';
            searchAppend += '</div>';
          });

          $(formMessages).append(searchAppend);

          // Clear the form.
          $('#search').val('');
      })
      .fail(function(data) {
          // Make sure that the formMessages div has the 'error' class.
          $(formMessages).removeClass('success');
          $(formMessages).addClass('error');

          // Set the message text.
          if (data.responseText !== '') {
              $(formMessages).text(data.responseText);
          } else {
              $(formMessages).text('Oops! An error occured and your message could not be sent.');
          }
      });

    });
  });


$('#exit').click(function() {
$('#container').css("display","none");
$('#songs').css("display","");
});

