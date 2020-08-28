function distance(p1, p2) {

  dx = p1.x - p2.x;
  dy = p1.y - p2.y;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

module.exports = {
  distance
};
