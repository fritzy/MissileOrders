const Pixi = require('pixi.js');

class Scene extends Pixi.Container {

  constructor(game) {

    super();
    this.game = game;
  }

  standUp() {

  }

  tearDown() {

  }

  update(dt, du) {
  }

}

module.exports = {
  Scene,
  Manager: require('./scene-manager')
}
