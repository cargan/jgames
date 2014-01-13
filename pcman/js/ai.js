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
