var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var mainState = {

	preload: function () {
		game.stage.backgroundColor = '#71c5cf';

		game.load.image('mario', 'img/mario.jpg');
		game.load.image('pipe', 'img/pipe.jpg');

		// Load the jump sound
		game.load.audio('jump', 'assets/jump.wav');
	},

	create: function () {
		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.pipes = game.add.group();
		this.pipes.enableBody = true;
		this.pipes.createMultiple(50, 'pipe');
		this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);

		this.mario = this.game.add.sprite(100, 245, 'mario');
		game.physics.arcade.enable(this.mario);
		this.mario.body.gravity.y = 1000;

		// New anchor position
		this.mario.anchor.setTo(-0.2, 0.5);

		var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);

		this.score = 0;
		this.labelScore = this.game.add.text(20, 20, "0", {
			font: "30px Arial",
			fill: "#ffffff"
		});

		// Add the jump sound
		this.jumpSound = this.game.add.audio('jump');
	},

	update: function () {
		if (this.mario.inWorld == false)
			this.restartGame();

		game.physics.arcade.overlap(this.mario, this.pipes, this.hitPipe, null, this);

		// Slowly rotate the mario downward, up to a certain point.
		if (this.mario.angle < 20)
			this.mario.angle += 1;
	},

	jump: function () {
		// If the mario is dead, he can't jump
		if (this.mario.alive == false)
			return;

		this.mario.body.velocity.y = -350;

		// Jump animation
		game.add.tween(this.mario).to({
			angle: -20
		}, 100).start();

		// Play sound
		this.jumpSound.play();
	},

	hitPipe: function () {
		// If the mario has already hit a pipe, we have nothing to do
		if (this.mario.alive == false)
			return;

		// Set the alive property of the mario to false
		this.mario.alive = false;

		// Prevent new pipes from appearing
		this.game.time.events.remove(this.timer);

		// Go through all the pipes, and stop their movement
		this.pipes.forEachAlive(function (p) {
			p.body.velocity.x = 0;
		}, this);
	},

	restartGame: function () {
		game.state.start('main');
	},

	addOnePipe: function (x, y) {
		var pipe = this.pipes.getFirstDead();

		pipe.reset(x, y);
		pipe.body.velocity.x = -200;
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	},

	addRowOfPipes: function () {
		var hole = Math.floor(Math.random() * 5) + 1;

		for (var i = 0; i < 8; i++)
			if (i != hole && i != hole + 1)
				this.addOnePipe(400, i * 60 + 10);

		this.score += 1;
		this.labelScore.text = this.score;
	},
};

game.state.add('main', mainState);
game.state.start('main');
