var  nombres = {
	
	dizaine: {pos: {x:150, y:150}},
	unité: {pos: {x:150+160, y:150}},

	maxTime: 10, //secondes
	objective: 10, //secondes épargnées cumulées

	graphicsTimer: null,
	timer: null,
	graphicsProgress: null,

	score: 0,
	timeLeft: 0,
	
    preload: function() {
		game.load.spritesheet('chiffres_bg', 'chiffres_bg.png', 160,227,2); 

		game.load.image('head', 'photo_Joshua.png');
		game.load.spritesheet('body', 'walk_anim.png', 50, 86, 9);
	   
		game.load.audio('correct', 'correct.mp3');

		this.maxTime = parameters.nombres.vitesse.start;
		this.objective = parameters.nombres.duree.start;
    },
 
	joshua: null,
	body: null,
	walk: null,
 
	nombre: 0,
	correctSound: null,
	counting: true,
 
    create: function() {
		game.stage.backgroundColor = "#dedede";

		correctSound = game.add.audio('correct');
		
		this.body = game.add.sprite(+30, -80, 'body',1);
		var head = game.add.sprite(11, -13, 'head',1);
		this.body.addChild(head)
		this.joshua = game.add.sprite(0,550);
		this.joshua.addChild(this.body);
		this.walk = this.body.animations.add('walk');
		//body.animations.play('walk', 10, true);

		
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
		
		this.score = 0;
		this.timeLeft = 0;
    },
 
    update: function() {
		if (this.counting) {
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
		}
    },
	
	validate: function() {
		correctSound.play();
		this.score += this.timeLeft;
		if (this.score !=0) this.updateProgress();
		if (this.score<this.objective) {
			this.reset();
		}
	},
	
	reset: function() {
		//Log du résultat précédent
		//http://davidpanzo.hd.free.fr:8080/add?login=David&nombre=9&temps=99
		var nbr = parseInt(this.dizaine.num.text)*10+parseInt(this.unité.num.text);
		if (!isNaN(nbr)) {
			$.ajax({
				method: 'GET',
				url: 'http://davidpanzo.hd.free.fr:8080/add',
				datatype: 'json',
				data: {
					login: $('#login').text(),
					nombre:nbr,
					temps: this.maxTime-this.timeLeft
				},
				success: function(data) {
					console.log(data);
				},
				error: function(xh, sts, err) {
					console.log(sts+":"+err);
				}
			});
		}
		this.nombre = game.rnd.integerInRange(10, 99);
		this.dizaine.num.setText(parseInt(this.nombre/10));
		this.unité.num.setText(this.nombre%10);
		this.timeLeft = this.maxTime;
	},

	updateProgress: function() {
		if (this.score>this.objective) {
			this.score = this.objective;
		}
		var xProgress = 694*(this.score/this.objective);
		if (this.graphicsProgress) this.graphicsProgress.destroy();
		this.graphicsProgress = game.add.graphics(50, 550);
		this.graphicsProgress.beginFill(0x87FF61,1);
		this.graphicsProgress.drawRoundedRect(3,3,xProgress,24,5);
		this.graphicsProgress.endFill();
		//avance Joshua
		tween = game.add.tween(this.joshua).to( { x: xProgress }, (this.timeLeft/this.maxTime)*1000, Phaser.Easing.Linear.None);
		this.body.animations.play('walk', 30, true);
		tween.onComplete.add(function() {
			this.body.animations.stop(null, true);
			if (this.score==this.objective) {
				this.game.state.start('succes');
			} 
		}, this);
		tween.start();

	}
}
