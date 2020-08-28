function makeStation(x, game) {

  const entity = this.createEntity({
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

};

function makeMissile(fromPlayer, game, mouse) {

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
    speed = 2;
    color = 0xffffff;
  }
  const entity = this.createEntity({
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
};

module.exports = {
  makeMissile,
  makeStation
}
