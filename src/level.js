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
const Util = require('./util');

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
    this.ecs.registerTags('New', 'Destroy', 'Missile', 'Particle', 'FromPlayer', 'Station', 'ToHit');
    this.fixtures = Fixtures(this.ecs);

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

    this.lastShot = 0;
    this.lastDef = 0;
    const stations = 10;
    const seg = this.gamec.width / stations;
    let x = 0;
    for (let i = 0; i < stations - 1; i++) {
      x += seg;
      this.fixtures.makeStation(x, this.gamec);
    }
  }

  standUp() {

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
    if (this.lastShot >= 1300) {
      this.lastShot %= 1300;
      this.fixtures.makeMissile(false, this.gamec, this.mouse);
    }
    this.lastDef += dt;
    if (this.lastDef >= 1500) {
      const Vector = Util.Vector;
      this.lastDef %= 1500;
      const q1 = this.ecs.createQuery().fromAll('Missile', 'Position', 'Vector').not('FromPlayer', 'ToHit');
      let missiles = [...q1.execute()];
      missiles = missiles.sort((a, b) => {
        const aP = a.getOne('Position');
        const bP = b.getOne('Position');
        return bP.y - aP.y;
      });
      //const target = missiles[missiles.length - 1];
      const target = missiles[0];
      target.addTag('ToHit');
      const tpc = target.getOne('Position');
      const targetPos = new Util.Vector(tpc.x, tpc.y);
      const tvc = target.getOne('Vector');
      const targetVec = new Util.Vector(Math.cos(tvc.angle) * tvc.speed, Math.sin(tvc.angle) * tvc.speed);
      const [vx, vy] = targetVec.components;

      const towerPos = new Util.Vector(this.gamec.width / 2, this.gamec.height);
      const towerX = this.gamec.width / 2;
      const towerY = this.gamec.height;
      const toTarget = targetPos.diff(towerPos);
      // a = Vector.Dot(target.velocity, target.velocity) - (bullet.velocity * bullet.velocity)
      const a = Math.pow(vx, 2) + Math.pow(vy, 2) - Math.pow(10, 2);
      //const a = Vector.Dot(targetVec, targetVec) - (10 * 10);
      //    b = 2 * Vector.Dot(target.velocity, totarget);
      //const b = 2 * Vector.Dot(targetVec, toTarget);
      const b = 2 * (vx * (tpc.x - towerX) + vy * (tpc.y - towerY))
      //const b = 2 * targetVec.dot(toTarget);
      //    c = Vector.Dot(totarget, totarget);
      const c = Math.pow(tpc.x - towerX, 2) + Math.pow(tpc.y - towerY, 2);
      const disc = Math.pow(b, 2) - 4 * a * c
      const t = Math.abs((-b - Math.sqrt(disc)) / (2 * a)) * 1.1;
      //const c = Vector.Dot(toTarget, toTarget);
      //const c = toTarget.dot(toTarget);
      console.log('a', a, 'b', b, 'c', c);
      //    p = -b / (2 * a);
      //const p = -b / (2 * a);
      //    q = Math.Sqrt((b * b) - 4 * a * c) / (2 * a);
      //const q = Math.sqrt((b * b) - 4 * a * c) / (2 * a);
      //const t = Math.abs(p - q);// * 0.53;
      console.log('t', t);

      const ex = tpc.x + (vx * t);
      const ey = tpc.y + (vy * t);
      const angle = Math.atan2(this.gamec.height - ey, this.gamec.width / 2 - ex)
      this.fixtures.makeMissile(true, this.gamec, { x: ex, y: ey });

    }
    this.ecs.tick();
    if (this.mouse.down) this.fixtures.makeMissile(true, this.gamec, this.mouse);
    this.ecs.runSystems('everyframe');

  }

}

module.exports = Level;
