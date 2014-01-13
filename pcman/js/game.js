var Game = {
  started: false,
  finished: false,
  level: false,
  aiInterval: false,
  start: function(level) {
    $('#stats')
      .hide()
      .find('span.time')
      .html('');

    if (level === undefined || !Game.level) {
      Game.level = Game.level ? Game.level + 1 : 1;
    }
    var levelConfig = LevelConfig.getLevel(Game.level);
    if (!levelConfig) {
      return Game.finish();
    }

    Timer.start(levelConfig.timer);
    var Bubble = new Bubbles(
		levelConfig.bubbles,
		LevelConfig.getNumberOfBubbles(Game.level)
	);
	var b = Bubble.getBubbles();
    Board.init(gameBoard);
    Board.table.html('');
    Board.start(levelConfig.cross, b.bubbles);
    Board.renderWall(levelConfig.wall);
    PcMan.start(Board.getEmptySquare());
    PathFinder.init(levelConfig.cross);

    var Ai1 = new Ai(levelConfig.ai, Board.getEmptySquare());
    Game.aiInterval = setInterval(function() {
        var hunter      = Board.getCoordinates(Ai1.getPosition());
        var fish        = Board.getCoordinates(PcMan.getCurrentPosition());
        var coordinates = PathFinder.findPath(hunter, fish);
        var position    = Board.getPosition(coordinates);
        Ai1.setPosition(position);
        Board.moveAi(Ai1.getPosition(), Ai1.getSign());
    }, 400*2);
    Board.renderItem(Ai1.getPosition(), Ai1.getSign(), Ai1.getId());

    Stats.start(Game.level);
    Game.started = true;
    Game.finished = false;
  },
  finish: function() {
    clearInterval(Game.aiInterval);
    Game.finished = true;
    Game.started = false;
    Timer.finish();
    Stats.addLevelPoints();
    Stats.finish();
  },
  actionButtons: function() {
    if (Game.level < LevelConfig.config.length) {
      $('#data button')
        .show()
        .prop('disabled', false);
        $('#data').prepend('<p>The End</p>');
    } else {
      $('#data button').hide();
      $('#data button.restart').show();
    }
  }
};


