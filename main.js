var game = new Phaser.Game(600, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('sky', 'assets/img/sky.png');
    game.load.image('ground', 'assets/img/platform.png');
    game.load.image('star', 'assets/img/star.png');
    game.load.image('diamond', 'assets/img/diamond.png');
    game.load.spritesheet('baddie', 'assets/img/baddie.png', 32, 32);
	// preload assets
}

var player;
var platforms;
var cursors;
var stars;
var diamond;
var score = 0;
var scoreText;


function create() {
	//  enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  background for my game
    game.add.sprite(0, 0, 'sky');
    game.add.sprite(0, 400, 'sky');

    //  group of various plat forms
    platforms = game.add.group();

    //  We will enable physics for platforms
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it the ground and set ground (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    //  create the ledges
    var ledge = platforms.create(400, 100, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 150, 'ground');
    ledge.body.immovable = true;

     ledge = platforms.create(-200, 350, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(100, 450, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(100, 600, 'ground');
    ledge.body.immovable = true;
    
    // create the player
    player = game.add.sprite(32, game.world.height - 150, 'baddie');

    //  player physics 
    game.physics.arcade.enable(player);

    //  the properties of the player physics
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;

    //  animation of the player.
    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [2,3], 10, true);  

   	// creates a star group
   	stars = game.add.group();

    stars.enableBody = true;

    //  create the amount of stars and how they'll be placed
    for (var i = 0; i < 12; i++)
    {
        var star = stars.create(i * 70, 0, 'star');

        //  have the stars flot down
        star.body.gravity.y = 6;

        //  make the stars bounce randomly
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    diamond = game.add.sprite(game.rnd.integer(), game.rnd.integer(), 'diamond');
    
    // create the key options 
    cursors = game.input.keyboard.createCursorKeys();
    
    //display the score on the screen
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

}

function update() {

    // the player from passing through the ground
	var hitPlatform = game.physics.arcade.collide(player, platforms);
    
    // make interaction between star and player
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    // diamond interaction
    game.physics.arcade.collide(diamond, platforms);
    game.physics.arcade.overlap(player, diamond, collectdiamond, null, this)

    //movement of the player
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand
        player.animations.stop();
        
        player.frame = 2;
    }

    //  make the player jump
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }

}

function collectStar (player, star) {

    // collect the star
    star.kill();

    //  Add to the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

function collectdiamond (player, diamond) {

    // collect the daimond
    diamond.kill();

    //  Add to the score
    score += 25
    scoreText.text = 'Score: ' + score;

}

