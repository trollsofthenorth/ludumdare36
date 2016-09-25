
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
var bad;

// Code that is common between all stages to ensure the canvas window behaves as expected.
function commonInit() {
  this.game.renderer.renderSession.roundPixels = true;
  //this.game.world.setBounds(0, 0, 992, 480);

  //this.physics.startSystem(Phaser.Physics.ARCADE);
  //this.physics.arcade.gravity.y = 200;

  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.setMinMax(
    320,
    320,
    640,
    640);
  this.game.pageAlignHorizontally = true;
  this.game.pageAlignVertically = true;
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
    this.load.audio('musicBackground', 'assets/music-background.mp3');
  },
  create: function() {
    // Adding title image.
    var title = this.game.add.sprite(0,0,'menuTitle');
    title.anchor.setTo(0.5);
    title.x = game.width/2;
    title.y = game.height/2;

    // Adding music to title.
    var music = this.game.add.audio('musicBackground');
    music.play('', 0, 1, true);
    this.game.sound.volume = 0; // Setting the default volume for the game 0 during testing.

    // Adding start button.
    var startButton = this.game.add.button(100,100, 'menuIcon', this.toStage1, this);
    startButton.anchor.setTo(0.5);
    startButton.x = game.width/2 - 50;
    startButton.y = game.height/2 + 50;
    startButton['data']['color'] = '#fff';
    startButton['data']['label'] = 'Start';
    startButton['data']['style'] = { font: "bold 12px Arial", fill: startButton['data']['color'] = '#fff', boundsAlignH: "center", boundsAlignV: "middle" }
    startButton['data']['value'] = this.game.add.text(10,10, startButton['data']['label'], startButton['data']['style']);
    startButton['data']['value'].anchor.setTo(0.5);
    startButton['data']['value'].x = startButton.x;
    startButton['data']['value'].y = startButton.y + 10;

    // Adding music button.
    var musicButton = this.game.add.button(100,100, 'menuIcon', this.toggleMusic, this);
    musicButton.anchor.setTo(0.5);
    musicButton.x = game.width/2 + 50;
    musicButton.y = game.height/2 + 50;
    musicButton['data']['color'] = '#fff';
    musicButton['data']['label'] = 'Music On';
    musicButton['data']['style'] = { font: "bold 8px Arial", fill: musicButton['data']['color'], boundsAlignH: "center", boundsAlignV: "middle" };
    musicButton['data']['value'] = this.game.add.text(10,10, musicButton['data']['label'], musicButton['data']['style']);
    musicButton['data']['value'].anchor.setTo(0.5);
    musicButton['data']['value'].x = musicButton.x;
    musicButton['data']['value'].y = musicButton.y + 10;

  },
  update: function() {},
  render: function() {},
  toStage1: function () {
    game.state.start('Game');
  },
  toggleMusic: function(button) {
    if (this.game.sound.volume == 0) {
      this.game.sound.volume = 1;
      button['data']['value'].text = "Music\nOn";
    } else {
      this.game.sound.volume = 0;
      button['data']['value'].text = "Music\nOff";
    }
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
};

var showDebug = true;

