var gameBoard = 'gameBoard';

var Player = {
  name: false,
  saveName: function(name) {
    Player.name = name;
  },
  setDataPlayer: function() {
    $('table.data')
      .prepend('<tr><td>Player:</td><td><i>' + Player.name + '</i></td></tr>');
  }
};

//player :)
var PcMan = {
    currentPosition: false,
    sign: '&#9824;',
    identifier: 'pcman',
    start: function(position) {
        PcMan.currentPosition = position;
        Cross.renderItem(
            PcMan.currentPosition,
            PcMan.sign,
            PcMan.identifier
        );
    },
    moveItem: function(code) {
        var directions = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        var currentP = Cross.moveItemDirection(
            PcMan.currentPosition,
            directions[code],
            PcMan.sign,
            PcMan.identifier
        );
        if (currentP) {
            PcMan.currentPosition = currentP;
        }
    }
};

var LevelsConfig = {
  config: [
  {
    name: 'first',
    levelPoints: 5,
    ai: {
      speed: 2
    },
    bubles: {
      bubles: {
        simple: {
          number: 4,
          sign: '&#x2318;',
          points: 1
        },
        extra: {
          number: 1,
          sign: '&#x2325;',
          points: 2
        }
      }
    },
    cross: {
      vertical: 16,
      horizontal: 11
    },
    timer: {
      seconds: 20
    }
  },
  {
    name: 'second',
    levelPoints: 8,
    ai: {
      speed: 2
    },
    bubles: {
      bubles: {
        simple: {
          number: 7,
          sign: '&#x2318;',
          points: 1
        },
        extra: {
          number: 2,
          sign: '&#x2325;',
          points: 2
        }
      }
    },
    cross: {
      vertical: 7,
      horizontal: 7
    },
    timer: {
      seconds: 20
    }
  },
  {
    name: 'third',
    levelPoints: 10,
    ai: {
      speed: 3
    },
    bubles: {
      bubles: {
        simple: {
          number: 12,
          sign: '&#x2318;',
          points: 1
        },
        extra: {
          number: 4,
          sign: '&#x2325;',
          points: 2
        },
        duper: {
          number: 1,
          sign: '&#8734;',
          points: 3
        }

      }
    },
    cross: {
      vertical: 10,
      horizontal: 10
    },
    timer: {
      seconds: 30
    }
  },
  {
    name: 'fourth',
    levelPoints: 15,
    ai: {
      speed: 3
    },
    bubles: {
      bubles: {
        simple: {
          number: 16,
          sign: '&#x2318;',
          points: 1
        },
        extra: {
          number: 8,
          sign: '&#x2325;',
          points: 2
        },
        duper: {
          number: 3,
          sign: '&#8734;',
          points: 3
        }
      }
    },
    cross: {
      vertical: 12,
      horizontal: 12
    },
    timer: {
      seconds: 60
    }
  }
  ],
  getLevel: function(level) {
    return LevelsConfig.config[level-1];
  },
  getNumberOfBubles: function(level) {
    var bubles = LevelsConfig.config[level-1].bubles.bubles;
    var bublesCount = 0;
    $.each(bubles, function(key, value) {
      bublesCount += value.number;
    });

    return bublesCount;
  }
};

  var Bubles = {
    speed: 0,
    bubles: {},
    numberBubles: 0,
    start: function(data) {
      Bubles.setValues(data);
    },
    setValues: function(data) {
      Bubles.bubles = data.bubles;
      Bubles.speed = data.speed;
      Bubles.numberBubles = LevelsConfig.getNumberOfBubles(Controller.level);
    },
    getBubles: function() {
      return Bubles.bubles;
    },
    getBublePoints: function(type) {
      var points = false;
      $.each(Bubles.bubles, function(key, value) {
        if (type == key) {
          points = value.points;
          return false;
        }
      });
      return points;
    }
  };

  var Cross = {
    vertical: 0,
    horizontal: 0,
    filled: {},
    table: {},
    init: function(table) {
      Cross.table = $('#'+table);
    },
    start: function(data) {
      Cross._reset();
      Cross._setValues(data);
      Cross._generateTable();
      Cross._renderBubles(Bubles.getBubles());
    },
    _setValues: function(data) {
      Cross.vertical = data.vertical;
      Cross.horizontal = data.horizontal;
    },
    _reset: function() {
      Cross.filled = {};
    },
    _generateTable: function() {
      for (var i=1; i<=Cross.vertical;i++) {
        var $tr = $(document.createElement('tr'));
        for (var k=1; k<=Cross.horizontal;k++) {
          var $td = $(document.createElement('td'));
          var tdNumber = (i*Cross.vertical - Cross.vertical) + k;
          $td.attr('data-number', tdNumber);
          $tr.append($td);
        }
        $(Cross.table)
          .append($tr);
      }
    },
    _renderBubles: function(bubles){
      var squares = Cross.vertical * Cross.horizontal;
      $.each(bubles, function(key, value) {
        for (var i=1;i<=value.number;) {
          var random = getRandomInt(1, squares);
          if (Cross.filled[random] === undefined) {
            Cross.filled[random] = key;
            Cross._render(random, key, value.sign);
            i++;
          }
        }
      });
    },
    _render: function(number, bubleType, sign) {
      $(Cross.table)
        .find('td[data-number="'+number+'"]')
        .addClass('clickable')
        .html(sign)
        .attr('data-buble', bubleType);
    },
    click: function($item) {
      if ($item.data('buble') && !$item.hasClass('clicked')) {
        $item.addClass('clicked');
        $item.html('&#x238B;');
        Stats.addPoints($item.data('buble'));
        Cross.checkBublesLeft();
      }
    },
    checkBublesLeft: function() {
      // if (Cross.bublesOnTheBoard == Bubles.numberBubles) {
      if (Cross.table.find('td.clickable').not('.clicked').length === 0) {
        Stats.addLevelPoints();
        Stats.finish();
        Timer.finish();
        Ai.finish();
        Cross.table.find('td')
          .prop('disabled', true);
        $('#start button')
          .prop('disabled', false);
      }
    },
    getEmptySquare: function() {
      var squares = Cross.vertical * Cross.horizontal;
      var position = false;
      while (!position) {
        var rand = getRandomInt(1, squares);
        if (Cross.filled[rand] === undefined) {
          position = rand;
        }
      }
      return position;
    },
    renderItem: function(position, sign, item) {
        Cross.table
        .find('td[data-number="'+position+'"]')
        .addClass(item)
        .addClass('active'+item.charAt(0).toUpperCase() + item.slice(1))
        .addClass('clicked')
        .html(sign);
    },
    getMoveAiPositionLogicLevelOne: function(positions) {
      var position = false;
      var tdArray = [];
      $.each(positions, function(key, value){
        var $td = Cross.table
          .find('td[data-number="'+value+'"]')
            .not('.clicked')
            .not('.worm');

        if ($td.data('buble')) {
          tdArray.push($td.data());
        }
      });

      if (tdArray.length) {
        var rand = getRandomInt(0, tdArray.length - 1);
        position = tdArray[rand].number;
      }

      return position;
    },
    getMoveAiPositionLevelOne: function(currentPosition, moveDimension) {
      if (!moveDimension) {
        moveDimension = 1;
      }
      var positionsArr = [
        Cross.getHorizontalPosition(currentPosition, moveDimension),
        Cross.getHorizontalPosition(currentPosition, -moveDimension),
        Cross.getVerticalPosition(currentPosition, moveDimension),
        Cross.getVerticalPosition(currentPosition, -moveDimension)
      ];

      return positionsArr.filter(function(e){return e;});
    },
    getMoveAiPositionAnyway: function(positions) {
        var pos = [];
        var position = false;
        $.each(positions, function(key, value) {
          var $td =
            Cross.table.find('td[data-number="'+value+'"]')
              .not('.clicked')
              .not('.worm');
          if ($td.length) {
            pos.push(value);
          }
        });

        if (pos.length) {
          var positionsRand = getRandomInt(0, (pos.length - 1));
          position = pos[positionsRand];
        } else {
          //if no gifts arround and all squares visited
          var pr = getRandomInt(0, (positions.length - 1));
          position = positions[pr];
        }

      return position;
    },
    getMoveAiPosition: function(currentPosition, level) {
      var crossPositions = Cross.getMoveAiPositionLevelOne(currentPosition);
      var position = Cross.getMoveAiPositionLogicLevelOne(crossPositions);

      if (!position) {
        position = Cross.getMoveAiPositionAnyway(crossPositions);
      }

      return position;
    },
    upperF: function(item) {
        return item.charAt(0).toUpperCase() + item.slice(1);
    },
    moveItemDirection: function(position, direction, sign, item) {
        var activeItem = 'td.active' + Cross.upperF(item);
        var $td = Cross.table
            .find(activeItem);
        pp = false;
        if (direction == 'left') {
            pp = Cross.getHorizontalPosition(position, -1);
        } else if (direction == 'right') {
            pp = Cross.getHorizontalPosition(position, 1);
        } else if (direction == 'up') {
            pp = Cross.getVerticalPosition(position, -1);
        } else {
            //down
            pp = Cross.getVerticalPosition(position, 1);
        }
        if (!pp) {
            return false;
        }

        Cross.table
            .find(activeItem)
            .removeClass('active' + Cross.upperF(item))
            .html('');

        Cross.renderItem(pp, sign, item);
        return pp;
    },
    moveAi: function(oldPosition, position, sign) {
        Cross.table
        .find('td.activeWorm')
        .removeClass('activeWorm')
        .html('');

      var $td = Cross.table
        .find('td[data-number="'+position+'"]');

      if ($td.data('buble')) {
        $td
          .removeAttr('data-buble')
          .addClass('clicked')
          .addClass('worm')
          .addClass('activeWorm')
          .html(sign);
        Cross.checkBublesLeft();
      } else {
        $td
          .addClass('worm')
          .addClass('activeWorm')
          .html(sign);
      }
    },
    getHorizontalPosition: function(position, move) {
       // var rowNumber = Math.ceil((position - 1)/ Cross.horizontal);
       var colNumber = ((position - 1) % Cross.vertical)+1;
       var target = position + move;
        if ( (move > 0) && (colNumber == Cross.horizontal) ) {
            return false;
        } else if ( (move < 0) && (colNumber == 1) ) {
            return false;
        }

        return target;
    },
    getVerticalPosition: function(position, move) {
       var rowNumber = Math.ceil((position)/ Cross.vertical);
       // var colNumber = ((position - 1) % Cross.horizontal)+1;
       var target = position + move * Cross.vertical;

        if ( (move > 0) && (rowNumber == Cross.vertical) ) {
            return false;
        } else if ( (move < 0) && (rowNumber == 1) ) {
            return false;
        }

        return target;
    }

  };

  var Stats = {
    id: false,
    points: 0,
    totalPoints: 0,
    time: {
      start: false,
      end: false,
      total: false
    },
    start: function() {
      Stats.points = 0;
      Stats.time.start = new Date();
    },
    finish: function() {
      Stats.time.end = new Date();
      Stats.time.total = (Stats.time.end - Stats.time.start) / 1000;
      Stats.points += parseInt(Stats.time.total, 10) * 2;
      Stats.submit();
    },
    addLevelPoints: function() {
      var levelConfig = LevelsConfig.getLevel(Controller.level);
      Stats.points += levelConfig.levelPoints;
    },
    submit: function() {
      var points = Stats.points + Stats.totalPoints;
      // FBStats.addScore(points, Player.name);
      Stats.renderStats(points);
    },
    renderStats: function(points) {
      $('table.data')
        .find('tr.points')
          .remove()
        .end()
        .append('<tr class="points">' +
              '<td>Points: '+points+'</td>' +
            '</tr>');
      Controller.actionButtons();
    },
    addPoints: function(bubleType) {
      var points = Bubles.getBublePoints(bubleType);
      Stats.points += points;
    },
    makeTotalPoints: function() {
      Stats.totalPoints += Stats.points;
    },
    topResults: function($item) {
      $.fancybox.showLoading();
      $item
        .parent()
        .hide()
        .end()
        .closest('#startPrompt')
          .find('.results')
            .show();
      $.fancybox.hideLoading();
    }
  };

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
         Ai.finish();
         Timer.finish();

         Cross.table.find('td')
           .prop('disabled', true);
         $('#timer')
           .html('Ran out of time. Try again.');
         Controller.actionButtons();
         return;
      }

      $('#timer .time').html(Timer.seconds);
    },
    finish: function() {
      clearInterval(Timer.interval);
    }
  };

  //basic object to controll app runing
  var Controller = {
    started: false,
    finished: false,
    level: false,
    start: function(level) {
      $('#stats')
        .hide()
        .find('span.time')
        .html('');

      if (level === undefined || !Controller.level) {
        Controller.level = Controller.level ? Controller.level + 1 : 1;
      }
      var levelConfig = LevelsConfig.getLevel(Controller.level);
      if (!levelConfig) {
        return Controller.end();
      }

      Timer.start(levelConfig.timer);
      Bubles.start(levelConfig.bubles);
      Cross.init(gameBoard);
      Cross.table.html('');
      Cross.start(levelConfig.cross);
      PcMan.start(Cross.getEmptySquare());
      Ai.start(levelConfig.ai, Cross.getEmptySquare());

      Stats.start(Controller.level);
      Controller.started = true;
      Controller.finished = false;
    },
    end: function() {
      Controller.finished = true;
      console.log('The end', Stats.stats);
    },
    actionButtons: function() {
      if (Controller.level < LevelsConfig.config.length) {
        $('#data button')
          .show()
          .prop('disabled', false);
      } else {
        $('#data button')
          .hide()
          .end()
            .append('<p>THE END</p>');
      }
    }
  };

  //main muscles of moving snake
  var Ai = {
    speedConst: 400,
    interval: false,
    currentPosition: false,
    speed: false,
    sign: '&#8855;',
    level: 1,
    side: false,
    start: function(data, startPosition) {
      Ai.currentPosition = startPosition;
      Ai.currentPosition = 10;
      Ai.speed = data.speed;
//UNCOMENT FOR AI
      // Cross.renderItem(Ai.currentPosition, Ai.sign, 'worm');
      // Ai.interval = setInterval(Ai.moveAi, Ai.speed * Ai.speedConst);
    },
    moveAi: function() {
      var position = Cross.getMoveAiPosition(Ai.currentPosition, Ai.level);
      Cross.moveAi(Ai.currentPosition, position, Ai.sign);
      Ai.currentPosition = position;
    },
    finish: function() {
      clearInterval(Ai.interval);
    },
    setSide: function(side) {
      Ai.side = side;
    },
    getSide: function(side) {
      return Ai.side;
    }
  };

  //used for storing user name :)
  var Storage = {
    saveData: function(name, value) {
      return localStorage.setItem(name, JSON.stringify(value));
    },
    getData: function(name) {
      var data = localStorage.getItem(name);
      return JSON.parse(data);
    }
  };



