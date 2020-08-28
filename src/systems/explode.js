const ApeECS = require('ape-ecs');
const Pixi = require('pixi.js');

class ExplodeSystem extends ApeECS.System {

  init() {

    this.explodeQuery = this.createQuery()
      .fromAll('Explode', 'Position')
      .persist();

    this.explosionQuery = this.createQuery()
      .fromAll('Explosion', 'Position')
      .persist();

    this.hitQuery = this.createQuery()
      .fromAll('Position', 'Missile')
      .persist();

    this.gamec = this.world.getEntity('gentity').c.game;
  }

  update() {

    const entities = this.explodeQuery.execute();
    for (const entity of entities) {
      const explode = entity.getOne('Explode');
      const position = entity.getOne('Position');
      const seg = Math.PI * 2 / explode.particles;
      let a = 0;
      let radius = 200;
      let circle = new Pixi.Graphics();
      circle.lineStyle({ color: 0xffffff, width: 5 });
      circle.drawCircle({ radius: 5 });
      this.gamec.layers.main.addChild(circle);
      const exp = this.world.createEntity({
        components: [
          {
            type: 'Position',
            key: 'position',
            x: position.x,
            y: position.y,
            angle: a
          },
          {
            key: 'explosion',
            type: 'Explosion',
            maxRadius: radius,
            speed: 2,
            circle: circle
          }
        ]
      });
      if (entity.has('FromPlayer')) {
        exp.addTag('FromPlayer');
        radius = 100
        exp.c.explosion.maxRadius = radius;
      }
      entity.destroy();
    }

    const hittables = this.hitQuery.execute();

    const explosions = this.explosionQuery.execute();
    for (const e of explosions) {
      let fromPlayer = e.has('FromPlayer');
      e.c.explosion.radius += e.c.explosion.speed * this.gamec.deltaFrame;
      e.c.explosion.speed *= (1 + .05 * this.gamec.deltaFrame);
      if (e.c.explosion.radius >= e.c.explosion.maxRadius) {
        e.destroy();
        continue;
      }
      const pos = e.c.position;
      const exp = e.c.explosion;
      exp.circle.clear();
      exp.circle.lineStyle({ color: 0xffffff, width: 5 });
      exp.circle.drawCircle(pos.x, pos.y, exp.radius );
      for (const hittable of hittables) {
        if (fromPlayer && hittable.has('FromPlayer')) continue;
        const pos2 = hittable.getOne('Position');
        const dx = pos.x - pos2.x;
        const dy = pos.y - pos2.y;
        const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (dist <= exp.radius) {
          hittable.addComponent({
              type: 'Explode',
              particles: 30,
              frame: 'tri'
          });
        }
      }
    }
  }

}

module.exports = ExplodeSystem;
