var Cross = {
  vertical: 0,
  horizontal: 0,
  filled: {},
  table: null,
  setValues: function(data) {
    Cross.vertical = data.vertical;
    Cross.horizontal = data.horizontal;
    Cross.table = data.table;
  },
  start: function(data) {
    Cross.reset();
    Cross.setValues(data);
    Cross.generateTable();
    Cross.renderBubles(Bubles.getBubles());
  },
  draw: function(x, y) {
  },
  reset: function() {
    Cross.filled = {};
  },
  generateTable: function() {
    for (var i=1; i<=Cross.horizontal;i++) {
      var $tr = $(document.createElement('tr'));
      for (var k=1; k<=Cross.vertical;k++) {
        var $td = $(document.createElement('td'));
        var tdNumber = (i*Cross.horizontal - Cross.horizontal) + k;
        $td.attr('data-number', tdNumber);
        $tr.append($td);
      }
      console.log('suds');
      Cross.table.append($tr);
    }
  },
  renderBubles: function(bubles){
    var squares = Cross.vertical * Cross.horizontal;
    $.each(bubles, function(key, value) {
      for (var i=1;i<=value.number;) {
        var random = getRandomInt(1, squares);
        if (Cross.filled[random] === undefined) {
          Cross.filled[random] = key;
          Cross.render(random, key, value.sign);
          i++;
        }
      }
    });
  },
  render: function(number, bubleType, sign) {
    Cross.table
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
    if ($('table#crosses td.clickable').not('.clicked').length === 0) {
      Stats.addLevelPoints();
      Stats.finish();
      Timer.finish();
      Ai.finish();
      $('table#crosses td')
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
  renderAi: function(position, sign) {
    $('table#crosses')
      .find('td[data-number="'+position+'"]')
      .addClass('worm')
      .addClass('clicked')
      .html(sign);
  },
  getMoveAiPositionLogicLevelOne: function(positions) {
    var position = false;
    var tdArray = [];
    $.each(positions, function(key, value){
      var $td = $('table#crosses')
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
          $('table#crosses td[data-number="'+value+'"]')
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
  moveAi: function(oldPosition, position, sign) {
    $('table#crosses')
      .find('td[data-number="'+oldPosition+'"]')
      .removeClass('activeWorm')
      .html('');

    var $td = $('table#crosses')
      .find('td[data-number="'+position+'"]');

    if ($td.data('buble')) {
      $td
        .removeAttr('data-buble')
        .addClass('clicked')
        .addClass('worm')
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
    var rowNumber = position % Cross.horizontal;
    var target = position + move;
    if (target > Cross.horizontal * Cross.vertical || target <= 0) {
      target = false;
    }
    if (move > 0) {
      if (rowNumber === 0 || (rowNumber + move) > Cross.horizontal) {
        target = false;
      }
    } else {
      if (rowNumber <= Math.abs(move)) {
        target = false;
      }
    }

    return target;
  },
  getVerticalPosition: function(position, move) {
    var columnNumber = position % Cross.vertical || Cross.horizontal;
    var target = false;
    if (move > 0) {
      if (columnNumber !== Cross.vertical) {
        target = position + Cross.horizontal * move;
      } else {
        target = position + Cross.horizontal * move;
      }
    } else {
      if (columnNumber > 0) {
        target = position + Cross.horizontal * move;
      }
    }

    if (target > Cross.horizontal * Cross.vertical || target <= 0) {
      return false;
    }

    return target;
  }

};

//basic object to controll app runing
var Controller = {
  level: false,
  start: function(level) {
    $('table#crosses').html('');
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
    Cross.start(levelConfig.cross);
    Ai.start(levelConfig.ai, Cross.getEmptySquare());

    Stats.start(Controller.level);
  },
  end: function() {
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


$(document).ready(function(){
    var data = {
        vertical: 8,
        horizontal: 12,
        table: $('table#pcmanTable')
    };
    Cross.start(data);
});

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
