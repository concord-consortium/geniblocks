import Phaser from 'phaser'
import { tweenTint } from '../../utils'

export default class extends Phaser.Group {

	constructor ({ game, x, y, asset, targetGroup, existingGroup, rotation, melanosome, working, initialLifetime }) {
		super(game)
		this.game = game;
		this.x = x;
		this.y = y;
		this.melanosome = melanosome;
		this.targetPos = new Phaser.Point(x,y);
		this.isWorking = working;


		this.existingGroup = existingGroup;
		this.add(existingGroup);
		existingGroup.x = 0;
		existingGroup.y = 0;
		this.targetGroup = targetGroup;
		targetGroup.add(this);
		
		this.maxLifetime = 60000;
		this.lifetime = this.maxLifetime;

		if(initialLifetime){
			this.lifetime = initialLifetime;
		}

		this.rotation = rotation;


        this.clickArea = game.add.sprite(0,0,"square");
        this.clickArea.width = 64;
        this.clickArea.height = 64;
        this.clickArea.anchor.set(.5);
        this.clickArea.alpha = 0;
        this.clickArea.inputEnabled = true;
        this.clickArea.events.onInputDown.add(this.handleClick, this);




        // this.isVulnerable = false;
        this.add(this.clickArea);

    	this.onStarDestruction = new Phaser.Signal();
    	this.onPoke = new Phaser.Signal();


		// for(var i = 0;i<this.existingGroup.children.length;i++){
		//     var t = this.existingGroup.children[i];
		//     t.tint = 0xFFc4a6;
		//     // t.blendMode = 0;
		// }

		
        this.fakeHitArea = game.add.sprite(0,0,"square");
        this.fakeHitArea.width = 64;
        this.fakeHitArea.height = 64;
        this.fakeHitArea.anchor.set(.5);
        this.fakeHitArea.alpha = 0;

        this.parent.add(this.fakeHitArea);
        this.fakeHitArea.x = this.x;
        this.fakeHitArea.y = this.y;
        game.physics.enable(this.fakeHitArea, Phaser.Physics.ARCADE);

        // this.fakeHitArea.body.velocity.x = 100;
        // fullStar.body.velocity.y = -100 - ((game.rnd.frac() * 50)-25);
        // fullStar.body.velocity.x = (game.rnd.frac() * 50)-25;
        this.fakeHitArea.body.drag.set(20);

        this.game.add.tween(this.scale).to({"x": 1.3, "y": 1.3}).start();


        this.hexagon = game.add.sprite(0,0,"hexagon");
        this.hexagon.width = this.hexagon.height = 30;
        this.hexagon.anchor.set(.5);
        this.add(this.hexagon);
        this.hexagon.rotation = this.rotation + Math.PI/6;
        this.hexagon.x = 0;
        this.hexagon.y = 0;
		this.hexagon.tint = 0xFFc4a6;
		this.hexagon.alpha = .4;


        this.hexagon_small = game.add.sprite(0,0,"hexagon");
        this.hexagon_small.width = this.hexagon_small.height = 20;
        this.hexagon_small.anchor.set(.5);
        this.add(this.hexagon_small);
        this.hexagon_small.rotation = this.rotation + Math.PI/6;
        this.hexagon_small.x = 0;
        this.hexagon_small.y = 0;
		this.hexagon_small.tint = 0xFFc4a6;
		this.hexagon_small.alpha = .4;

        this.highlight_circle = game.add.sprite(0,0,"dashed_circle");
        this.highlight_circle.width = this.highlight_circle.height = 100;
        this.highlight_circle.anchor.set(.5);
        this.highlight_circle.alpha = 0;
        this.add(this.highlight_circle);
        this.highlight_circle.x = 0;
        this.highlight_circle.y = 0;


        if(this.isWorking === false){
        	var breakDuration = 10000 + (game.rnd.frac() * 5000);
			for(var i = 0;i<this.existingGroup.children.length;i++){
			    var t = this.existingGroup.children[i];
        		tweenTint(t, t.tint, 0xff0000, breakDuration);
			}


        	game.time.events.add(breakDuration, this.breakApart, this)
        }




		this.setColor(0xffad90);

		this.updateColor();
        // this.alpha = .5;
        // this.vulnerablePulseForever();

	}
	update () {


		this.lifetime-=game.time.physicsElapsed*1000*game.globalTimeScale;
		if(this.lifetime<0){
			this.breakApart();
			return;
		}
		var rumble = Math.max(0, .75-(this.lifetime/this.maxLifetime));




	      var diff_x = this.targetPos.x-this.fakeHitArea.x;
	      var diff_y = this.targetPos.y-this.fakeHitArea.y;

		  var dir = new Phaser.Point(diff_x, diff_y);


	      this.fakeHitArea.body.velocity.x = dir.x*2;
	      this.fakeHitArea.body.velocity.y = dir.y*2;

	      // this.fakeHitArea.body.x = this.targetPos.x;
	      // this.fakeHitArea.body.y = this.targetPos.y;




		this.position.x = this.fakeHitArea.x + (game.rnd.frac() * (rumble) * 10 );
		this.position.y = this.fakeHitArea.y + (game.rnd.frac() * (rumble) * 10 );

		//todo: move this to resize only
	    var w = this.scale.x * this.parent.scale.x * 512;
	    var h = this.scale.y * this.parent.scale.y * 512;
	    this.fakeHitArea.body.setSize(w, h, (512-w)/2, (512-h)/2);

		this.existingGroup.angle += (0 - this.existingGroup.angle) * .1;
    	


	}

