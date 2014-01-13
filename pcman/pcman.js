//https://github.com/qiao/PathFinding.js
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


var PathFinder = {
    grid: {},
    finder: {},
    init: function(config) {
        PathFinder.grid = new PF.Grid(
          config.horizontal,
          config.vertical
      );
      PathFinder.finder = new PF.AStarFinder();
    },
    findPath: function(hunter, fish) {
      var grid = PathFinder.grid.clone();
      var path = PathFinder.finder.findPath(
          hunter.x,
          hunter.y,
          fish.x,
          fish.y,
          grid
      );

      if (path.length < 2) {
          return false;
      }

      return {
        x: path[1][0],
        y: path[1][1]
      }
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
    },
    getCurrentPosition: function() {
        return PcMan.currentPosition;
    }
};

var LevelsConfig = {
  config: [ {
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
    wall: {
        simple: {
             coordinates: [9, 10, 11, 17, 27, 28],
             sign: '&#64;',
        }
    },
    cross: {
      vertical: 12,
      horizontal: 17,
      wallArround: true
    },
    timer: {
      seconds: 20
    }
  } ],
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
  wall: [],
  wallArround: false,
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
    Cross.wallArround = data.wallArround;
  },
  _reset: function() {
    Cross.filled = {};
  },
  _generateTable: function() {
    var count = 1;
    for (var i=1; i<=Cross.vertical;i++) {
      var $tr = $(document.createElement('tr'));
      for (var k=1; k<=Cross.horizontal;k++) {
        var $td = $(document.createElement('td'));
        $td.attr('data-number', count++);
        $tr.append($td);
      }
      $(Cross.table)
        .append($tr);
    }

    if (Cross.wallArround) {
        Cross._generateWallArround();
    }
  },
  _generateWallArround: function () {
      var c = {
          sign: '&#64;',
          coordinates: []
      };

        for(var k=1; k<=Cross.vertical;k++) {
            if (k==1 || k== Cross.vertical) {
                for(var i=1;i<=Cross.horizontal;i++) {
                    c.coordinates.push((k*Cross.horizontal - Cross.horizontal) + i);
                }
            } else {
                c.coordinates.push((k*Cross.horizontal - Cross.horizontal)+1);
                c.coordinates.push((k*Cross.horizontal));
            }
        }
        Cross.wall.concat(c.coordinates)
        Cross.renderWall({simple: c});

    },
    _renderBubles: function(bubles){
      var squares = Cross.vertical * Cross.horizontal;
      $.each(bubles, function(key, value) {
        for (var i=1;i<=value.number;) {
          var random = getRandomInt(1, squares);
          if (Cross.filled[random] === undefined
             && Cross.wall.indexOf(random) == -1) {
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
    renderWall: function(coordinates) {
        for (item in coordinates) {
            Cross.wall = Cross.wall.concat(coordinates[item].coordinates);
            coordinates[item].coordinates.forEach(function(entry) {
              $(Cross.table)
                .find('td[data-number="'+entry+'"]')
                .addClass('wall')
                .html(coordinates[item]['sign'])
                .attr('data-wall', true);
            });
        }
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
        if (Cross.filled[rand] === undefined
           && Cross.wall.indexOf(rand) == -1) {
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

        if (!pp || Cross.wall.indexOf(pp) != -1) {
            return false;
        }

        Cross.table
            .find(activeItem)
            .removeClass('active' + Cross.upperF(item))
            .html('');

        Cross.renderItem(pp, sign, item);
        return pp;
    },
    getHorizontalPosition: function(position, move) {
       // var rowNumber = Math.ceil((position - 1)/ Cross.horizontal);
       var colNumber = ((position - 1) % Cross.horizontal)+1;
       var target = position + move;
        if ( (move > 0) && (colNumber == Cross.horizontal) ) {
            return false;
        } else if ( (move < 0) && (colNumber == 1) ) {
            return false;
        }

        return target;
    },
    getVerticalPosition: function(position, move) {
       var target = position + move * Cross.horizontal;
       if ( (move > 0) && (target > Cross.vertical*Cross.horizontal) ) {
           return false;
       } else if ( (move < 0) && (target < 1) ) {
           return false;
       }

       return target;
    },
    moveAi: function(position, sign) {
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
      } else if ($td.hasClass('activePcman')) {
        $td
          .addClass('worm')
          .addClass('activeWorm')
          .addClass('finito')
          .html(sign);
        Controller.end();
      } else {
        $td
          .addClass('worm')
          .addClass('activeWorm')
          .html(sign);
      }
    },
    getCoordinates: function(position) {
        return {
            x: ((position - 1) % Cross.horizontal)+1,
            y: Math.ceil((position - 1)/ Cross.horizontal)
        };
    },
    getPosition: function(coordinates) {
        return coordinates.y * Cross.horizontal - Cross.horizontal + coordinates.x;
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
    Cross.renderWall(levelConfig.wall);
    PcMan.start(Cross.getEmptySquare());
    PathFinder.init(levelConfig.cross);

    Ai.start(levelConfig.ai, Cross.getEmptySquare());

    Stats.start(Controller.level);
    Controller.started = true;
    Controller.finished = false;
  },
  end: function() {
    Ai.finish();
    Timer.finish();
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

var Ai = function(data) {
  // this.interval        = data.interval;
  this.speed           = data.speed;
  this.sign            = data.sign;
  this.level           = data.level;
  this.side            = data.side,
  this.speedConst      = data.speedConst;
  this.currentPosition = data.currentPosition;

  Cross.renderItem(Ai.currentPosition, Ai.sign, 'worm');
  this.interval = setInterval(Ai.moveAi, Ai.speed * Ai.speedConst);

};

Ai.prototipe.finish() {
    clearInterval(this.interval);
}


//main muscles of moving snake
// var Ai = {
//   speedConst: 400,
//   interval: false,
//   currentPosition: false,
//   speed: false,
//   sign: '&#8855;',
//   level: 1,
//   side: false,
//   start: function(data, startPosition) {
//     Ai.currentPosition = startPosition;
//     Ai.speed = data.speed;
//     Cross.renderItem(Ai.currentPosition, Ai.sign, 'worm');
//     Ai.interval = setInterval(Ai.moveAi, Ai.speed * Ai.speedConst);
//   },
//   moveAi: function() {
//     // var position = Cross.getMoveAiPosition(Ai.currentPosition, Ai.level);
//     var hunter = Cross.getCoordinates(Ai.currentPosition);
//     var fish = Cross.getCoordinates(PcMan.getCurrentPosition());
//     var coordinates = PathFinder.findPath(hunter, fish);
//     var position = Cross.getPosition(coordinates);
//     Ai.currentPosition = position;
//     Cross.moveAi(position, Ai.sign);
//   },
//   finish: function() {
//     clearInterval(Ai.interval);
//   },
// };

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
  // //start fancybox
  // $('#fancyBox').fancybox({
  //   autoSize: false,
  //   openEffect: false,
  //   closeEffect: false,
  //   closeClick: false,
  //   modal: true,
  //   live: true,
  //   beforeLoad: function() {
  //     this.width  = 400;
  //     this.height = 150;
  //   }
  // }).trigger('click');
      Player.saveName('qqqqqq');
      Controller.start(1);

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
        if (
            Timer.interval && Timer.seconds &&
            keys.indexOf(e.keyCode) != -1) {
            PcMan.moveItem(e.keyCode);
        }
    });

});

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
