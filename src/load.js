const Pixi = require('pixi.js');
const loader = Pixi.Loader.shared;

const loadTexture = (name) => {

  const texture = Pixi.utils.TextureCache[name];
  for (let col = 0; col < texture.width / 16; ++col) {
    for (let row = 0; row < texture.height / 16; ++row) {
      const t = new Pixi.Texture(texture);
      t.frame = new Pixi.Rectangle(col * 16, row * 16, 16, 16);
      Pixi.Texture.addToCache(t, `${name}-${col}x${row}`);
    }
  }
};


const load = () => {

  return new Promise((resolve, reject) => {

    loader.add('missile', 'assets/missile.png');
    loader.add('space', 'assets/space2.jpg');
    loader.add('tri', 'assets/triangle.png');
    console.log('loading...');
    /*
    loader.add('assets/floor.json');
    loader.add('pit0', 'assets/pit0.json');
    loader.add('pit1', 'assets/pit1.json');
    loader.add('deco0', 'assets/deco0.json');
    loader.add('deco1', 'assets/deco1.json');
    loader.add('door0', 'assets/door0.json');
    loader.add('door1', 'assets/door1.json');
    loader.add('cdogs', 'assets/cdogs.json');

    const chars = ['player', 'aquatic', 'avian', 'cat', 'dog', 'elemental', 'humanoid', 'misc', 'pest', 'plant', 'quadraped', 'reptile', 'rodent', 'slime', 'undead'];

    for (const char of chars) {
      loader.add(`${char}0`, `assets/${char}0.json`);
      loader.add(`${char}1`, `assets/${char}1.json`);
    }

    loader.add('pencil', 'assets/pencil.png');
    loader.add('eraser', 'assets/eraser.png');
    loader.add('pullrect', 'assets/pullrect.png');
    loader.add('floodfill', 'assets/floodfill.png');
    loader.add('ui', 'assets/GUI/GUI0.png');
    */
    loader.load((loader, resources) => {

      //loadTexture('ui');

      resolve(loader, resources);
    });
  });
};


module.exports = {
  load,
  loadTexture
};
