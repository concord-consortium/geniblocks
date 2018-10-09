import Phaser from 'phaser'
import { Jiggle } from '../../helpers/AnimationHelper.js'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset }) {
    super(game, x, y, "motor_melanosome")
	this.game = game;
	this.tint = 0xFFCEB4;
	this.alpha = 1;
	this.anchor.set(.5);
	// this.inputEnabled = true;
	this.scale.set(.6);

	this.currentSlot = null;
	this.isHeld = false;
	this.heldBy = null;
	this.wasGrabbed = false;

	this.velocity = new Phaser.Point(0, 0);

	this.previous_x = this.x;
	this.previous_y = this.y;
	this.previousVelocity = new Phaser.Point(0,0);
	this.accel = new Phaser.Point(0,0);
	this.inSlotLocation = 0;

	this.baseWidth = this.width;
	this.baseHeight = this.height;
	// this.input.enableDrag(true);
	// this.tyrs=[];
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // this.blendMode = 1;
    



    this.c1 = game.add.sprite(0,0,"gears");
    this.c2 = game.add.sprite(0,0,"gears");
    this.c3 = game.add.sprite(0,0,"gears");
    this.c4 = game.add.sprite(0,0,"gears");
    
    this.c1.anchor.set(.5);
    this.c2.anchor.set(.5);
    this.c3.anchor.set(.5);
    this.c4.anchor.set(.5);

	this.addChild(this.c1);
	this.addChild(this.c2);
	this.addChild(this.c3);
	this.addChild(this.c4);

    this.game.physics.enable(this.c1, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.c2, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.c3, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.c4, Phaser.Physics.ARCADE);



    this.c1.x = 0;
	this.c1.y = -128;
	this.c1.angle = 90;

    this.c2.x = 128;
	this.c2.y = 0;
	this.c2.angle = 180;

    this.c3.x = 0;
	this.c3.y = 128;
	this.c3.angle = 270;

    this.c4.x = -128;
    this.c4.y = 0;



    this.alpha = 0;
    game.add.tween(this).to({"alpha": 1}).start();

    this.inputEnabled = true;
    this.events.onInputDown.add(function(){
    	if(this.heldBy!==null){
    		this.heldBy.releaseGrabbedMelanosome();
    	}
    }, this);



  }

  update () {
	var deltaTime = game.time.elapsedMS*.001;


	if(this.currentSlot !== null){
		var spacing = 2 * (this.inSlotLocation/this.currentSlot.capacity)*(Math.PI*2);
		var target_x = this.currentSlot.x + (Math.sin(spacing)*(this.currentSlot.scale.x * this.currentSlot.extents) * (spacing/2));
		var target_y = this.currentSlot.y + (Math.cos(spacing)*(this.currentSlot.scale.y * this.currentSlot.extents) * (spacing/2));


		this.velocity.x += (target_x-this.x)*.1;
		this.velocity.y += (target_y-this.y)*.1;
	}


	if(this.isHeld === false || this.wasGrabbed){

		// this.width  = this.baseWidth  + (.2 * this.velocity.x) - (.2*this.velocity.y);
		// this.width = this.baseHeight + (.2 * this.velocity.getMagnitude());

		this.x+=this.velocity.x*(deltaTime);
		this.y+=this.velocity.y*(deltaTime);

		this.applyFriction(.95);


		this.accel.x = this.previousVelocity.x - this.velocity.x;
		this.accel.y = this.previousVelocity.y - this.velocity.y;

		// this.rotation = game.math.linearInterpolation([this.rotation, Math.atan2(this.velocity.y, this.velocity.x)], .05);
		//this.rotation = Math.atan2(this.velocity.y, this.velocity.x);




		this.previousVelocity.x = this.velocity.x;
		this.previousVelocity.y = this.velocity.y;


	}else{
		this.velocity.x = (this.x-this.previous_x)/deltaTime;
		this.velocity.y = (this.y-this.previous_y)/deltaTime;

		this.previous_x = this.x;
		this.previous_y = this.y;
	}

	//resize physics body
	if(this.parent){
	    var w = this.parent.scale.x * 256;
	    var h = this.parent.scale.y * 256;
		this.body.setSize(w, h, (256-w)/2, (256-h)/2);


	    var sw = this.parent.scale.x * 256;
	    var sh = this.parent.scale.y * 256;
		this.c1.body.setSize(sw*2, sh, (256-sw*2)/2, (256-sh)/2);
		this.c2.body.setSize(sw, sh*2, (256-sw)/2, (256-sh*2)/2);
		this.c3.body.setSize(sw*2, sh, (256-sw*2)/2, (256-sh)/2);
		this.c4.body.setSize(sw, sh*2, (256-sw)/2, (256-sh*2)/2);
	}



	// game.debug.body(this.c1);
	// game.debug.body(this.c2);
	// game.debug.body(this.c3);
	// game.debug.body(this.c4);


		// var sqMag = this.velocity.getMagnitudeSq();
		// var maxMag = Math.min(40000, sqMag);
		// this.width = this.baseWidth + (.0005*maxMag);
		// this.height= this.baseHeight - (.0005*maxMag);




	// game.debug.bodyInfo(this, 32, 32);
    // game.debug.body(this);

	// var delta = (this.tyrs.length*this.game.gameData.size_tyr_growth_impact)-10;
	// var newScale = this.scale.x + (.0002 * delta);
	// // Clamp scale between 0.1 and 3.
	// newScale = Math.max( newScale, 0.1 );
	// newScale = Math.min( newScale, 3);

	// this.scale.x = newScale;
	// this.scale.y = newScale;
  }
  DoJiggle(){
  	console.log("TODO?? Scripted Jiggle");
  	// Jiggle(this);	
  }

  applyFriction(amount){

	this.velocity.x*=amount;
	this.velocity.y*=amount;
  }

}