Lemmings.prototype = {

    init: function () {



    },

    preload: function () {

        //  We need this because the assets are on Amazon S3
        //  Remove the next 2 lines if running locally
        //this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue002/';
        this.load.crossOrigin = 'anonymous';

        this.load.image('background', 'assets/level-background.png');
        this.load.image('concaveImage', 'assets/level-concave-test.png');

        this.load.image('wall-test', 'assets/level-concave-test-bitmap.png');
        this.load.image('player', 'assets/phaser-dude.png');

        // Adding the spritesheet for a lemming.
        this.load.spritesheet('lemming', 'assets/spritesheet-lemming.png', 20, 20);

    },

    create: function () {
        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // Simple but pretty background
        this.background = this.add.sprite(0, 0, 'background');

        // Load the image of the ground (with transparent backgroud) and use it as a bitmap.
        this.collision = this.add.bitmapData( this.game.world.width, this.game.world.height );
        this.collision.draw("concaveImage");
        this.collision.update();
        this.collision.addToWorld();

        // Add the lemming sprite and add all animations.
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
        this.lemming.animations.add('climber-over',range(72,79), 10, true);
        this.lemming.animations.add('builder',range(80,95), 10, true);
        this.lemming.animations.add('basher',range(96,127), 10, true);
        this.lemming.animations.add('digger',range(128,135), 10, true);
        this.lemming.animations.add('miner',range(136,159), 10, true);
        this.lemming.animations.add('dyer',range(160,191), 10, true);
        this.lemming.animations.add('drowner',range(192,207), 10, true);
        this.lemming.animations.add('exploder',range(208,223), 10, true);
        this.lemming.play('walker');
        this.lemming.smoothed=false; // Ensures that we don't blur when scaling.

        this.lemming.inputEnabled = true;
        this.lemming.events.onInputDown.add(lemming_click_handler, this)

        console.log(this.lemming.height);
        this.lemming.data.moving_left = true;

        //console.log(this.lemming.height);

        this.player = this.add.sprite(160,300,'player');
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
      this.actor_position_update(this.lemming);
      this.actor_position_update(this.player);

    },
    collisionHandler: function(obj1, obj2) {

    //  The two sprites are colliding
      game.stage.backgroundColor = '#992d2d';
    },


    render: function() {
        if(showDebug) {
          this.game.debug.spriteInfo(this.player, 32, 520);
          this.game.debug.bodyInfo(this.player, 32, 32);
          this.game.debug.body(this.player);
        }
    }

};

var hud_update = function () {
  // Function to update hud on screen.
  infoText.text = (game.time.elapsed || '--');
  bOneSelected = false;
  buttons.forEach(function(button) {
    if (button.data.selected && ! bOneSelected) {
      bOneSelected = true
    } else if (button.data.selected) {
      button.data.selected = false;
      console.log('cleaning up - should not happen');
    }
    button.data.text.text = button.data.value;
  });
  if (! bOneSelected) {
    buttons[0].data.selected = true;
    console.log('nothing seleted - picking first');
  }
}

var hud_init = function() {
  var graphics = game.add.graphics(0, 0);
  graphics.lineStyle(0);
  graphics.beginFill(0x000000, 1);
  graphics.drawRect(0, 240, 320, 80);
  graphics.endFill();
  hud_bg = new Phaser.Rectangle(0,240, 320, 80);
  //fps = game.add.text(10, 250, 'fps', {font: '8px Arial', fill: '#FFFFFF' });
  var txt_Style = {font: '8px Arial', fill: '#FFFFFF'};
  infoText = game.add.text(10, 240, 'infoText', txt_Style);
  infoText.fixedToCamera=true;
  //fps.fixedToCamera=true;

  //setup buttons
  buttons.push(game.add.button(10, 280, 'button1', hud_button_press, this));
  buttons.push(game.add.button(40, 280, 'button2', hud_button_press, this));
  buttons.push(game.add.button(70, 280, 'button3', hud_button_press, this));
  buttons.push(game.add.button(100, 280, 'button4', hud_button_press, this));

  buttons.forEach(function(button) { // setup place to store values and anchor text
    button['data']['value'] = 100;
    button['data']['selected'] = false;
    button['data']['text'] = game.add.text(button.position.x + 15, button.position.y + 30, '00', txt_Style);
    button['data']['text'].anchor.set(0.5);
  });
}

var lemming_click_handler = function(thing) {
  console.log(thing);
  console.log(get_selected_button())
}

var hud_button_press = function(button) {
  buttons.forEach(function(button) {
    button.data.selected = false;
  });
  button.data.selected = true;

  button.data.value = button.data.value - 1;
  console.log(button.data.value);
}

var get_selected_button = function() {
  var output;
  buttons.forEach(function(button) {
  if (button.data.selected) {
      output = button;

    }
  })
  return output;
}

game.state.add('Game', Lemmings, true);
game.state.start('introScreen');
