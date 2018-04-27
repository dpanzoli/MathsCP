var  additions2 = {
	
	dizaines: {chiffreA:0, chiffreB:0, resultat:0, retenue:0},
	unités: {chiffreA:0, chiffreB:0, resultat:0},

	maxTime: 10, //secondes
	objective: 10, //secondes épargnées cumulées
	sommeMax: 50, //Somme maximum des nombres A et B (= difficulté)

	graphicsTimer: null,
	timer: null,
	graphicsProgress: null,

	score: 0,
	timeLeft: 0,
	
    preload: function() {

		game.load.image('head', 'photo_Joshua.png');
		game.load.spritesheet('body', 'walk_anim.png', 50, 86, 9);

		game.load.audio('correct', 'correct.mp3');
		game.load.audio('error', 'error.mp3');

		game.load.spritesheet('fleches', 'flèches.png', 53, 26, 6);

		game.load.spritesheet('valider', 'valider.png', 125,125, 2);
		
		this.maxTime = parameters.additions2.vitesse.start;
		this.objective = parameters.additions2.duree.start;
		this.sommeMax = parameters.additions2.difficulte.start;
    },
 
	joshua: null,
	body: null,
	walk: null,
 
	correctSound: null,
	errorSound: null,
	counting: true,
 
    create: function() {
	
		game.stage.backgroundColor = "#dedede";

		this.correctSound = game.add.audio('correct');
		//errorSound = game.add.audio('error');
		
		this.body = game.add.sprite(+30, -80, 'body',1);
		var head = game.add.sprite(11, -13, 'head',1);
		this.body.addChild(head)
		this.joshua = game.add.sprite(0,550);
		this.joshua.addChild(this.body);
		this.walk = this.body.animations.add('walk');
		//body.animations.play('walk', 10, true);
		
		var style = { font: "96px Arial", fill: "#000000", align: "center" };
		var styleR = { font: "48px Arial", fill: "#000000", align: "center" };

		this.dizaines.textA = game.add.text(150, 50, this.dizaines.chiffreA, style);
		this.dizaines.textA.anchor.setTo(0.5,0);
		this.dizaines.textB = game.add.text(150, 160, this.dizaines.chiffreB, style);
		this.dizaines.textB.anchor.setTo(0.5,0);
		this.dizaines.textRes = game.add.text(150, 310, this.dizaines.resultat, style);
		this.dizaines.textRes.anchor.setTo(0.5,0);
		this.dizaines.textRetenue = game.add.text(150, 70, this.dizaines.retenue, styleR);
		this.dizaines.textRetenue.anchor.setTo(0.5,1);
		this.dizaines.plus = game.add.button(150,290, 'fleches', function() {
			if (this.dizaines.resultat < 19) {
				this.dizaines.resultat += 1;
				this.dizaines.textRes.setText(this.dizaines.resultat);
			}
		}, this, 1,0,2,1);
		this.dizaines.plus.anchor.setTo(0.5,0);
		this.dizaines.moins = game.add.button(150,410, 'fleches', function() {
			if (this.dizaines.resultat > 0) {
				this.dizaines.resultat -= 1;
				this.dizaines.textRes.setText(this.dizaines.resultat);
			}
		}, this, 4,3,5,4);
		this.dizaines.moins.anchor.setTo(0.5,0);
		
		
		this.unités.textA = game.add.text(230, 50, this.unités.chiffreA, style);
		this.unités.textA.anchor.setTo(0.5,0);
		this.unités.textB = game.add.text(230, 160, this.unités.chiffreB, style);
		this.unités.textB.anchor.setTo(0.5,0);
		this.unités.textRes = game.add.text(230, 310, this.unités.resultat, style);
		this.unités.textRes.anchor.setTo(0.5,0);
		this.unités.plus = game.add.button(230,290, 'fleches', function() {
			if (this.unités.resultat == 9 && this.dizaines.retenue == 1) {
			 //rien
			} else {
				this.unités.resultat += 1;
				if (this.unités.resultat==10) {
					this.unités.resultat = 0;
					this.dizaines.retenue += 1;
					if (this.dizaines.retenue != 0) {
						this.dizaines.textRetenue.setText(this.dizaines.retenue);
					} else {
						this.dizaines.textRetenue.setText("");
					}
				}
				this.unités.textRes.setText(this.unités.resultat);
			}
		}, this, 1,0,2,1);
		this.unités.plus.anchor.setTo(0.5,0);
		this.unités.moins = game.add.button(230,410, 'fleches', function() {
			if (this.unités.resultat ==0 && this.dizaines.retenue==0) {
				//rien
			} else {
				this.unités.resultat -= 1;
				if (this.unités.resultat==-1) {
					this.unités.resultat = 9;
					if (this.dizaines.retenue > 0) this.dizaines.retenue -= 1;
					if (this.dizaines.retenue != 0) {
						this.dizaines.textRetenue.setText(this.dizaines.retenue);
					} else {
						this.dizaines.textRetenue.setText("");
					}
				}
				this.unités.textRes.setText(this.unités.resultat);
			}
		}, this, 4,3,5,4);
		this.unités.moins.anchor.setTo(0.5,0);

		var valider = game.add.button(300,300, 'valider', this.validate, this, 0, 0, 1, 0);
	
		
		var barre = game.add.graphics(150, 170);
		barre.beginFill(0x000000,1);
		barre.drawRect(-100,100,200,10,10);
		barre.endFill();
		
		var plus = game.add.text(100, 220, "+", style);
		plus.anchor.setTo(1,.5);

/*		validation = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		validation.onDown.add(this.validate, this);
*/
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
				//premier passage -> pas de son !
				if (this.errorSound != undefined)
					this.errorSound.play();
				this.errorSound = game.add.audio('error');
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
	
		var addition = 
				this.dizaines.chiffreA*10+this.unités.chiffreA 
			+	this.dizaines.chiffreB*10+this.unités.chiffreB 	
		
		var proposition = 
				this.dizaines.resultat*10+this.unités.resultat;
				
		if (addition == proposition) {
			this.correctSound.play();
			this.score += this.timeLeft;
			if (this.score !=0) this.updateProgress();
		} else {
			this.errorSound.play();
		}
		if (this.score<this.objective) {
			this.reset();
		}
	},
	
	reset: function() {
		//Log du résultat précédent
/*		var nbr = parseInt(this.dizaine.num.text)*10+parseInt(this.unité.num.text);
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
*/
		console.log(this.sommeMax);
		do {
			this.dizaines.chiffreA = game.rnd.integerInRange(1, 9);
			this.dizaines.chiffreB = game.rnd.integerInRange(1, 9);
			this.unités.chiffreA = game.rnd.integerInRange(0, 9);
			this.unités.chiffreB = game.rnd.integerInRange(1, 9);
			var addition = 
				this.dizaines.chiffreA*10+this.unités.chiffreA 
			+	this.dizaines.chiffreB*10+this.unités.chiffreB 
		
		} while (addition > this.sommeMax);
		this.dizaines.textA.setText(this.dizaines.chiffreA);
		this.dizaines.textB.setText(this.dizaines.chiffreB);
		this.unités.textA.setText(this.unités.chiffreA);
		this.unités.textB.setText(this.unités.chiffreB);
		this.unités.resultat = 0;
		this.unités.textRes.setText(this.unités.resultat);
		this.dizaines.resultat = 0;
		this.dizaines.textRes.setText(this.dizaines.resultat);
		this.dizaines.retenue = 0;
		this.dizaines.textRetenue.setText("");
		
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
