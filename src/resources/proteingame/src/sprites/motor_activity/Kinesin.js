import Phaser from 'phaser'

export default class extends Phaser.Group {

  constructor ({ game, x, y, microtubule, initialOffset, popSfx, asset, baseStickiness, stickinessVariation, tint, strongChance, canAnchor, onGrabMelanosome, onReleaseMelanosome, startDisabled }) {
    super(game);//, x, y, "myocin")
	this.game = game;
	this.x = x;
	this.y = y;
	this.tint = tint ? tint : 0x9a3939;
	this.lightTint = Phaser.Color.interpolateColor(this.tint, 0xffffff, 100, 60, 1)
	this.alpha = 0;
	// this.anchor.set(.5);
	// this.inputEnabled = true;
	this.myoffset = initialOffset;
	this.microtubule = microtubule;
	this.movement_speed = .2;
	this.rotation_speed = .075;
	this.stickiness = (game.rnd.frac()*stickinessVariation) + baseStickiness;
	// this.scale.set(.05 + (.1 * (this.stickiness/5)));
	this.popSfx = popSfx;

	this.isHalted = false;
	this.isFullyHalted = false;

	this.canGrab = true;
	this.grabbedMelanosome = null;
	this.holdDuration = -1;

	this.canAnchor = canAnchor;

	this.isStrong = game.rnd.frac() < strongChance;
	this.onReleaseMelanosome = onReleaseMelanosome;
	this.onGrabMelanosome = onGrabMelanosome;

	// if(this.isStrong){
	// 	this.holdDuration = -1;
	// }

	if(microtubule){
		this.attachToMicrotubule(microtubule, initialOffset);
	}






	this.prop_foot = game.add.sprite(0,0,"propeller_foot");
	this.prop_foot.tint = this.tint;
	this.prop_foot.anchor.set(.5);
	this.prop_foot.width = -30;
	// this.prop_foot.width = -32;// * ((game.rnd.frac()*1.25) + .8);
	this.prop_foot.height = -this.prop_foot.width;
	this.add(this.prop_foot);

	this.movement_speed = (this.prop_foot.height*.0025) * 1.5;

	// this.flag_bmd = game.add.bitmapData(256,256);
	// this.flag_sprite = game.add.sprite(0,0,this.flag_bmd);
	// this.flag_sprite.tint = this.tint;
	// this.flag_sprite.anchor.set(.5, .5);
	// this.add(this.flag_sprite);

	this.points={
		x: [128, 196-128, 0],
		y: [256, 196, 196]
	}







	this.grabber = game.add.sprite(0,0,"grabber");
	if(this.isStrong){
		this.grabber.width = 50;
		this.grabber.height = 50;
	}else{
		this.grabber.width = 25;
		this.grabber.height = 25;
	}
	this.grabber.tint = this.lightTint;
	this.grabber.angle = 180;
	this.grabber.anchor.set(.49, .5);
	this.add(this.grabber);
	this.grabber.x = 0;
	this.grabber.y = 0;



	this.grabber_hit = game.add.sprite(0,0,"square");
	if(this.isStrong){
		this.grabber_hit.width = 50;
		this.grabber_hit.height = 50;
	}else{
		this.grabber_hit.width = 25;
		this.grabber_hit.height = 25;
	}
	this.grabber_hit.tint = this.lightTint;
	this.grabber_hit.angle = 180;
	this.grabber_hit.anchor.set(.49, .5);
	this.add(this.grabber_hit);
	this.grabber_hit.alpha = 0;
	this.grabber_hit.x = 0;
	this.grabber_hit.y = 0;




	// this.inputEnabled = true;
	// this.events.onInputDown.add(this.onClick, this);

    this.lastPosition = {x:x, y:y};
    this.velocity = {x:0, y: 0};

    this.flagellumDots = [];1
    var numFlagDots = 20;
    for(var i = 0;i<numFlagDots;i++){
		var dot = game.add.sprite(0,0,"circle");
		this.add(dot);
		
		if(i<numFlagDots - 8)
			dot.tint = this.tint;
		else{
			dot.tint = this.lightTint;
		}

		dot.x = 0;
		dot.y = 0;
		var size = 12*( 1.1 - (i/numFlagDots) )
		dot.width = size;
		dot.height = size;
		this.flagellumDots.push(dot);
		dot.anchor.set(.5)
    }



	this.propBody = game.add.sprite(0,0,"circle");
	this.propBody.width = 16;
	this.propBody.height = 16;
	this.propBody.tint = this.lightTint;
	this.propBody.anchor.set(.5);
	this.add(this.propBody);
	this.propBody.x = 0;
	this.propBody.y = 0;

	this.propBodyInner = game.add.sprite(0,0,"circle");
	this.propBodyInner.width = 10.67;
	this.propBodyInner.height = 10.67;
	this.propBodyInner.tint = this.tint;
	this.propBodyInner.anchor.set(.5);
	this.add(this.propBodyInner);
	this.propBodyInner.x = 0;
	this.propBodyInner.y = 0;




	this.clickArea = game.add.sprite(0,0,"square");
	this.clickArea.width = 64;
	this.clickArea.height = 64;
	this.clickArea.anchor.set(.5, .67);
	this.clickArea.alpha = 0;
	this.add(this.clickArea);
	this.clickArea.inputEnabled = true;
	this.clickArea.events.onInputDown.add(function(){
		this.releaseGrabbedMelanosome();
		this.pop();
	}, this);




	this.startDisabled = startDisabled;

    game.time.events.add(100, function(){
	    this.game.physics.enable(this.grabber, Phaser.Physics.ARCADE);
	    this.game.physics.enable(this.grabber_hit, Phaser.Physics.ARCADE);

     	if(this.startDisabled === true){
	      this.grabber.body.checkCollision.none = true;
	      this.grabber_hit.body.checkCollision.none = true;
          game.time.events.add(100, function(){
	      	this.grabber.body.checkCollision.none = false;
	      	this.grabber_hit.body.checkCollision.none = false;
		  }, this);
	  	}
    }, this);


  }
  attachToMicrotubule(microtubule, offset){
	this.microtubule = microtubule;

	if(offset == null){
		if(this.microtubule.direction>0){
			this.myoffset = -0.1;
		}
		else{
			this.myoffset = 1.1;
		}
	}else{
		this.myoffset = offset;
	}

	var p = this.microtubule.getPositionAtOffset(this.myoffset);
	this.x = p.x;
	this.y = p.y;
	this.lastPosition = {x: this.x, y: this.y};

  	game.add.tween(this).to({alpha: 1}, 200, "Expo", true);




  }
  update () {





  	// game.debug.body(this.grabber);
  	// game.debug.body(this.grabber_hit);




  	if(this.isFullyHalted === true) return;


  	if(this.microtubule && this.isHalted !== true){



		this.rotation = Math.atan2(this.velocity.y, this.velocity.x);
		this.prop_foot.rotation += this.rotation_speed*(Math.PI/2);
		var rad = this.prop_foot.rotation;//(game.math.degToRad(this.prop_foot.angle));
		// var radFoo = Math.abs(rad);
		this.prop_foot.y = (this.prop_foot.width/2) * Math.abs(Math.sin(rad));
		this.propBody.y = this.prop_foot.y;
		this.propBodyInner.y = this.prop_foot.y;

		var foo = .001 + (this.prop_foot.rotation/(Math.PI) % 1);
		foo = .45;
  		this.myoffset += (foo * (game.time.elapsedMS/1000) * this.movement_speed * this.microtubule.direction);// * game.time.elapsedMS * this.movement_speed * this.microtubule.direction;
  		var p = this.microtubule.getPositionAtOffset(this.myoffset);
  		this.x = p.x;
  		this.y = p.y;

  	}

  	if(this.myoffset>1.3 || this.myoffset <-.3){
  		this.fadeAway();
  	}





  	var diff_x = this.x - this.lastPosition.x;
  	var diff_y = this.y - this.lastPosition.y;

  	this.velocity.x = diff_x;
  	this.velocity.y = diff_y;

	this.lastPosition = {x: this.x, y: this.y};



	if(this.parent && this.grabber.body){
	    var w = this.parent.scale.x * 128;
	    var h = this.parent.scale.y * 128;
		this.grabber.body.setSize(w, h, (128-w)/2, (128-h)/2);
	}
	// game.debug.body(this.grabber);



	if(this.grabbedMelanosome){



		var target_x = this.x - 128;
		var target_y = this.y - 20;


		//if the melanosome isn't inside a slot
		//tell it where to be
		if(this.grabbedMelanosome.wasGrabbed !== true){
			var p = new Phaser.Point(target_x, target_y);
			Phaser.Point.rotate(p, this.x, this.y, this.rotation);
			this.grabbedMelanosome.x += (p.x-this.grabbedMelanosome.x)*.051;
			this.grabbedMelanosome.y += (p.y-this.grabbedMelanosome.y)*.051;
		}




	}else{

	}
	this.updateFlagellum();



  }





