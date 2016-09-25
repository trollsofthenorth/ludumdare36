
/* State machine for a walking/falling/digging actor. */

(function () {
	'use strict';
  var ActorState = {
    walker : "walker"
    shrugger : "shrugger"
    exiter : "exiter"
    faller : "faller"
    parachuter : "parachuter"
    blocker : "blocker"
    climber : "climber"
    climber-over : "climber-over"
    builder : "builder"
    basher : "basher"
    digger : "digger"
    miner : "miner"
    dyer : "dyer"
    drowner : "drowner"
    exploder : "exploder"
  }


  Lemming = function (game, x, y) {
      x = startx || 0;
      y = starty || 0;
      key = key || null;
      frame = frame || null;

      Phaser.Sprite.call(this, game, x, y);

      state = ActorState.faller;
      /**
      * @property {number} type - The const type of this object.
      * @readonly
      */

      /**
      * @property {number} physicsType - The const physics body type of this object.
      * @readonly
      */
      PIXI.Sprite.call(this, Phaser.Cache.DEFAULT);

      Phaser.Component.Core.init.call(this, game, x, y, key, frame);

  };
  Phaser.Lemming.prototype = Object.create(Phaser.Sprite.prototype);
  Phaser.Lemming.prototype.constructor = Lemming;
}();