	handleClick(){
		this.lifetime -= 15000;
		this.alpha = 0;
		this.onPoke.dispatch(this);

		game.time.events.add(100, function(){
			this.alpha = 1;
		}, this)

	}
	pulseVulnerable(duration){
        this.clickArea.inputEnabled = true;
		// this.isVulnerable = true;
		// this.tint = 0x000000;
		// this.highlight_circle.alpha = 1;
		// game.add.tween(this.highlight_circle).to({"alpha": 0}, duration).start();
		// game.time.events.add(duration, function(){
  //       	this.clickArea.inputEnabled = false;
		// 	this.isVulnerable = false;
		// 	this.tint = 0xffffff;
		// 	this.highlight_circle.alpha = 0;
		// }, this)
	}

	breakApart(){
		var children = this.existingGroup.children;
		while(this.existingGroup.children.length>0){

			var tyrosine = this.existingGroup.children[0];

			tyrosine.isInside = true;
			tyrosine.isFloating = true;
			
			this.targetGroup.add(tyrosine);
			this.targetGroup.sendToBack(tyrosine);
			tyrosine.body.velocity.x = tyrosine.x*100;
			tyrosine.body.velocity.y = tyrosine.y*100;
			
			tyrosine.x += this.x;
			tyrosine.y += this.y;
			tyrosine.tint = 0xF9D2C3; 

			tyrosine.dieAfterTime();
			tyrosine.z = 0;
		}
		this.melanosome.numStars --;
		this.onStarDestruction.dispatch(this);
		//destroy this
		this.destroy();
	}
	jumpToLocation(){
		this.fakeHitArea.x = this.targetPos.x;
		this.fakeHitArea.y = this.targetPos.y;
		this.position.x = this.fakeHitArea.x;
		this.position.y = this.fakeHitArea.y;
	}

	setColor(hexColor, index){
		// hexColor -= (index/2);
		hexColor = Phaser.Color.interpolateColor(hexColor, 0x000000, 100, index/2);
		for(var i = 0;i<this.existingGroup.children.length;i++){
		    var t = this.existingGroup.children[i];
		    t.tint = hexColor;
		}
		this.hexagon.tint = hexColor;
		this.hexagon_small.tint = hexColor;
	}
	updateColor(index){
		this.setColor(this.melanosome.starColor, index);
	}

}
