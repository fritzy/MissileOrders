const ApeECS = require('ape-ecs');
const Util = require('../util');
const Pixi = require('pixi.js');

class CollisionSystem extends ApeECS.System {

  init() {

    this.missileQuery = this.createQuery()
      .fromAll('Missile', 'Position')
      .not('FromPlayer')
      .persist();
    this.stationQuery = this.createQuery()
      .fromAll('Station', 'Position')
      .persist();
    this.game = this.world.getEntity('gentity').c.game;
  }

  update() {

    const missiles = this.missileQuery.execute();
    const stations = this.stationQuery.execute();
    for (const missile of missiles) {
      const pos = missile.getOne('Position');
      if (pos.y > this.game.height - 70) {
        for (const station of stations) {
          const pos2 = station.getOne('Position');
          const dist = Util.distance(pos, pos2);
          if (dist < 60) {
            const circle = new Pixi.Graphics();
            this.game.layers.main.addChild(circle);
            const exp = this.world.createEntity({
              components: [
                {
                  type: 'Position',
                  key: 'position',
                  x: pos.x,
                  y: pos.y,
                  angle: 0
                },
                {
                  key: 'explosion',
                  type: 'Explosion',
                  maxRadius: 200,
                  speed: 2,
                  circle
                }
              ]
            });
            missile.destroy();
            station.destroy();
          }
        }
      }
    }
  }
}

module.exports = CollisionSystem;
