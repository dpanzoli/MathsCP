var succes = {
	
    preload: function() {
       game.load.image('bravo', 'bravo.png');  
	   
	   	game.load.spritesheet('menu', 'menu.png', 180, 60, 3);
    },
 
    create: function() {
		game.add.sprite(0, 0, 'bravo');
		
		var menu = game.add.button(game.world.centerX,game.world.height-50, 'menu', this.quitGame, this, 0, 1, 2);
		menu.anchor.setTo(0.5,1);
	},
	
	quitGame: function() {
		game.state.start('menu');
	}
}
