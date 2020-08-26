const ApeECS = require('ape-ecs');

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
            speed: 3
          }
        ]
      });
      if (entity.has('FromPlayer')) {
        exp.addTag('FromPlayer');
        radius = 100
        exp.c.explosion.maxRadius = radius;
      }
      for (let i = 0; i < explode.particles; i++) {
        const p = this.world.createEntity({
          tags: ['New', 'Particle'],
          components: [
            {
              type: 'Sprite',
              frame: 'tri',
              layer: 'main',
              anchorX: .25,
              anchorY: .25,
              color: 0xff5500,
              scale: 1.5
            },
            {
              type: 'Position',
              x: position.x,
              y: position.y,
              angle: a
            },
            {
              type: 'Vector',
              angle: a,
              speed: 3,
              maxDistance: radius,
              mangle: Math.random() - .5
            }
          ]
        });
        a += seg;
      }
      entity.destroy();
    }

    const hittables = this.hitQuery.execute();

    const explosions = this.explosionQuery.execute();
    for (const e of explosions) {
      let fromPlayer = e.has('FromPlayer');
      e.c.explosion.radius += e.c.explosion.speed * this.gamec.deltaFrame;
      if (e.c.explosion.radius >= e.c.explosion.maxRadius) {
        e.destroy();
        continue;
      }
      const pos = e.c.position;
      const exp = e.c.explosion;
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
