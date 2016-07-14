/*
Craterconf deals

1) THE COMPLETE MOBILE GAME DEVELOPMENT COURSE - PLATINUM EDITION (15 GAMES)
30 hours of JavaScript game development with Phaser and Cordova.
https://academy.zenva.com/product/the-complete-mobile-game-development-course-platinum-edition/?zva_src=craterconf2016

Get $10 off using the coupon code: craterconf2016-plati
(must use before Monday)

2) PRE-ORDER ADVANCED GAME DEVELOPMENT WITH PHASER
Includes multi-player games, Firebase integration, path finding and more cool topics
https://academy.zenva.com/product/advanced-game-development-with-phaser/?zva_src=craterconf2016-adv

Get $5 off using the coupon code: craterconf2016-adv
(must use before Monday)

3) Other active promotions running until Sunday:
https://academy.zenva.com/product-category/english/?zva_sale_filter=1&zva_src=craterconf2016-adv

*/

//this game will have only 1 state
var GameState = {

  //initiate game settings
  init: function() {
    //adapt to screen size, fit all the game
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //game alignment
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //start physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000

    //activate keyboard
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.game.world.setBounds(0,0,360,700);

    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 550;
  },

  //load the game assets before the game starts
  preload: function() {
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('goal', 'assets/images/gorilla3.png');
    this.load.image('arrowButton', 'assets/images/arrowButton.png');
    this.load.image('actionButton', 'assets/images/actionButton.png');
    this.load.image('barrel', 'assets/images/barrel.png');

    this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 28, 30, 5, 1, 1);
    this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', 20, 21, 2, 1, 1);

    this.load.text('level', 'assets/data/level.json');
  },
  //executed after everything is loaded
  create: function() {

    this.ground = this.add.sprite(0, 638, 'ground');
    this.game.physics.arcade.enable(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    //parse the file
    this.levelData = JSON.parse(this.game.cache.getText('level'));

    this.platforms = this.add.group();
    this.platforms.enableBody = true;

    this.levelData.platformData.forEach(function(element){
      this.platforms.create(element.x, element.y, 'platform');
    }, this);

    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);

    //fires
    this.fires = this.add.group();
    this.fires.enableBody = true;

    var fire;
    this.levelData.fireData.forEach(function(element){
      fire = this.fires.create(element.x, element.y, 'fire');
      fire.animations.add('fire', [0, 1], 4, true);
      fire.play('fire');
    }, this);

    this.fires.setAll('body.allowGravity', false);

    //goal
    this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
    this.game.physics.arcade.enable(this.goal);
    this.goal.body.allowGravity = false;

    //create player
    this.player = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'player', 3);
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    this.game.camera.follow(this.player);

    this.barrels = this.add.group();
    this.barrels.enableBody = true;

    this.createBarrel();
    this.barrelCreator = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.barrelFrequency, this.createBarrel, this)
  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.ground);
    this.game.physics.arcade.collide(this.player, this.platforms);

    this.game.physics.arcade.collide(this.barrels, this.ground);
    this.game.physics.arcade.collide(this.barrels, this.platforms);

    this.game.physics.arcade.overlap(this.player, this.fires, this.killPlayer);
    this.game.physics.arcade.overlap(this.player, this.barrels, this.killPlayer);
    this.game.physics.arcade.overlap(this.player, this.goal, this.win);

    this.player.body.velocity.x = 0;

    if(this.cursors.left.isDown) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(1, 1);
      this.player.play('walking');
    }
    else if(this.cursors.right.isDown) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(-1, 1);
      this.player.play('walking');
    }
    else {
      this.player.animations.stop();
      this.player.frame = 3;

    }

    if(this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      this.player.customParams.mustJump = false;
    }

    this.barrels.forEach(function(element){
      if(element.x < 10 && element.y > 600) {
        element.kill();
      }
    }, this);

  },
  killPlayer: function(player, fire) {
    console.log('auch!');
    game.state.start('GameState');
  },
  win: function(player, goal) {
    alert('you win!');
    game.state.start('GameState');
  },
  createBarrel: function() {
    //give me the first dead sprite
    var barrel = this.barrels.getFirstExists(false);

    if(!barrel) {
      barrel = this.barrels.create(0, 0, 'barrel');
    }

    barrel.body.collideWorldBounds = true;
    barrel.body.bounce.set(1, 0);

    barrel.reset(this.levelData.goal.x, this.levelData.goal.y);
    barrel.body.velocity.x = this.levelData.barrelSpeed;
  }

};

//initiate the Phaser framework
var game = new Phaser.Game(360, 592, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
