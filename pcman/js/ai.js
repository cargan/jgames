var Ai = function(data, position) {
  this.id              = 'worm';
  this.sign            = data.sign;
  this.position        = position;
};

Ai.prototype.getId = function() {
  return this.id;
}
Ai.prototype.getSign = function() {
  return this.sign;
}
Ai.prototype.getPosition = function() {
  return this.position;
}
Ai.prototype.setPosition = function(position) {
  this.position = position;
}
// Ai.prototype.moveAi: function(position) {
//   Board.clearField(this.position);
//   this.position = position;
//
//   if ($td.data('buble')) {
//     $td
//       .removeAttr('data-buble')
//       .removeClass('clickable')
//       .addClass('clicked')
//       .addClass('worm')
//       .addClass('activeWorm')
//       .html(sign);
//     Board.checkBubblesLeft();
//   } else if ($td.hasClass('activePcman')) {
//     $td
//       .addClass('worm')
//       .addClass('activeWorm')
//       .addClass('finito')
//       .html(sign);
//     Game.finish();
//   } else {
//     $td
//       .addClass('worm')
//       .addClass('activeWorm')
//       .html(sign);
//   }
// }
//
