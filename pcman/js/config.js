var LevelConfig = {
  config: [ {
    name: 'first',
    levelPoints: 5,
    ai: {
      sign: 'qq',
      level: 1,
    },
    bubbles: {
      bubbles: {
        simple: {
          number: 2,
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
             coordinates: [9, 10, 11, 17],
             sign: '&#64;',
        }
    },
    cross: {
      vertical: 7,
      horizontal: 12,
      wallArround: true
    },
    timer: {
      seconds: 20
    }
  },
{
    name: 'second',
    levelPoints: 15,
    ai: {
      sign: 'qq',
      level: 1,
    },
    bubbles: {
      bubbles: {
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
  }
 ],
  getLevel: function(level) {
    return LevelConfig.config[level-1];
  },
  getNumberOfBubbles: function(level) {
    var bubbles = LevelConfig.config[level-1].bubbles.bubbles;
    var bubblesCount = 0;
    $.each(bubbles, function(key, value) {
      bubblesCount += value.number;
    });

    return bubblesCount;
  }
};
