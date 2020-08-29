function distance(p1, p2) {

  dx = p1.x - p2.x;
  dy = p1.y - p2.y;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

class Vector {
  constructor(...components) {

    this.components = components;
  }

  static Dot(v1, v2) {
    return v1.components[0] * v2.components[0] + v1.components[1] * v2.components[1];
  }

  dot({ components }) {

    return components.reduce((acc, comp, idx) => acc + comp * this.components[idx], 0);
  }

  diff( { components }) {
    const out = [];
    for (let idx = 0; idx < this.components.length; idx++) {
      out.push(this.components[idx] - components[idx]);
    }
    return new Vector(...out);
  }
}

module.exports = {
  distance,
  Vector
};
