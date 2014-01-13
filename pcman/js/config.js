var LevelConfig = {
  config: [ {
    name: 'first',
    levelPoints: 5,
    ai: {
      speed: 2,
      sign: 'qq',
      level: 1,
      speedConst: 400
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
    return LevelConfig.config[level-1];
  },
  getNumberOfBubbles: function(level) {
    var bubles = LevelConfig.config[level-1].bubles.bubles;
    var bublesCount = 0;
    $.each(bubles, function(key, value) {
      bublesCount += value.number;
    });

    return bublesCount;
  }
};
