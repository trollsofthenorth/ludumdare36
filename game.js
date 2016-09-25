
function range(start, end) {
  var i;
  var myArray = [];
  if (start < end) {
    for (i = start; i <= end; i += 1) {
      myArray.push(i);
    }
  } else if (start > end){
    for (i = start; i >= end; i -= 1) {
      myArray.push(i);
    }
  }
  return myArray;

}

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
Lemming.prototype = Object.create(Phaser.Sprite.prototype);
Lemming.prototype.constructor = Lemming;
/* END OMG WAT ALAN */




var game = new Phaser.Game(320, 240, Phaser.CANVAS, 'startingstate');

var Lemmings = function (game) {
    this.background = null;
    this.saved = 0;
    this.target = 10;
    this.collision = null;
    this.emitter = null;
    this.player = null;

    this.clouds = null;
};

var showDebug = true;

Lemmings.prototype = {

    init: function () {

        this.game.renderer.renderSession.roundPixels = true;

        this.game.world.setBounds(0, 0, 992, 480);

        this.physics.startSystem(Phaser.Physics.ARCADE);
        //this.physics.arcade.gravity.y = 200;

        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.setMinMax(
          window.innerWidth/2,
          window.innerHeight/2,
          window.innerWidth,
          window.innerHeight);
        this.game.pageAlignHorizontally = true;
        this.game.pageAlignVertically = false;

    },

    preload: function () {

        //  We need this because the assets are on Amazon S3
        //  Remove the next 2 lines if running locally
        //this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue002/';
        this.load.crossOrigin = 'anonymous';

        //this.load.image('background', 'assets/background.png');
        this.load.image('wall-test', 'assets/level-concave-test-bitmap.png');
        this.load.image('player', 'assets/phaser-dude.png');

        // Adding the spritesheet for a lemming.
        this.load.spritesheet('lemming', 'assets/spritesheet-lemming.png', 20, 20);

    },

    create: function () {

        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Simple but pretty background
        this.background = this.add.sprite(0, 0, 'background');
        this.collision = this.add.bitmapData( this.game.world.width, this.game.world.height );

        this.collision.draw("wall-test");
        this.collision.update();
        this.collision.addToWorld();


        this.lemmings = this.game.add.group();


        this.lemming = this.add.sprite(130,90,'lemming');

        this.lemming.alpha=1; // This makes the background transparent for the sprite.
        this.lemming.animations.add('walker',range(0,7), 10, true);
        this.lemming.animations.add('shrugger',range(8,15), 10, true);
        this.lemming.animations.add('exiter',range(16,24), 10, true);
        //this.lemming.animations.add('black1',range(25,31), 10, true);
        this.lemming.animations.add('faller',range(32,35), 10, true);
        this.lemming.animations.add('parachuter',range(36,43), 10, true);
        //this.lemming.animations.add('black2',range(44,47), 10, true);
        this.lemming.animations.add('blocker',range(48,63), 10, true);
        this.lemming.animations.add('climber',range(64,71), 10, true);
        this.lemming.animations.add('climberover',range(72,79), 10, true);
        this.lemming.animations.add('builder',range(80,95), 10, true);
        this.lemming.animations.add('basher',range(96,127), 10, true);
        this.lemming.animations.add('digger',range(128,135), 10, true);
        this.lemming.animations.add('miner',range(136,159), 10, true);
        this.lemming.animations.add('dyer',range(160,191), 10, true);
        this.lemming.animations.add('drowner',range(192,207), 10, true);
        this.lemming.animations.add('exploder',range(208,223), 10, true);

        this.lemming.data.moving_left = true;

        this.lemming.play('walker');
        this.lemming.smoothed=false; // Ensures that we don't blur when scaling.

        console.log(this.lemming.height);

        this.player = this.add.sprite(160,300,'player');
        this.player.data.moving_left = true;
        //this.physics.arcade.enable(this.player);
        //this.player.body.velocity.x=-30;

        this.player.overlap = function(lemmingobject) {
          console.log("ImpactP");
        };

        this.cursors = game.input.keyboard.createCursorKeys();


        this.clouds = this.game.add.physicsGroup();
        var cloud1 = new CloudPlatform(this.game, 300, 450, 'player', this.clouds);
        var cloud2 = new CloudPlatform(this.game, 800, 96, 'player', this.clouds);
        this.clouds.callAll('start');
    },

    /**
     * Called by update if the bullet is in flight.
     *
     * @method bulletVsLand
     */
    bulletVsLand: function () {

        //  Simple bounds check
        if (this.bullet.x < 0 || this.bullet.x > this.game.world.width || this.bullet.y > this.game.height)
        {
            this.removeBullet();
            return;
        }

        var x = Math.floor(this.bullet.x);
        var y = Math.floor(this.bullet.y);
        var rgba = this.land.getPixel(x, y);

        if (rgba.a > 0)
        {
            this.land.blendDestinationOut();
            this.land.circle(x, y, 16, 'rgba(0, 0, 0, 255');
            this.land.blendReset();
            this.land.update();

            //  If you like you could combine the above 4 lines:
            // this.land.blendDestinationOut().circle(x, y, 16, 'rgba(0, 0, 0, 255').blendReset().update();

            console.log("this.removeBullet();");

        }

    },

    lemmingCollideWithFloor: function(b) {
      var w = b.width/2;

      bottom_fall_pixel = this.collision.getPixel(b.left+w, b.top+b.height);

      return(bottom_fall_pixel.r>0);
    },
    lemmingCollideWithBitmap: function(b) {
      // consider implementing this as a subclass
      // with Phaser.TILEMAPLAYER and collideSpriteVsTilemapLayer
      var w = b.width/2;
      for(var check_y=b.top; check_y<b.top+b.height; check_y++) {
        var v = this.collision.getPixel(b.left+w, check_y);
        if(v.r===0) {
          return b.height-(check_y-b.top);
        }
      }

      return false;
    },

    actor_position_update: function(actor) {
      var old_x = actor.x;

      if (this.cursors.left.isDown)
      {
          actor.x-=1;
      }
      else if (this.cursors.right.isDown)
      {
          actor.x+=1;
      }

      if(this.lemmingCollideWithFloor(actor)) {
        console.log("Falling");
        actor.y+=1;
      }
      var step_height = this.lemmingCollideWithBitmap(actor);
      console.log(step_height);
      if( step_height > 2 ) {
        console.log("Reverse");
        actor.x = old_x;
        actor.data.moving_left = ! actor.data.moving_left;
      } else {
        actor.y -= step_height;
        console.log("Climbing");
      }
    },
    /**
     * Core update loop. Handles collision checks and player input.
     *
     * @method update
     */
    update: function () {

      //this.player.body.velocity.x = 0;

      //this.actor_position_update(this.lemming);
      //this.actor_position_update(this.player);

    },
    collisionHandler: function(obj1, obj2) {

    //  The two sprites are colliding
      game.stage.backgroundColor = '#992d2d';
    },


    render: function() {
        if(showDebug) {
          this.game.debug.spriteInfo(this.cloud2, 0,10);
          this.game.debug.body(this.cloud2);
          this.game.debug.spriteInfo(this.player, 32, 520);
          this.game.debug.bodyInfo(this.player, 32, 32);
          this.game.debug.body(this.player);
        }
    }

};

game.state.add('Game', Lemmings, true);
