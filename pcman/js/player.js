var Player = {
  name: false,
  saveName: function(name) {
    Player.name = name;
  },
  setDataPlayer: function() {
    $('table.data')
      .prepend('<tr><td>Player:</td><td><i>' + Player.name + '</i></td></tr>');
  }
};


