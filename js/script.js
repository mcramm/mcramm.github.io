function refreshTime() {
  var now = new Date();
  var mil = window.then.getTime() - now.getTime();
  if( mil <= 0) {
    resetClock();
    resetPercentage();
    hideClock();
    setSpecial();
    return;
  }
  var sec = mil/1000;
  var min = sec/60;
  var hour = min/60;
  var day = Math.floor(hour/24);

  var running_diff = day*24;
  hour = Math.floor(hour - running_diff);

  running_diff = running_diff*60 + hour*60;
  min = Math.floor(min - running_diff);

  running_diff = running_diff*60 + min*60;
  sec = Math.floor(sec - running_diff);

  running_diff = running_diff*1000 + sec*1000;
  mil = Math.floor(mil - running_diff);

  setClock(day, hour, min, sec, mil);

  var steps = window.then.getTime() - window.startDate.getTime();
  var diff = now.getTime() - window.startDate.getTime();
  var percentage = Math.floor( (diff/steps)*100 );

  $('#percentage').html(percentage);

  adjustOverlay(percentage/100);

  setTimeout( "refreshTime()", 40 );
}

function adjustOverlay(per) {
  var height = 40;

  var diff = per * height;

  var new_offset = (40 - diff);

  $('.overlay').css('top', new_offset);
}


function setClock(day, hour, min, sec, mil){
  $('#days').html(day);
  $('td#hours').html(hour);
  $('#minutes').html(min);
  $('#seconds').html(sec);
  $('#mil').html(mil);
}

function resetClock(){
  setClock(0,0,0,0,0);
}

function resetPercentage(){
  $('.overlay').css('top', 0);
  $('#percentage').html(100);
}

function setSpecial() {
  $.ajax({
    url: "/lyrics.html",
    success: function(data) {
      $('div#holder').html(data);
      $('div#info').html("Daft Punk - \"Digital Love\"");
      showSpecial();
    }
  });
}

function hideClock(){
  $('div#clock-wrap').animate({
    height: 'toggle'
  }, 1000);
}

function showSpecial(){
  $('div#holder-wrap').animate({
    height: 'toggle'
  }, 1000);

  $('div#explanation-wrap').animate({
    height: 'toggle'
  }, 1000);

}


$(document).ready( function() {
  window.then = new Date(2011,08,02,20,44,00);
  window.startDate = new Date(2011,07,26,20,44,00);

  refreshTime();
});
