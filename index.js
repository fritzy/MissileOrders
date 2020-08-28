const Pixi = require('pixi.js');
const Scene = require('./src/scene');
const Level = require('./src/level');
const Load = require('./src/load');

const defaultOptions = {
  width: 1920,
  height: 1080,
  transparent: false,
  //resolution: window.devicePixelRatio,
  backgroundColor: 0x000000,
};

Pixi.BaseTexture.scaleMode = Pixi.SCALE_MODES.NEAREST;
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST;

class Game {

  constructor(options) {

    this.options = {};
    Object.assign(this.options, defaultOptions, options);
    console.log(this.options.width);
    this.renderer = Pixi.autoDetectRenderer(this.options);
    this.options.container.appendChild(this.renderer.view);
    this.stage = new Pixi.Container();

    Load.load().then(async () => {

      console.log('loaded', this.options.width, this.options.height, this.options.container);
      this.scenes = new Scene.Manager(this, this.stage);
      this.map = new Level(this);
      await this.scenes.addScene('map', this.map);
      this.update(0);
    });
    this.lastTime = 0;
  }

  update(time) {

    const deltaTime = Math.min(time - this.lastTime, 500);
    const deltaFrame = deltaTime / 16.6666667;
    this.lastTime = time;

    this.map.update(deltaTime, deltaFrame, time);
    this.renderer.render(this.stage);
    window.requestAnimationFrame(this.update.bind(this));
  }

}

const game = new Game({
  container: document.getElementById('container')
});
