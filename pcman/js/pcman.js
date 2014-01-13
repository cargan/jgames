var PcMan = {
    currentPosition: false,
    sign: '&#9824;',
    identifier: 'pcman',
    start: function(position) {
        PcMan.currentPosition = position;
        Board.renderItem(
            PcMan.currentPosition,
            PcMan.sign,
            PcMan.identifier
        );
    },
    moveItem: function(code) {
        var directions = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        var currentP = Board.moveItemDirection(
            PcMan.currentPosition,
            directions[code],
            PcMan.sign,
            PcMan.identifier
        );
        if (currentP) {
            PcMan.currentPosition = currentP;
        }
    },
    getCurrentPosition: function() {
        return PcMan.currentPosition;
    }
};


