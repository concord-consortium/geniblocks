import Phaser from 'phaser'
import { tweenTint } from '../../utils'

export default class extends Phaser.Group {

	constructor ({ game, x, y, asset, targetGroup, existingGroup, rotation, melanosome, working, initialLifetime, visible=true, immortal=false }) {
		super(game)
		this.game = game;
		this.x = x;
		this.y = y;
		this.melanosome = melanosome;
		this.targetPos = new Phaser.Point(x,y);
		this.isWorking = working;


		this.existingGroup = existingGroup;
		this.existingGroup.alpha = 0;
		this.add(this.existingGroup);
		this.targetGroup = targetGroup;
		targetGroup.add(this);
		
		this.maxLifetime = 60000;
		this.lifetime = this.maxLifetime;
		this.immortal = immortal;

		if(initialLifetime){
			this.lifetime = initialLifetime;
		}

		this.rotation = rotation;
		this.visible = visible;
		if(visible) {
			this.clickArea = game.add.sprite(0,0,"square");
			this.clickArea.width = 64;
			this.clickArea.height = 64;
			this.clickArea.anchor.set(.5);
			this.clickArea.alpha = 0;
			this.clickArea.inputEnabled = true;
			this.clickArea.events.onInputDown.add(this.handleClick, this);

			// this.isVulnerable = false;
			this.add(this.clickArea);
		} else {
			this.alpha = 0;
		}
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


        if(this.isWorking === false){
        	var breakDuration = 10000 + (game.rnd.frac() * 5000);

        	game.time.events.add(breakDuration, this.breakApart, this)
        }



        // this.alpha = .5;
        // this.vulnerablePulseForever();

	}
	update () {
		
		if(!this.immortal) {
			// will only die if clicked
			this.lifetime-=game.time.physicsElapsed*1000*game.globalTimeScale;
		}

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

		
		this.angle += (0 - this.angle) * .1;
    	


	}

	handleClick(){
		this.wasPoked = true;
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
		this.existingGroup.alpha = 1;
		while(children.length>0){

			var tyrosine = children[0];

			tyrosine.isInside = true;
			tyrosine.isFloating = true;
			
			this.targetGroup.add(tyrosine);
			this.targetGroup.sendToBack(tyrosine);
			tyrosine.body.velocity.x = tyrosine.x*100;
			tyrosine.body.velocity.y = tyrosine.y*100;
			
			tyrosine.x += this.x;
			tyrosine.y += this.y;

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

	resize(){
		var w = this.scale.x * this.parent.scale.x * 512;
	    var h = this.scale.y * this.parent.scale.y * 512;
	    this.fakeHitArea.body.setSize(w, h, (512-w)/2, (512-h)/2);
	}

}