  grab(melanosome){

  	if(this.canGrab === true && this.grabbedMelanosome === null && melanosome !== this.lastGrabbedMelanosome){
  		

		if(melanosome.isHeld === false){

	  		this.grabbedMelanosome = melanosome;
	  		this.lastGrabbedMelanosome = melanosome;
	  		melanosome.heldBy = this;
	  		this.canGrab = false;
	  		melanosome.isHeld = true;
	  		melanosome.velocity.x = 0;
	  		melanosome.velocity.y = 0;
	  		

	  		if(this.onGrabMelanosome){
	  			this.onGrabMelanosome.call();
	  		}

	  		if(this.holdDuration>0){

	  			game.time.events.add(1000*(this.holdDuration * (game.rnd.frac()+.5)), function(){
	  				if(this.grabbedMelanosome && this.grabbedMelanosome.currentSlot === null){
	  					this.releaseGrabbedMelanosome();
	  				}
	  			}, this);
	  		}

		}else if((melanosome.isHeld == true && this.isStrong && melanosome.heldBy.isStrong!==true)){
	  		this.grabbedMelanosome = melanosome;
	  		this.lastGrabbedMelanosome = melanosome;
	  		melanosome.heldBy.releaseGrabbedMelanosome();

	  		melanosome.heldBy = this;
	  		this.canGrab = false;
	  		melanosome.isHeld = true;
	  		melanosome.velocity.x = 0;
	  		melanosome.velocity.y = 0;
	  		

	  		if(this.onGrabMelanosome){
	  			this.onGrabMelanosome.call();
	  		}

	  		if(this.holdDuration>0){

	  			game.time.events.add(1000*(this.holdDuration * (game.rnd.frac()+.5)), function(){
	  				if(this.grabbedMelanosome && this.grabbedMelanosome.currentSlot === null){
	  					this.releaseGrabbedMelanosome();
	  				}
	  			}, this);
	  		}
		}



  	}
  }
  releaseGrabbedMelanosome(){
  	if(this.grabbedMelanosome !== null){
  		if(this.onReleaseMelanosome){
  			this.onReleaseMelanosome.call();
  		}
		if(this.grabbedMelanosome.currentSlot != null){
			this.grabbedMelanosome.currentSlot.releaseMelanosome();
		}


		this.grabbedMelanosome.heldBy = null;
  		this.grabbedMelanosome.isHeld = false;
		this.grabbedMelanosome = null;
		

		if(this.haltingEvent!==null){
			game.time.events.remove(this.haltingEvent);
			this.haltingEvent = null;
		}



		this.isHalted = false;
		this.isFullyHalted = false;



  		game.time.events.add(1000, function(){
  			this.canGrab = true;
  		}, this);
  		
  	}
  }