$(document).ready(function(){

  // FBStats.init();
  //start fancybox
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
        Controller.start(1);
        $('#startPrompt button.back').trigger('click');
        break;
      case 'play':
        var user = Storage.getData('user');
        if (user !== null) {
          Player.useUser(user);
          $.fancybox.close();
          return Controller.start();
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
        Controller.start(Controller.level);
        break;
      case 'next':
        Stats.makeTotalPoints();
        Controller.start();
        break;
      case 'menu':
        $('#fancyBox').trigger('click');
        break;
    }
  });


  //user clicks
  $('table#'+gameBoard).on('click', 'tr td', function() {
    Cross.click($(this));
  });

    $('body').keydown(function(e) {
        var keys = [37, 38, 39, 40];
        if (Controller.started && !Controller.finished
            && keys.indexOf(e.keyCode) != -1) {
            PcMan.moveItem(e.keyCode);
        }
    });

});

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//UNUSED
//code reused https://www.firebase.com/tutorial/ - Leaderboard example
  // var FBStats = {
  //   link: 'https://jgames.firebaseio.com/crosses/',
  //   ref: undefined,
  //   scoreListView: undefined,
  //   limit: 10,
  //   htmlForPath: {},
  //   init: function() {
  //     FBStats.ref = new Firebase(FBStats.link);
  //     FBStats.scoreListView = FBStats.ref.limit(FBStats.limit);

  //     FBStats.scoreListView.on('child_added', function (newScoreSnapshot, prevScoreName) {
  //       FBStats.handleScoreAdded(newScoreSnapshot, prevScoreName);
  //     });

  //     FBStats.scoreListView.on('child_removed', function (oldScoreSnapshot) {
  //       FBStats.handleScoreRemoved(oldScoreSnapshot);
  //     });

  //     var changedCallback = function (scoreSnapshot, prevScoreName) {
  //       FBStats.handleScoreRemoved(scoreSnapshot);
  //       FBStats.handleScoreAdded(scoreSnapshot, prevScoreName);
  //     };
  //     FBStats.scoreListView.on('child_moved', changedCallback);
  //     FBStats.scoreListView.on('child_changed', changedCallback);
  //   },
  //   handleScoreAdded: function(scoreSnapshot, prevScoreName) {
  //     var newScoreRow = $("<tr/>");
  //     newScoreRow.append($("<td/>").append($("<em/>").text(scoreSnapshot.val().name)));
  //     newScoreRow.append($("<td/>").text(scoreSnapshot.val().score));

  //     FBStats.htmlForPath[scoreSnapshot.name()] = newScoreRow;

  //     if (prevScoreName === null) {
  //       $("#dataScores").append(newScoreRow);
  //     }
  //     else {
  //       var lowerScoreRow = FBStats.htmlForPath[prevScoreName];
  //       lowerScoreRow.before(newScoreRow);
  //     }
  //   },
  //   handleScoreRemoved: function(scoreSnapshot) {
  //     var removedScoreRow = FBStats.htmlForPath[scoreSnapshot.name()];
  //     removedScoreRow.remove();
  //     delete FBStats.htmlForPath[scoreSnapshot.name()];
  //   },
  //   addScore: function(score, name) {
  //     var userScoreRef = FBStats.ref.child(name);
  //     userScoreRef.setWithPriority({ name: name, score: score }, score);
  //   }
  // };


