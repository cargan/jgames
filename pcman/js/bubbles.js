var Bubbles = {
  speed: 0,
  bubles: {},
  numberBubbles: 0,
  start: function(data) {
    Bubbles.setValues(data);
  },
  setValues: function(data) {
    Bubbles.bubles = data.bubles;
    Bubbles.speed = data.speed;
    Bubbles.numberBubbles = LevelConfig.getNumberOfBubbles(Game.level);
  },
  getBubbles: function() {
    return Bubbles.bubles;
  },
  getBublePoints: function(type) {
    var points = false;
    $.each(Bubbles.bubles, function(key, value) {
      if (type == key) {
        points = value.points;
        return false;
      }
    });
    return points;
  }
};


