
function range(start, end) {
  var myArray = [];
  if (start < end) {
    for (var i = start; i <= end; i += 1) {
      myArray.push(i);
    }
  } else if (start > end){
    for (var i = start; i >= end; i -= 1) {
      myArray.push(i);
    }
  }
  return myArray;

}


var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'startingstate');

var Lemmings = function (game) {
    this.background = null;
    this.saved = 0;
    this.target = 10;
    this.collision = null;
    this.emitter = null;
    this.player = null;
};

var showDebug = true;

Lemmings.prototype = {

    init: function () {

        this.game.renderer.renderSession.roundPixels = true;

        this.game.world.setBounds(0, 0, 992, 480);

        this.physics.startSystem(Phaser.Physics.ARCADE);
        //this.physics.arcade.gravity.y = 200;

    },

    preload: function () {

        //  We need this because the assets are on Amazon S3
        //  Remove the next 2 lines if running locally
        //this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue002/';
        this.load.crossOrigin = 'anonymous';

        //this.load.image('background', 'assets/background.png');
        this.load.image('wall-test', 'assets/level-wall-test-bitmap.png');
        this.load.image('player', 'assets/phaser-dude.png');

        // Adding the spritesheet for a lemming.
        this.load.spritesheet('lemming', 'assets/spritesheet-lemming.png', 20, 20);

    },

    create: function () {
        /*
        player = game.add.sprite(100, 200, 'player');

        this.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        cursors = game.input.keyboard.createCursorKeys();

        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        */

        //  Simple but pretty background
        this.background = this.add.sprite(0, 0, 'background');
        this.collision = this.add.bitmapData( this.game.world.width, this.game.world.height );
        this.collision.draw("wall-test");
        this.collision.update();
        this.collision.addToWorld();

        this.lemming = this.add.sprite(10,10,'lemming');
        this.lemming.alpha=0.5; // This makes the background transparent for the sprite.
        this.lemming.animations.add('walker',range(0,7), 10, true);
        this.lemming.animations.add('shrugger',range(8,15), 10, true);
        this.lemming.animations.add('exiter',range(16,24), 10, true);
        //this.lemming.animations.add('black1',range(25,31), 10, true);
        this.lemming.animations.add('faller',range(32,35), 10, true);
        this.lemming.animations.add('parachuter',range(36,43), 10, true);
        //this.lemming.animations.add('black2',range(44,47), 10, true);
        this.lemming.animations.add('blocker',range(48,63), 10, true);
        this.lemming.animations.add('climber',range(64,71), 10, true);
        this.lemming.animations.add('climber-over',range(72,79), 10, true);
        this.lemming.animations.add('builder',range(80,95), 10, true);
        this.lemming.animations.add('basher',range(96,127), 10, true);
        this.lemming.animations.add('digger',range(128,135), 10, true);
        this.lemming.animations.add('miner',range(136,159), 10, true);
        this.lemming.animations.add('dyer',range(160,191), 10, true);
        this.lemming.animations.add('drowner',range(192,207), 10, true);
        this.lemming.animations.add('exploder',range(208,223), 10, true);
        this.lemming.play('walker');

        this.player = this.add.sprite(160,330,'player');
        this.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 0;
        this.player.body.facing = 1;

        this.cursors = game.input.keyboard.createCursorKeys();


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

    lemmingCollideWithBitmap: function() {
      return false;
    },

    /**
     * Core update loop. Handles collision checks and player input.
     *
     * @method update
     */
    update: function () {
      this.player.body.velocity.x=-30;
      //this.player.body.velocity.x = 0;

      if (this.cursors.left.isDown)
      {
          this.player.body.velocity.x = -250;
      }
      else if (this.cursors.right.isDown)
      {
          this.player.body.velocity.x = 250;
      }

      if( this.lemmingCollideWithBitmap(this.player) ) {
        this.player.body.facing = 2;
      }


    },


    render: function() {
        if(showDebug) {
          this.game.debug.spriteInfo(this.player, 32, 520);
          this.game.debug.body(this.player);
        }
    }

};

game.state.add('Game', Lemmings, true);
