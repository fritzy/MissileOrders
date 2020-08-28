const ApeECS = require('ape-ecs');
const Component = ApeECS.Component;
const Pixi = require('pixi.js');

class Sprite extends Component {

  static properties = {
    frame: '',
    layer: '',
    anchorX: .5,
    anchorY: .5,
    scale: 1,
    sprite: null,
    container: null,
    color: 0xffffff
  }

  init() {

  }

  preDestroy() {

    if (this.sprite)
      this.sprite.destroy();
    this.container = null;
    this.sprite = null;
  }

}

class ParticleEmitter extends Component {

  static properties = {
    startAngle: 0,
    endAngle: 0,
    radius: 10,
    frequency: 16.66667,
    frame: '',
    color: 0xffffff
  }
}

class Position extends Component {

  static properties = {
    x: 0,
    y: 0,
    angle: 0
  }
}

class Vector extends Component {

  static properties = {
    speed: 0,
    angle: 0,
    distance: 0,
    maxDistance: 0,
    mangle: 0
  }
}

class Game extends Component {
  static properties = {
    deltaTime: 0,
    deltaFrame: 0,
    width: 0,
    height: 0,
    layers: null
  }
}

class Explosion extends Component {
  static properties = {
    radius: 0,
    speed: 0,
    maxRadius: 0,
    circle: null
  }

  preDestroy() {

    this.circle.destroy();
    this.circle = null;
  }

}

class Explode extends Component {
  static properties = {
    color: 0xffffff,
    particles: 0,
    frame: ''
  }
}

module.exports = {
  Sprite,
  Position,
  Vector,
  Game,
  Explode,
  Explosion,
  ParticleEmitter
};
