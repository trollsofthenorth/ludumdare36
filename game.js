
// Convenience function for creatig ranges of numbers for providing list of frame.
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

var fps; //fps counter
var infoText; //Text above buttans
var buttons = [];


// Code that is common between all stages to ensure the canvas window behaves as expected.
function commonInit() {
  this.game.renderer.renderSession.roundPixels = true;
  this.game.world.setBounds(0, 0, 992, 480);

  this.physics.startSystem(Phaser.Physics.ARCADE);
  this.physics.arcade.gravity.y = 200;

  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.setMinMax(
    window.innerWidth/2,
    window.innerHeight/2,
    window.innerWidth,
    window.innerHeight);
  this.game.pageAlignHorizontally = true;
  this.game.pageAlignVertically = false;
}

// The main game object.
var game = new Phaser.Game(320, 320, Phaser.CANVAS, 'startingstate');

// introScreen game state.
var introScreen = function (game) {};
introScreen.prototype = {
  init: function() {
    commonInit();
  },
  preload: function() {
    this.load.image('menuIcon', 'assets/menu-icon.png');
    this.load.image('menuTitle', 'assets/menu-title.png');
  },
  create: function() {
    // Adding title image.
    var title = this.game.add.sprite(0,0,'menuTitle');
    title.anchor.setTo(0.5);
    title.x = game.width/2;
    title.y = game.height/2;

    // Adding only button.
    var button = this.game.add.button(100,100, 'menuIcon', this.toStage1, this);
    button.anchor.setTo(0.5);
    button.x = game.width/2;
    button.y = game.height/2 + 50;

    // Adding text to button.
    var style = { font: "bold 15px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" }
    var text = this.game.add.text(10,10, "Start", style);
    text.anchor.setTo(0.5);
    text.x = button.x;
    text.y = button.y + 10;

  },
  update: function() {},
  render: function() {},
  toStage1: function () {
    game.state.start('Game');
  }
}
game.state.add('introScreen', introScreen);


var Lemmings = function (game) {
    this.background = null;
    this.saved = 0;
    this.target = 10;
    this.collision = null;
    this.emitter = null;
    this.player = null;

    this.actors = null;
};

var showDebug = false;

Lemmings.prototype = {

    init: function () {

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
        this.load.script('Actor', 'Actor.js');

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




        this.actors = this.game.add.physicsGroup();
        this.lemming = new Lemming(this.game, 130, 90, 'lemming', this.actors);


        this.player = this.add.sprite(160,30,'player');
        this.player.data.moving_left = true;
        //this.physics.arcade.enable(this.player);
        //this.player.body.velocity.x=-30;

        this.player.overlap = function(lemmingobject) {
          console.log("ImpactP");
        };

        this.cursors = game.input.keyboard.createCursorKeys();
        hud_init()




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
        //console.log("Falling");
        actor.y+=1;
      }
      var step_height = this.lemmingCollideWithBitmap(actor);
      //console.log(step_height);
      if( step_height > 2 ) {
        //console.log("Reverse");
        actor.x = old_x;
        actor.data.moving_left = ! actor.data.moving_left;
      } else {
        actor.y -= step_height;
        //console.log("Climbing");
      }
    },
    /**
     * Core update loop. Handles collision checks and player input.
     *
     * @method update
     */
    update: function () {

      //this.player.body.velocity.x = 0;
      hud_update()
      //this.actor_position_update(this.lemming);
      //this.actor_position_update(this.player);

    },
    collisionHandler: function(obj1, obj2) {

    //  The two sprites are colliding
      game.stage.backgroundColor = '#992d2d';
    },


    render: function() {
        if(showDebug) {
          this.game.debug.bodyInfo(this.player, 32, 32);
          this.game.debug.body(this.player);
        }
    }

};

var hud_update = function () {
  // Function to update hud on screen.
  infoText.text = (game.time.elapsed || '--');
}

var hud_init = function() {
  var graphics = game.add.graphics(0, 0);
  graphics.lineStyle(0);
  graphics.beginFill(0x000000, 1);
  graphics.drawRect(0, 240, 320, 80);
  graphics.endFill();
  hud_bg = new Phaser.Rectangle(0,240, 320, 80);
  //fps = game.add.text(10, 250, 'fps', {font: '8px Arial', fill: '#FFFFFF' });
  infoText = game.add.text(10, 240, 'infoText', {font: '8px Arial', fill: '#FFFFFF'});
  infoText.fixedToCamera=true;
  //fps.fixedToCamera=true;

  //setup buttons
  buttons.push(game.add.button(10, 280, 'button1', function() {console.log('pressed')}, this));
  buttons.push(game.add.button(40, 280, 'button2', function() {console.log('pressed')}, this));
  buttons.push(game.add.button(70, 280, 'button3', function() {console.log('pressed')}, this));
  buttons.push(game.add.button(100, 280, 'button4', function() {console.log('pressed')}, this));

}

game.state.add('Game', Lemmings, true);
game.state.start('introScreen');
