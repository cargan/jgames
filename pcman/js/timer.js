var Timer = {
  interval: false,
  seconds: 0,
  start: function(data) {
    Timer.setTime(data.seconds);
    $('#stats')
      .show()
      .find('#points')
        .html('')
      .end()
      .find('#timer')
        .html('')
        .show()
        .append('Time left: <span class="time">' + data.seconds + '</span> secs');
    Timer.interval = setInterval(Timer.timer, 1000);
  },
  setTime: function(seconds) {
    Timer.seconds = seconds;
  },
  timer: function() {
    Timer.seconds -= 1;
    if (Timer.seconds <= 0) {
       Game.finish();
       Timer.finish();

       Board.table.find('td')
         .prop('disabled', true);
       $('#timer')
         .html('Ran out of time. Try again.');
       Game.actionButtons();
       return;
    }

    $('#timer .time').html(Timer.seconds);
  },
  finish: function() {
    clearInterval(Timer.interval);
	Timer.seconds = 0;
  }
};
