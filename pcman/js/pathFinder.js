var PathFinder = {
    grid: {},
    finder: {},
    init: function(config, matrix) {
        matrix.forEach(function(item) {
            console.log(item);
        });
        PathFinder.grid = new PF.Grid(
          config.horizontal,
          config.vertical,
          matrix
      );
      PathFinder.finder = new PF.AStarFinder();
    },
    findPath: function(hunter, fish) {
      var grid = PathFinder.grid.clone();
      var path = PathFinder.finder.findPath(
          hunter.x,
          hunter.y,
          fish.x,
          fish.y,
          grid
      );

      if (path.length < 2) {
          return false;
      }

      return {
        x: path[1][0],
        y: path[1][1]
      }
    },
    setWalkable: function(x, y, value) {
        PathFinder.grid.setWalkableAt(x, y, value);
    }
};
