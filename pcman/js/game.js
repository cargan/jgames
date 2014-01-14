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
    $('#info')
        .hide()
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

	//ADD SECOND AI
    var Ais = [];
    Ais.push( new Ai(levelConfig.ai, Board.getEmptySquare()) );
    Ais.push( new Ai(levelConfig.ai, Board.getEmptySquare()) );

    Ais.forEach(function(item) {
        Board.renderItem(item.getPosition(), item.getSign(), item.getId());
    });
    Game.aiInterval = setInterval(function() {
      Ais.forEach(function(item) {
        var hunter      = Board.getCoordinates(item.getPosition());
        var fish        = Board.getCoordinates(PcMan.getCurrentPosition());
        var coordinates = PathFinder.findPath(hunter, fish);
        var position    = Board.getPosition(coordinates);
        Board.moveAi(item.getPosition(), position, item.getSign());
        item.setPosition(position);
      });
    }, 400*2);

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
      $('#info')
        .show()
        .html('<p>The End</p>');
      $('#data button')
        .show()
        .prop('disabled', false);
    } else {
      $('#data button').hide();
      $('#data button.restart').show();
    }
  }
};


