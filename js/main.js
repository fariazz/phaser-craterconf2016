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

  },

  //load the game assets before the game starts
  preload: function() {

  },
  //executed after everything is loaded
  create: function() {
  },
  update: function() {
  },

};

//initiate the Phaser framework
var game = new Phaser.Game(360, 592, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
