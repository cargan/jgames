var Board = {
  vertical: 0,
  horizontal: 0,
  filled: {},
  table: {},
  wall: [],
  wallArround: false,
  init: function(table) {
    Board.table = $('#'+table);
  },
  start: function(data, bubbles) {
    Board._reset();
    Board._setValues(data);
    Board._generateTable();
    Board._renderBubbles(bubbles);
  },
  _setValues: function(data) {
    Board.vertical = data.vertical;
    Board.horizontal = data.horizontal;
    Board.wallArround = data.wallArround;
  },
  _reset: function() {
    Board.filled = {};
    Board.wall = [];
  },
  _generateTable: function() {
    var count = 1;
    for (var i=1; i<=Board.vertical;i++) {
      var $tr = $(document.createElement('tr'));
      for (var k=1; k<=Board.horizontal;k++) {
        var $td = $(document.createElement('td'));
        $td.attr('data-number', count++);
        $tr.append($td);
      }
      $(Board.table)
        .append($tr);
    }

    if (Board.wallArround) {
        Board._generateWallArround();
    }
  },
  _generateWallArround: function () {
      var c = {
          sign: '&#64;',
          coordinates: []
      };

        for(var k=1; k<=Board.vertical;k++) {
            if (k==1 || k== Board.vertical) {
                for(var i=1;i<=Board.horizontal;i++) {
                    c.coordinates.push((k*Board.horizontal - Board.horizontal) + i);
                }
            } else {
                c.coordinates.push((k*Board.horizontal - Board.horizontal)+1);
                c.coordinates.push((k*Board.horizontal));
            }
        }
        Board.wall.concat(c.coordinates)
        Board.renderWall({simple: c});

    },
    _renderBubbles: function(bubles){
      var squares = Board.vertical * Board.horizontal;
      $.each(bubles, function(key, value) {
        for (var i=1;i<=value.number;) {
          var random = getRandomInt(1, squares);
          if (Board.filled[random] === undefined
             && Board.wall.indexOf(random) == -1) {
            Board.filled[random] = key;
            Board._render(random, key, value.sign);
            i++;
          }
        }
      });
    },
    _render: function(number, bubleType, sign) {
      $(Board.table)
        .find('td[data-number="'+number+'"]')
        .addClass('clickable')
        .html(sign)
        .attr('data-buble', bubleType);
    },
    renderWall: function(coordinates) {
        for (item in coordinates) {
            Board.wall = Board.wall.concat(coordinates[item].coordinates);
            coordinates[item].coordinates.forEach(function(entry) {
              $(Board.table)
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
        Board.checkBubblesLeft();
      }
    },
    clearField: function(position) {
      $(Board.table)
        .find('td[data-number="'+position+'"]')
        .removeClass()
        .html('');
    },
    checkBubblesLeft: function() {
      // if (Board.bublesOnTheBoard == Bubbles.numberBubbles) {
      if (Board.table.find('td.clickable').not('.clicked').length === 0) {
        Game.finish();
		Board.table.find('td')
          .prop('disabled', true);
        $('#start button')
          .prop('disabled', false);
		return false;
      }
		return true;
    },
    getEmptySquare: function() {
      var squares = Board.vertical * Board.horizontal;
      var position = false;
      while (!position) {
        var rand = getRandomInt(1, squares);
        if (Board.filled[rand] === undefined
           && Board.wall.indexOf(rand) == -1) {
          position = rand;
        }
      }

      return position;
    },
    renderItem: function(position, sign, item) {
		var $td = Board.table.find('td[data-number="'+position+'"]');

      if ($td.data('buble')) {
        $td
          .removeAttr('data-buble')
		}

        $td.addClass(item)
			.addClass('active'+Board.upperF(item))
			.addClass('clicked')
			.html(sign);
    },
    upperF: function(item) {
        return item.charAt(0).toUpperCase() + item.slice(1);
    },
    moveItemDirection: function(position, direction, sign, item) {
        var activeItem = 'td.active' + Board.upperF(item);
        var $td = Board.table
            .find(activeItem);
        pp = false;
        if (direction == 'left') {
            pp = Board.getHorizontalPosition(position, -1);
        } else if (direction == 'right') {
            pp = Board.getHorizontalPosition(position, 1);
        } else if (direction == 'up') {
            pp = Board.getVerticalPosition(position, -1);
        } else {
            //down
            pp = Board.getVerticalPosition(position, 1);
        }

        if (!pp || Board.wall.indexOf(pp) != -1) {
            return false;
        }

        Board.table
            .find(activeItem)
            .removeClass('active' + Board.upperF(item))
            .html('');

        Board.renderItem(pp, sign, item);
        Board.checkBubblesLeft();
        return pp;
    },
    moveAi: function(currentPosition, position, sign) {
      $(Board.table)
        .find('td[data-number="'+currentPosition+'"]')
        .removeClass()
        .html('');

      var $td = Board.table
        .find('td[data-number="'+position+'"]');

      if ($td.data('buble')) {
        $td
          .removeAttr('data-buble')
          .removeClass('clickable')
          .addClass('clicked')
          .addClass('worm')
          .addClass('activeWorm')
          .html(sign);
        Board.checkBubblesLeft();
      } else if ($td.hasClass('activePacman')) {
        $td
          .addClass('worm')
          .addClass('activeWorm')
          .addClass('finito')
          .html(sign);
          Game.finish();
      } else {
        $td
          .addClass('worm')
          .addClass('activeWorm')
          .html(sign);
      }
    },
    getHorizontalPosition: function(position, move) {
       var colNumber = ((position - 1) % Board.horizontal)+1;
       var target = position + move;
        if ( (move > 0) && (colNumber == Board.horizontal) ) {
            return false;
        } else if ( (move < 0) && (colNumber == 1) ) {
            return false;
        }
        return target;
    },
    getVerticalPosition: function(position, move) {
       var target = position + move * Board.horizontal;
       if ( (move > 0) && (target > Board.vertical*Board.horizontal) ) {
           return false;
       } else if ( (move < 0) && (target < 1) ) {
           return false;
       }

       return target;
    },

    getCoordinates: function(position) {
        return {
            x: ((position - 1) % Board.horizontal)+1,
            y: Math.ceil((position - 1)/ Board.horizontal)
        };
    },
    getPosition: function(coordinates) {
        return coordinates.y * Board.horizontal - Board.horizontal + coordinates.x;
    }
  };


