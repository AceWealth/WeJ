//////////////////////
//BEGIN SOCKET.IO JS
//////////////////////

var socket = io();
$("#search-results").delegate(".add", "click", function(){
  $('#container').css("display","none");
  $('#songs').css("display","");

  name = $( this ).attr("tname");
  artist = $( this ).attr("aname");
  image = $( this ).attr("image");
  uri = $( this ).attr("uri");

  sentData = {
    name: name,
    artist: artist,
    image: image,
    uri: uri
  };

  console.log('Added song: ' + sentData.name);
  socket.emit('song add', sentData);
  //$('#m').val('');
  return false;
});

$("#songs").delegate(".vote", "click", function(){

  name = $( this ).attr("tname");
  uri = $( this ).attr("uri");


  if($( this ).hasClass("vote-up")){
    if($( this ).hasClass("voted")){
      sentData = {
        name: name,
        uri: uri,
        vote: -1
      };
      $( this ).removeClass("voted");
    } else {
      sentData = {
        name: name,
        uri: uri,
        vote: 1
      }
      $( this ).addClass("voted");
    }
  } else { //vote is down
    if($( this ).hasClass("voted")){
      sentData = {
        name: name,
        uri: uri,
        vote: 1
      };
      $( this ).removeClass("voted");
    } else {
      sentData = {
        name: name,
        uri: uri,
        vote: -1
      };
      $( this ).addClass("voted");
    }
  }

  console.log('Voted: ' + sentData.name);
  console.log('Vote sent');
  socket.emit('vote', sentData);
  //$('#m').val('');
  return false;
});

//vote recieved
socket.on('vote', function(msg) {
  id = 'h5[id="' + msg.uri + '"]';

  console.log('Updating score of ' + msg.uri + ' to ' + msg.score);
  $(id).html(msg.score);

});

socket.on('song add', function(msg) {
  console.log('Message ' + msg.name);

  var singleAppend = '<br>';

  singleAppend += '<div class="song-listing elem-inline">';
  singleAppend += '<img class="elem-inline" src="' + msg.image + '" />';
  singleAppend += '<ul class="song-info">';
  singleAppend += '<li class="track">' + msg.name + '</li>';
  singleAppend += '<li class="artist">' + msg.artist + '</li>';
  singleAppend += '</ul>';
  singleAppend += '<ul class="voteUl">';
  singleAppend += '<li><button class="vote vote-up" tname="'+ msg.name + '" aname="' + msg.artist + '" image="' + msg.image + '" uri="' + msg.uri + '" >&and;</button></li>';
  singleAppend += '<li><button class="vote vote-down" tname="'+ msg.name + '" aname="' + msg.artist + '" image="' + msg.image + '" uri="' + msg.uri + '" >&or;</button></li>';
  singleAppend += '</ul>';
  singleAppend += '<h5 id="' + msg.uri + '">0</h5>';
  singleAppend += '</div>';

  $("#songs-container").append(singleAppend);
});

socket.on('join socket', function(msgs) {
  console.log('Adding all messages');
  console.log(msgs);

    var songsAppend = '<br>';

    msgs.forEach(function(element) {
  songsAppend += '<div class="song-listing elem-inline">';
  songsAppend += '<img class="elem-inline" src="' + element.image + '" />';
  songsAppend += '<ul class="song-info">';
  songsAppend += '<li class="track">' + element.name + '</li>';
  songsAppend += '<li class="artist">' + element.artist + '</li>';
  songsAppend += '</ul>';
  songsAppend += '<ul class="voteUl">';
  songsAppend += '<li><button class="vote vote-up" tname="'+ element.name + '" aname="' + element.artist + '" image="' + element.image + '" uri="' + element.uri + '" >&and;</button></li>';
  songsAppend += '<li><button class="vote vote-down" tname="'+ element.name + '" aname="' + element.artist + '" image="' + element.image + '" uri="' + element.uri + '" >&or;</button></li>';
  songsAppend += '</ul>';
  songsAppend += '<h5 id="' + element.uri + '">' + element.score + '</h5>';
  songsAppend += '</div>';
    });

    $("#songs-container").html(songsAppend);

});

socket.on('song play', function(msg) {
  console.log('Message ' + msg.name);

  console.log('Playing a song');

  var playAppend = '<br>';

  playAppend += '<div class="song-listing elem-inline">';
  playAppend += '<img class="elem-inline" src="' + msg.image + '" />';
  playAppend += '<ul class="song-info">';
  playAppend += '<li class="track">' + msg.name + '</li>';
  playAppend += '<li class="artist">' + msg.artist + '</li>';
  playAppend += '</ul>';
  playAppend += '<ul class="voteUl">';
  playAppend += '<li><button class="vote vote-up" tname="'+ msg.name + '" aname="' + msg.artist + '" image="' + msg.image + '" uri="' + msg.uri + '" >&and;</button></li>';
  playAppend += '<li><button class="vote vote-down" tname="'+ msg.name + '" aname="' + msg.artist + '" image="' + msg.image + '" uri="' + msg.uri + '" >&or;</button></li>';
  playAppend += '</ul>';
  playAppend += '<h5 id="' + msg.uri + '">0</h5>';
  playAppend += '</div>';

  $("#current-song").append(playAppend);
});