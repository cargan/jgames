var Bubbles = function(bubbles, number) {
  this.bubbles       = bubbles;
  this.numberBubbles = number;
};

Bubbles.prototype.getBubbles = function() {
    return this.bubbles;
}
Bubbles.prototype.getBublePoints = function(type) {
    var points = false;
    $.each(this.bubles, function(key, value) {
        if (type == key) {
			points = value.points;
			return false;
        }
    });

    return points;
};
