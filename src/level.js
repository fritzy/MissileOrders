const Pixi = require('pixi.js');
const Scene = require('./scene');
const ApeECS = require('ape-ecs');
const Components = require('./components');
const SpriteSystem = require('./systems/sprite');
const MovementSystem = require('./systems/movement');
const ExplodeSystem = require('./systems/explode');
const CollisionSystem = require('./systems/collide');
//const Bloom = require('@pixi/filter-advanced-bloom').AdvancedBloomFilter;
const Filters = require('pixi-filters');
const Fixtures = require('./fixtures');

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
    this.ecs.registerComponent(Components.ParticleEmitter, 5);
    this.ecs.registerTags('New', 'Destroy', 'Missile', 'Particle', 'FromPlayer', 'Station');
    this.ecs.registerFixture('missile', Fixtures.makeMissile);
    this.ecs.registerFixture('station', Fixtures.makeStation);

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
      e.preventDefault();
      return false;
    });
    window.addEventListener('contextmenu', (e) => {
      console.log('no');
      e.preventDefault();
      return false;
    });
    canvas.addEventListener('mouseup', (e) => {
      this.mouse.buttons[e.which] = false;
    });

    /*
    this.filters = [
      new Filters.CRTFilter({
      }),
    ];
    */

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
    this.ecs.registerSystem('everyframe', CollisionSystem);
    this.ecs.registerSystem('everyframe', ExplodeSystem);

    this.gentity = null;
  }

  async standUp() {

    this.lastShot = 0;
    const stations = 10;
    const seg = this.gamec.width / stations;
    let x = 0;
    for (let i = 0; i < stations - 1; i++) {
      x += seg;
      this.ecs.fixtures.station(x, this.gamec);
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
      this.ecs.fixtures.missile(false, this.gamec, this.mouse);
    }
    this.ecs.tick();
    if (this.mouse.down) this.ecs.fixtures.missile(true, this.gamec, this.mouse);
    this.ecs.runSystems('everyframe');

  }

}

module.exports = Level;
