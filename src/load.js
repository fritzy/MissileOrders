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


const load = async () => {

  return new Promise((resolve, reject) => {

    loader.add('missile', 'assets/missile.png');
    loader.add('space', 'assets/space2.jpg');
    loader.add('tri', 'assets/triangle.png');
    loader.add('station', 'assets/building.png');

    loader.load((loader, resources) => {

      resolve(loader, resources);
    });
  });
};


module.exports = {
  load,
  loadTexture
};