  pop(){
  	// var t = game.add.tween(this.scale).to({x: this.scale.x * 4, y: this.scale.y * 4}, 200, "Expo", true);
  	var a = game.add.tween(this).to({alpha: 0}, 200, "Expo", true);

  	this.popSfx.play();
  	game.time.events.add(201, this.destroy, this);
  }
  fadeAway(){
  	if(this.fading!== true){
    	// this.game.physics.disable(this);
    	this.body = null;

	  	this.fading = true;
	  	var a = game.add.tween(this).to({alpha: 0}, 2000, "Expo", true);
	  	game.time.events.add(2001, this.destroy, this);
  	}

  }
  updateFlagellum(){
  	// this.flag_bmd.clear();

  	if(this.grabbedMelanosome!==null){
  		//root position, always right where the foot is
	  	this.points.y[0] = 128+this.prop_foot.y;

	  	var p = new Phaser.Point(
	  		(this.grabbedMelanosome.x - this.x), 
	  		(this.grabbedMelanosome.y - this.y)
	  	);
		var rot_p = Phaser.Point.rotate(p, 0, 0, -this.rotation);

	  	this.points.x[2] += ((128+(this.grabbedMelanosome.width/2)+(rot_p.x))-this.points.x[2]) *.1;
	  	this.points.y[2] += ((128+(rot_p.y)) - this.points.y[2]) * .1;// + rot_offset.y;


	  	this.points.x[1] = (this.points.x[0]+this.points.x[2])*.5;
	  	this.points.y[1] = (this.points.y[0]+this.points.y[2])*.5;


		//point the grabber at the melanosome


		var target_x = this.x - 128;
		var target_y = this.y - 20;

		var end_p = this.getPositionAtOffset(.9);
		end_p.x+=this.x;
		end_p.y+=this.y;
		end_p.x-=128;
		end_p.y-=128;
		var diff_x = target_x - end_p.x;
		var diff_y = target_y - end_p.y;
		this.grabber.rotation = Math.atan2(diff_y, diff_x);



  	}else{
	  	this.points.y[0] = 128+this.prop_foot.y;
	  	// this.points.y[1] = 72 + (this.microtubule.direction * (Math.sin((this.prop_foot.rotation + (Math.PI))*2)*12 ));


	  	this.points.x[1] = 82;
	  	this.points.y[1] = 118;//(this.points.y[0]+this.points.y[2])*.5;
  		 
  		this.points.x[2] = 64;
	  	this.points.y[2] = 118 - (5 * (this.microtubule.direction * (Math.sin(this.prop_foot.rotation*2) )));

		this.grabber.rotation = Math.PI;

  	}


	// var spacing = .15;
	// for(var i = 0;i<=1;i+=spacing){
	// 	var p = this.getPositionAtOffset(i);

	// 	this.flag_bmd.circle(p.x, p.y, 7-(5*i), 'rgba(255,255,255,1)');
	// }


	for(var i = 0;i<this.flagellumDots.length;i++){
		var p = this.getPositionAtOffset((i)/this.flagellumDots.length);
		this.flagellumDots[i].x = p.x-128;
		this.flagellumDots[i].y = -128+p.y;
	}


	var end = this.getPositionAtOffset(.9);
	this.grabber.x = end.x-128;
	this.grabber.y = -128+end.y;


	this.grabber_hit.x = this.grabber.x - 120;
	this.grabber_hit.y = this.grabber.y - 15;


	// game.debug.body(this.grabber)
  }

  halt(){
  	this.isHalted = true;
  	//after 2 seconds, 
  	this.haltingEvent = game.time.events.add(2000, function(){ this.isFullyHalted = true; }, this)
  }
  getPositionAtOffset(offset){

  	  var px = this.game.math.bezierInterpolation(this.points.x, offset);
	  var py = this.game.math.bezierInterpolation(this.points.y, offset);
	  return new Phaser.Point(px, py);
  }

}
