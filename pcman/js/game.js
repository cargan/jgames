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
    PathFinder.init(levelConfig.cross, Board.getWallMatrix());
    PcMan.start(Board.getEmptySquare());

	//ADD SECOND AI
    Ais = [];
    Ais.push( new Ai(levelConfig.ai, Board.getEmptySquare()) );
    // Ais.push( new Ai(levelConfig.ai, Board.getEmptySquare()) );

    Ais.forEach(function(item) {
        Board.renderItem(item.getPosition(), item.getSign(), item.getId());
    });

   // Game.aiInterval = setInterval(function() {
      Ais.forEach(function(item) {
        var hunter      = Board.getCoordinates(item.getPosition());
        // console.log(item, item.getPosition(), hunter);
        var fish        = Board.getCoordinates(PcMan.getCurrentPosition());
        // console.log(PcMan.getCurrentPosition(), fish);
        var aiNextCoordinates = PathFinder.findPath(hunter, fish);
        console.log(
            'fish: ', fish,
            'hunter: ', hunter,
            'nextCoordinates:', aiNextCoordinates
        );
        // return false;
        // if (!aiNextCoordinates) {
        //     console.log('negavome coordinaciu', item, hunter, fish, aiNextCoordinates);
        //     return false;
        // }
        setTimeout(function() {
            var position    = Board.getPosition(aiNextCoordinates);
            console.log(Board.getCoordinates(item.getPosition(), position));
            Board.moveAi(item.getPosition(), position, item.getSign());
            item.setPosition(position);
        }, 400);
      });
    // }, 400*2);

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


