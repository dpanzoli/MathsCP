var menu = {

	parameters: {
		speed: {
			current: 10,
			min: 1,
			max: 20,
			gui: {text: null, less: null, more: null}
		},
		duration: {
			current: 30,
			min: 10,
			max: 50,
			gui: {text: null, less: null, more: null}
		}
	},

	preload: function() {

		game.load.image('bg', 'bg.png');
		game.load.spritesheet('bouton', 'boutons.png', 32, 32, 8);
		game.load.spritesheet('commencer', 'commencer.png', 180, 60, 3);
	
		//TODO récupération des paramètres depuis localStorage...
		if (localStorage.getItem('speed')!=undefined) {
			this.parameters.speed.current = parseInt(localStorage.getItem('speed'));
		}
		if (localStorage.getItem('duration')!=undefined) {
			this.parameters.duration.current = parseInt(localStorage.getItem('duration'));
		}
	},


	create: function() {

		game.add.sprite(0, 0, 'bg');
	
		var style = { font: "36px Arial", fill: "#000000", align: "center" };

		this.parameters['speed'].gui.action='speed';
		this.parameters['speed'].gui.less = game.add.button(415,60, 'bouton', this.adjustParameter, this, 1, 0, 2);
		this.parameters['speed'].gui.less.action = 'speed';
		this.parameters['speed'].gui.less.increment = -1;
		this.parameters['speed'].gui.less.anchor.setTo(.5,.5);
		this.parameters['speed'].gui.more = game.add.button(495,60, 'bouton', this.adjustParameter, this, 5, 4, 6);
		this.parameters['speed'].gui.more.action = 'speed';
		this.parameters['speed'].gui.more.increment = 1;
		this.parameters['speed'].gui.more.anchor.setTo(.5,.5);
		this.parameters['speed'].gui.text = game.add.text(455,60, this.parameters['speed'].current, style);
		this.parameters['speed'].gui.text.anchor.setTo(.5,.5);

		this.parameters['duration'].gui.action='duration';
		this.parameters['duration'].gui.less = game.add.button(415,125, 'bouton', this.adjustParameter, this, 1, 0, 2);
		this.parameters['duration'].gui.less.action = 'duration';
		this.parameters['duration'].gui.less.increment = -5;
		this.parameters['duration'].gui.less.anchor.setTo(.5,.5);
		this.parameters['duration'].gui.more = game.add.button(495,125, 'bouton', this.adjustParameter, this, 5, 4, 6);
		this.parameters['duration'].gui.more.action = 'duration';
		this.parameters['duration'].gui.more.increment = 5;
		this.parameters['duration'].gui.more.anchor.setTo(.5,.5);
		this.parameters['duration'].gui.text = game.add.text(455,125, this.parameters['duration'].current, style);
		this.parameters['duration'].gui.text.anchor.setTo(.5,.5);

		var commencer = game.add.button(580,65, 'commencer', this.startGame, this, 0, 1, 2);

	},

	adjustParameter: function(e) {
		if (e.increment>0) {
			this.parameters[e.action].current=Math.min(this.parameters[e.action].current+e.increment, this.parameters[e.action].max);
		} else if (e.increment<0) {
			this.parameters[e.action].current=Math.max(this.parameters[e.action].current+e.increment, this.parameters[e.action].min);
		}
		this.parameters[e.action].gui.text.setText(this.parameters[e.action].current);
		localStorage.setItem(e.action, this.parameters[e.action].current);
	
	},

	startGame: function() {
		nombres.maxTime = this.parameters.speed.current;
		nombres.objective = this.parameters.duration.current * (this.parameters.speed.current/2);
		game.state.start('nombres');
	}
};
