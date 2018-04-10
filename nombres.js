var dizaine = {};
var unité = {};

var maxTime = 10; //secondes
var objective=15*5; //secondes épargnées cumulées
	 
var graphicsTimer;
var graphicsProgress;

var score = 0;
var time = 0;
var play = false;

var  nombres = {
 
    preload: function() {
       game.load.spritesheet('chiffres_bg', 'chiffres_bg.png', 160,227,2);  
    },
 
    create: function() {
		game.stage.backgroundColor = "#dedede";

		var style = { font: "192px Arial", fill: "#000000", align: "center" };

		dizaine.pos = {x:150, y:150};
		dizaine.bg = game.add.sprite(dizaine.pos.x,dizaine.pos.y,'chiffres_bg', 0);
		dizaine.bg.anchor.setTo(.5,.5);
		dizaine.num = game.add.text(dizaine.pos.x, dizaine.pos.y, "-", style);
		dizaine.num.anchor.setTo(.5,.5);

		unité.pos = {x:150+160, y:150};
		unité.bg = game.add.sprite(unité.pos.x,unité.pos.y,'chiffres_bg', 1);
		unité.bg.anchor.setTo(.5,.5);
		unité.num = game.add.text(unité.pos.x, unité.pos.y, "-", style);
		unité.num.anchor.setTo(.5,.5);

		validation = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		validation.onDown.add(this.validate, this);

		style = { font: "48px Arial", fill: "#ff0080", align: "center" };
		timer = game.add.text(600, 150, "-", style);
		timer.anchor.setTo(.5,.5);
		
		var g = game.add.graphics(50, 550);
		g.beginFill(0x000000,1);
		g.drawRoundedRect(0,0,700,30,10);
		g.endFill();
    },
 
    update: function() {
		if (play) {
			time = time - (game.time.elapsed / 1000) ;
			timer.setText(parseInt(time));
			if (graphicsTimer) graphicsTimer.destroy();
			graphicsTimer = game.add.graphics(600, 150);
			graphicsTimer.lineStyle(16, 0xff0080);
			graphicsTimer.arc(
				0, 0, 90, 
				game.math.degToRad(-90), 
				game.math.degToRad(time/maxTime*360-90),
				false);
		}
    },
	
	validate: function() {
		if (!play) {
			play = true;
		} 
		dizaine.num.setText(game.rnd.integerInRange(1, 9));
		unité.num.setText(game.rnd.integerInRange(0, 9));
		score += time;
		updateProgress(score);
		time = maxTime;
	},

	updateProgress: function(score) {
		if (score>objective) {
			score = objective;
			play = false;
			graphicsTimer.destroy();
			timer.destroy();
			dizaine.bg.destroy();
			dizaine.num.destroy();
			unité.bg.destroy();
			unité.num.destroy();
		} 
		if (graphicsProgress) graphicsProgress.destroy();
		graphicsProgress = game.add.graphics(50, 550);
		graphicsProgress.beginFill(0x87FF61,1);
		graphicsProgress.drawRoundedRect(3,3,694*(score/objective),24,5);
		graphicsProgress.endFill();
	}
}
