var  nombres = {
	
	dizaine: {pos: {x:150, y:150}},
	unité: {pos: {x:150+160, y:150}},

	maxTime: 10, //secondes
	objective: 25*5, //secondes épargnées cumulées

	graphicsTimer: null,
	timer: null,
	graphicsProgress: null,

	score: 0,
	timeLeft: 0,
	
    preload: function() {
       game.load.spritesheet('chiffres_bg', 'chiffres_bg.png', 160,227,2);  
    },
 
    create: function() {
		game.stage.backgroundColor = "#dedede";

		var style = { font: "192px Arial", fill: "#000000", align: "center" };

		this.dizaine.bg = game.add.sprite(this.dizaine.pos.x,this.dizaine.pos.y,'chiffres_bg', 0);
		this.dizaine.bg.anchor.setTo(.5,.5);
		this.dizaine.num = game.add.text(this.dizaine.pos.x, this.dizaine.pos.y, "-", style);
		this.dizaine.num.anchor.setTo(.5,.5);

		this.unité.bg = game.add.sprite(this.unité.pos.x,this.unité.pos.y,'chiffres_bg', 1);
		this.unité.bg.anchor.setTo(.5,.5);
		this.unité.num = game.add.text(this.unité.pos.x, this.unité.pos.y, "-", style);
		this.unité.num.anchor.setTo(.5,.5);

		validation = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		validation.onDown.add(this.validate, this);

		style = { font: "48px Arial", fill: "#ff0080", align: "center" };
		this.timer = game.add.text(600, 150, "-", style);
		this.timer.anchor.setTo(.5,.5);
		
		var g = game.add.graphics(50, 550);
		g.beginFill(0x000000,1);
		g.drawRoundedRect(0,0,700,30,10);
		g.endFill();
		
		this.validate();
    },
 
    update: function() {
		this.timeLeft = this.timeLeft - (game.time.elapsed / 1000) ;
		this.timer.setText(parseInt(this.timeLeft)+1);
		if (this.timeLeft <= 0) {
			this.reset();
		} else {
			if (this.graphicsTimer) this.graphicsTimer.destroy();
			this.graphicsTimer = game.add.graphics(600, 150);
			this.graphicsTimer.lineStyle(16, 0xff0080);
			this.graphicsTimer.arc(
				0, 0, 90, 
				game.math.degToRad(-90), 
				game.math.degToRad(this.timeLeft/this.maxTime*360-90),
				false);
		}
    },
	
	validate: function() {
		this.score += this.timeLeft;
		this.updateProgress();
		this.reset();
	},
	
	reset: function() {
		this.dizaine.num.setText(game.rnd.integerInRange(1, 9));
		this.unité.num.setText(game.rnd.integerInRange(0, 9));
		this.timeLeft = this.maxTime;
	},

	updateProgress: function() {
		if (this.score>this.objective) {
			this.score = this.objective;
		} 
		if (this.graphicsProgress) this.graphicsProgress.destroy();
		this.graphicsProgress = game.add.graphics(50, 550);
		this.graphicsProgress.beginFill(0x87FF61,1);
		this.graphicsProgress.drawRoundedRect(3,3,694*(this.score/this.objective),24,5);
		this.graphicsProgress.endFill();
	}
}
