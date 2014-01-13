//https://github.com/qiao/PathFinding.js
var gameBoard = 'gameBoard';
  //basic object to controll app runing


$(document).ready(function(){
  // //start fancybox
  $('#fancyBox').fancybox({
    autoSize: false,
    openEffect: false,
    closeEffect: false,
    closeClick: false,
    modal: true,
    live: true,
    beforeLoad: function() {
      this.width  = 400;
      this.height = 150;
    }
  }).trigger('click');

  //play prompt logic
  $('#startPrompt button').click(function() {
    switch($(this).attr('class')) {
      case 'start':
        $.fancybox.close();
        var name =
        $(this)
          .closest('#playerName')
            .find('input')
              .val();
        Player.saveName(name);
        Game.start(1);
        $('#startPrompt button.back').trigger('click');
        break;
      case 'play':
        var user = Storage.getData('user');
        if (user !== null) {
          Player.useUser(user);
          $.fancybox.close();
          return Game.start();
        }
        $(this)
          .parent()
          .hide()
          .end()
          .closest('#startPrompt')
            .find('#playerName')
              .show();
        break;
      case 'rules':
        $(this)
          .parent()
          .hide()
          .end()
          .closest('#startPrompt')
            .find('.rules')
              .show();
        break;
      case 'results':
        Stats.topResults($(this));
        break;
      case 'back':
        $(this)
          .parent()
            .hide()
          .end()
            .closest('#startPrompt')
              .find('.buttons')
                .show();
        break;
    }
  });


  //enter your name you f**!
  $('#playerName input').keyup(function() {
    var name = $(this).val();
    if (name.length > 3) {
      $('.start')
        .prop('disabled', false);
    }
  });


  //Play buttons
  $('#data button').click(function() {
    $(this)
      .closest('#data')
        .find('button')
        .prop('disabled', true);

    switch($(this).attr('class')) {
      case 'restart':
        Game.start(Game.level);
        break;
      case 'next':
        Stats.makeTotalPoints();
        Game.start();
        break;
      case 'menu':
        $('#fancyBox').trigger('click');
        break;
    }
  });


  //user clicks
    $('table#'+gameBoard).on('click', 'tr td', function() {
      Board.click($(this));
    });

    $('body').keydown(function(e) {
        var keys = [37, 38, 39, 40];
        if (
            Game.started && !Game.finished &&
            keys.indexOf(e.keyCode) != -1) {
            PcMan.moveItem(e.keyCode);
        } else {
console.log('negerai', Game.started ,Game.finished);
        }
    });

});

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
