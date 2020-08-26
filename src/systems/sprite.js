const ApeECS = require('ape-ecs');
const Pixi = require('pixi.js');

class SpriteSystem extends ApeECS.System {

  init() {

    this.spriteQuery = this.createQuery()
      .fromAll('Sprite', 'New')
      .persist();
    this.posQuery = this.createQuery()
      .fromAll('Sprite', 'Position')
      .persist();
    this.game = this.world.getEntity('gentity').c.game;
  }

  update(tick) {

    const sentities = this.spriteQuery.execute();
    for (const entity of sentities) {
      for (const sprite of entity.getComponents('Sprite')) {

        sprite.sprite = Pixi.Sprite.from(sprite.frame);
        sprite.sprite.anchor.set(.5);
        sprite.sprite.scale.set(sprite.scale);
        sprite.sprite.tint = sprite.color;
        if (!sprite.container) {
          sprite.container = this.game.layers[sprite.layer];
        }
        if (sprite.container)
          sprite.container.addChild(sprite.sprite);
      }
      entity.removeTag('New');
    }

    const pentities = this.posQuery.execute();
    for (const entity of pentities) {
      for (const pos of entity.getComponents('Position')) {
        for (const sprite of entity.getComponents('Sprite')) {
          sprite.sprite.position.set(pos.x, pos.y);
          sprite.sprite.rotation = pos.angle + Math.PI / 2;
        }
      }
    }
  }
}

module.exports = SpriteSystem;
