const ApeECS = require('ape-ecs');
const Pixi = require('pixi.js');

// This is the SpriteSystem.  This manages adding and removing
// sprites from the canvas.  This class has two saved queries.

class SpriteSystem extends ApeECS.System {

  init() {

    // When sprites are added to the World
    // we add them with the 'New' tag (see fixtures.js)
    // This query allows us to get just the new sprites
    // We also use .persist() for performance
    this.spriteQuery = this.createQuery()
      .fromAll('Sprite', 'New')
      .persist();

    // Every tick we need to update the positions of Sprites
    // this query ccomplishes that.  We use .persist() for performance
    this.posQuery = this.createQuery()
      .fromAll('Sprite', 'Position')
      .persist();

    // This is a reference to the game component on the
    // entity with id 'gentity' (used as a global entity)
    this.game = this.world.getEntity('gentity').c.game;
  }

  update(tick) {

    // Loop through all New sprites
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
      // Remove the New tag, this will prevent the Entity from
      // showing up in the sentities results on the next tick
      entity.removeTag('New');
    }

    // Loop through all sprite pisitions
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
