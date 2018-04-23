var succes = {
	
    preload: function() {
       game.load.image('bravo', 'bravo.png');  
	   
	   	game.load.spritesheet('menu', 'menu.png', 180, 60, 3);
    },
 
    create: function() {
		game.add.sprite(0, 0, 'bravo');
	},
	

}
