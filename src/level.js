const Pixi = require('pixi.js');
const Scene = require('./scene');
const ApeECS = require('ape-ecs');
const Components = require('./components');
const SpriteSystem = require('./systems/sprite');
const MovementSystem = require('./systems/movement');
const ExplodeSystem = require('./systems/explode');
const Bloom = require('@pixi/filter-advanced-bloom').AdvancedBloomFilter;

class Level extends Scene.Scene {

  constructor(game) {

    super(game);

    this.bg = Pixi.Sprite.from('space');
    this.addChild(this.bg);
    this.ecs = new ApeECS.World();
    this.ecs.registerComponent(Components.Sprite, 10);
    this.ecs.registerComponent(Components.Position, 10);
    this.ecs.registerComponent(Components.Vector, 10);
    this.ecs.registerComponent(Components.Game, 1);
    this.ecs.registerComponent(Components.Explode, 5);
    this.ecs.registerComponent(Components.Explosion, 5);
    this.ecs.registerTags('New', 'Destroy', 'Missile', 'Particle', 'FromPlayer');

    this.mouse = {
      x: 0,
      y: 0,
      buttons: {},
      down: false
    };
    const canvas = this.game.renderer.view;

    canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    });

    canvas.addEventListener('mousedown', (e) => {
      this.mouse.buttons[e.which] = true;
      this.mouse.down = true;
      console.log(this.mouse);
    });
    canvas.addEventListener('mouseup', (e) => {
      this.mouse.buttons[e.which] = false;
    });

    this.filters = [
      new Bloom({
        threshold: 1,
        bloomScale: 1,
        brightness: 1,
        blur: 8,
        quality: 4
      }),
    ];

    const gentity = this.ecs.createEntity({
      id: 'gentity',
      components: [
        {
          type: 'Game',
          key: 'game',
          width: canvas.width,
          height: canvas.height,
          layers: {
            'main': this
          }
        }
      ]
    });
    this.gamec = gentity.c.game;


    this.ecs.registerSystem('everyframe', MovementSystem);
    this.ecs.registerSystem('everyframe', SpriteSystem);
    this.ecs.registerSystem('everyframe', ExplodeSystem);

    this.gentity = null;
  }

  async standUp() {


    this.lastShot = 0;
  }

  makeMissile(fromPlayer) {

    let a;
    let x;
    let y;
    let dist;
    let speed;
    let color;
    if (fromPlayer) {
      const dx = this.mouse.x - this.gamec.width / 2;
      const dy = this.mouse.y - this.gamec.height;
      dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      a = Math.atan2(dy, dx);
      x = this.gamec.width/2,
      y = this.gamec.height,
      this.mouse.down = false;
      speed = 10;
      color = 0xaaffaa;
    } else {
      x = Math.random() * this.gamec.width;
      y = 0;
      const x2 = Math.random() * this.gamec.width;
      const y2 = this.gamec.height;
      const dx = x2 - x;
      const dy = y2 - y;
      dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      a = Math.atan2(dy, dx);
      speed = 2;
      color = 0xffaaaa;
    }
    const entity = this.ecs.createEntity({
      tags: ['New', 'Missile'],
      components: [
        {
          type: 'Sprite',
          frame: 'missile',
          container: this,
          scale: 2.5,
          color: color
        },
        {
          type: 'Position',
          x,
          y,
          angle: a
        },
        {
          type: 'Vector',
          angle: a,
          speed,
          maxDistance: dist,
          mangle: 0
        }
      ]
    });
    if (fromPlayer) {
      entity.addTag('FromPlayer');
    }
  }

  updateMouse(e) {

    this.tileInfo.pos = this.map.getTile(e.offsetX, e.offsetY);
    this.cursor.position.set(this.tileInfo.pos.cx + (8 * this.map.container.scale.x), this.tileInfo.pos.cy + (8 * this.map.container.scale.y));
  }

  tearDown() {
  }

  update(dt, df, time) {

    this.lastFrame += dt;
    this.gamec.deltaTime = dt;
    this.gamec.deltaFrame = df;
    this.lastShot += dt;
    if (this.lastShot >= 1500) {
      this.lastShot %= 1500;
      this.makeMissile(false);
    }
    this.ecs.tick();
    if (this.mouse.down) this.makeMissile(true);
    this.ecs.runSystems('everyframe');

  }

}

module.exports = Level;
