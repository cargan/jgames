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
      return Game.end();
    }

    Timer.start(levelConfig.timer);
    Bubbles.start(levelConfig.bubles);
    Board.init(gameBoard);
    Board.table.html('');
    Board.start(levelConfig.cross);
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
  end: function() {
    clearInterval(Game.aiInterval);
    Timer.finish();
    Game.finished = true;
    console.log('The end', Stats.stats);
  },
  actionButtons: function() {
    if (Game.level < LevelConfig.config.length) {
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


