const ApeECS = require('ape-ecs');

class MovementSystem extends ApeECS.System {

  init() {

    this.posQuery = this.createQuery()
      .fromAll('Position', 'Vector')
      .persist();
    this.gamec = this.world.getEntity('gentity').c.game;
  }

  update() {

    const entities = this.posQuery.execute();
    for (const entity of entities) {
      const pos = entity.getOne('Position');
      const vec = entity.getOne('Vector');
      //const angle = vec.angle * 0.0174533;
      //pos.angle = vec.angle;
      pos.angle += vec.mangle;
      pos.angle %= Math.PI * 2;
      const delta = this.gamec.deltaFrame;
      const mx = Math.cos(vec.angle) * vec.speed * delta;
      const my = Math.sin(vec.angle) * vec.speed * delta;
      vec.distance += Math.sqrt(Math.pow(mx, 2) + Math.pow(my, 2));
      pos.x += mx;
      pos.y += my;
      pos.update();
      if (vec.maxDistance > 0) {
        if (vec.distance >= vec.maxDistance) {
          if (entity.has('Missile')) {
            entity.addComponent({
              type: 'Explode',
              particles: 30,
              frame: 'tri'
            });
          } else {
            entity.destroy();
          }
        }
      }
    }
  }
}

module.exports = MovementSystem;
