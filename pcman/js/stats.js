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
    var levelConfig = LevelConfig.getLevel(Game.level);
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
    Game.actionButtons();
  },
  addPoints: function(bubleType) {
    var points = Bubbles.getBublePoints(bubleType);
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


