
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



		this.alpha=1; // This makes the background transparent for the sprite.
		this.animations.add('walker',range(0,7), 10, true);
		this.animations.add('shrugger',range(8,15), 10, true);
		this.animations.add('exiter',range(16,24), 10, true);
		//this.animations.add('black1',range(25,31), 10, true);
		this.animations.add('faller',range(32,35), 10, true);
		this.animations.add('parachuter',range(36,43), 10, true);
		//this.animations.add('black2',range(44,47), 10, true);
		this.animations.add('blocker',range(48,63), 10, true);
		this.animations.add('climber',range(64,71), 10, true);
		this.animations.add('climberover',range(72,79), 10, true);
		this.animations.add('builder',range(80,95), 10, true);
		this.animations.add('basher',range(96,127), 10, true);
		this.animations.add('digger',range(128,135), 10, true);
		this.animations.add('miner',range(136,159), 10, true);
		this.animations.add('dyer',range(160,191), 10, true);
		this.animations.add('drowner',range(192,207), 10, true);
		this.animations.add('exploder',range(208,223), 10, true);

		this.data.moving_left = true;

		this.play('faller');
		this.smoothed=false; // Ensures that we don't blur when scaling.

		console.log(this.height);


    group.add(this);
};
Lemming.prototype = Object.create(Phaser.Sprite.prototype);
Lemming.prototype.constructor = Lemming;


/* END OMG WAT ALAN */
