// This is the Fixtures file. These fixtures create entities
// in a reproducible way.  This ensures that there is a
// uniform structure for entities create here


module.exports = function (world) {

  return {
    // Makes a station Entity
    // The station entity has two componentsn and two tags
    // the New tag is stripped by the sprite system after the first update
    makeStation(x, game) {

      const entity = world.createEntity({
        tags: ['New', 'Station'],
        components: [
          {
            type: 'Sprite',
            frame: 'station',
            container: game.layers.main,
            scale: 3,
            color: 0xffffff
          },
          {
            type: 'Position',
            x,
            y: game.height - 20,
            angle: -Math.PI / 2
          }
        ]
      });
      return entity;

    },

    // Makes a missle, either from the player
    // or from the aliens.  The mouse argument
    // is only required when calliung with fromPlayer
    // This Entity created has (two or three) tags and three components.
    makeMissile(fromPlayer, game, mouse) {

      let a;
      let x;
      let y;
      let dist;
      let speed;
      let color;
      if (fromPlayer) {
        const dx = mouse.x - game.width / 2;
        const dy = mouse.y - game.height;
        dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        a = Math.atan2(dy, dx);
        x = game.width/2,
        y = game.height,
        mouse.down = false;
        speed = 10;
        color = 0xaaffaa;
        color = 0xffffff;
      } else {
        x = Math.random() * game.width;
        y = 0;
        const x2 = Math.random() * game.width;
        const y2 = game.height;
        const dx = x2 - x;
        const dy = y2 - y;
        dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        a = Math.atan2(dy, dx);
        speed = 1 + Math.random() * 10;
        color = 0xffffff;
      }
      const entity = world.createEntity({
        tags: ['New', 'Missile'],
        components: [
          {
            type: 'Sprite',
            frame: 'missile',
            container: game.layers.main,
            scale: 3,
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
      return entity;
    }
  };
}
