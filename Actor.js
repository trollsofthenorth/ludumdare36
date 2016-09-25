
/* State machine for a walking/falling/digging actor. */


/* OMG WAT ALAN */

CloudPlatform = function (game, x, y, key, group) {
    if (typeof group === 'undefined') { group = game.world; }
    Phaser.Sprite.call(this, game, x, y, key);
    game.physics.arcade.enable(this);
    this.anchor.x = 0.5;
    this.body.customSeparateX = true;
    this.body.customSeparateY = true;
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.playerLocked = false;
    group.add(this);
};
CloudPlatform.prototype = Object.create(Phaser.Sprite.prototype);
CloudPlatform.prototype.constructor = CloudPlatform;


var ActorState = {
  walker : "walker",
  shrugger : "shrugger",
  exiter : "exiter",
  faller : "faller",
  parachuter : "parachuter",
  blocker : "blocker",
  climber : "climber",
  climberover : "climberover",
  builder : "builder",
  basher : "basher",
  digger : "digger",
  miner : "miner",
  dyer : "dyer",
  drowner : "drowner",
  exploder : "exploder"
}


Lemming = function (game, x, y, key, group) {
    x = x || 0;
    y = y || 0;
    key = key || null;
    frame = null;
    if (typeof group === 'undefined') { group = game.world; }

    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.state = ActorState.faller;
    game.physics.arcade.enable(this);
    this.anchor.x = 0.5;
    this.body.customSeparateX = true;
    this.body.customSeparateY = true;
    this.body.allowGravity = true;
    group.add(this);
};
Lemming.prototype = Object.create(Phaser.Sprite.prototype);
Lemming.prototype.constructor = Lemming;

/* END OMG WAT ALAN */
