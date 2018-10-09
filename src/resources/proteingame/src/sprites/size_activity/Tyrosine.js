import Phaser from 'phaser'
import SimplexNoise from '../../tools/simplex'
import { getParameterByName } from '../../utils'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, base_x, base_y, asset, melanosome, immortal }) {

  	var spriteName = "tyrosine";

  	var isCrazy = getParameterByName("supercrazy");
  	if(isCrazy=="supersecret"){
		spriteName = "tyrosine_crazy";
  	}


    super(game, x, y, spriteName)
	this.game = game;
	this.tint = 0xFFFFFF;
	this.anchor.set(.5, 1);
	// this.inputEnabled = true;
	this.movement_speed = this.game.rnd.between(20, 100)*.01;
	this.melanosome = melanosome;
	this.isFloating = true;
	this.immortal = immortal;

	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.scale.set(0.44, 0.52);

	this.myTweens = [];
	this.base_x = this.target_x = base_x;
    this.base_y = this.target_y = base_y;

    this.isInside = false;

    this.simplex = new SimplexNoise({r: Math});
    // this.blendMode = 1;
    
	this.alpha = 0;
  	game.add.tween(this).to({"alpha": .8}, 500).start();
    // this.blendMode = 1;


	this.rotation = Phaser.Math.radToDeg(game.rnd.frac()*360);
    this.body.drag.set(50);


    this.mydot = game.add.sprite(0,0,"circle");
    this.mydot.anchor.set(.5);
    this.mydot.width = this.mydot.height = 1;
    this.mydot.alpha = 0;
  }

  // keep track so we know if it was pushed when grabbed by a gear
  push(){
	if(this.wasPushed && this.pushTimer){
		game.time.events.remove(this.pushTimer);
	}
	this.wasPushed = true;
	if(!this.immortal) {
		this.pushTimer = game.time.events.add(4000, function(){
			this.wasPushed = false;
		}, this);
	}
  }

  update () {

  	if(this.mydot.parent == game.world && this.parent){
  		this.parent.add(this.mydot);
  	}

  	//todo: move this to resize function
    var w = this.parent.scale.x * 64;
    var h = this.parent.scale.y * 64;

    var x = (64-w)/2;
    var y = ((64-h)/1) + (32*this.parent.scale.y);
    
    //weird repositioning of physics body. probably a bad idea...
    var foop = new Phaser.Point(0, -h/2);
    var rot_p = Phaser.Point.rotate(foop, 0, 0, this.rotation);
    x += rot_p.x;
    y += rot_p.y;


    this.mydot.x = this.x + rot_p.x*.25;
    this.mydot.y = this.y + rot_p.y*.25;


    this.body.setSize(w, h, x, y);
    // this.body.setSize(w, h, 0, 0);


    // game.debug.body(this);
	if(this.body != null && this.body.velocity){

		if(this.isFloating){
   			var outOfBoundsAcceleration = .05 * game.globalTimeScale;
   			var floatSpeed = 20 * game.globalTimeScale;
   			var rotationSpeed = .02 * game.globalTimeScale;

			var dist = this.parent.scale.x * Phaser.Math.distance(this.mydot.x, this.mydot.y, this.melanosome.x, this.melanosome.y);
			//todo, performance: calculate these values only on resize or state change
			var minDist = (this.melanosome.width * this.melanosome.parent.scale.x * .5)+16;
			var maxDist = 960 * this.parent.scale.x;
			var superMaxDist = 480 * this.parent.scale.x;


			//if inside, adjust float speed and bounds
			if(this.isInside){
				maxDist = ((this.melanosome.width/2) * this.melanosome.parent.scale.x * .75);
				superMaxDist = ((this.melanosome.width/2) * this.melanosome.parent.scale.x * .95);
				minDist = -10;
				floatSpeed*=1 * game.globalTimeScale;
				rotationSpeed= .002 * game.globalTimeScale;
				outOfBoundsAcceleration = .03  * game.globalTimeScale;

				if(dist>superMaxDist){
					this.body.velocity.x = (this.melanosome.x - this.x) * outOfBoundsAcceleration * 5;
					this.body.velocity.y = (this.melanosome.y - this.y) * outOfBoundsAcceleration * 5;

				}
				else if(dist>maxDist){
					this.body.velocity.x += (this.melanosome.x - this.x) * outOfBoundsAcceleration;
					this.body.velocity.y += (this.melanosome.y - this.y) * outOfBoundsAcceleration;
				}else{

					this.body.velocity.y += (game.rnd.frac() - .5)*.01 - (this.body.velocity.y*.005);
					this.body.velocity.x += (game.rnd.frac() - .5)*.01 - (this.body.velocity.x*.005);;
				}
			}



			else{
				if(dist>maxDist){
					this.body.velocity.x += (this.melanosome.x - this.x) * outOfBoundsAcceleration;
					this.body.velocity.y += (this.melanosome.y - this.y) * outOfBoundsAcceleration;
				}
				else if(dist<minDist){
					this.body.velocity.x = (this.x - this.melanosome.x) * outOfBoundsAcceleration;
					this.body.velocity.y = (this.y - this.melanosome.y) * outOfBoundsAcceleration;
				}
				else{
					if(game.rnd.frac()<.05){
						this.body.velocity.x += (this.melanosome.x - this.x) * floatSpeed * .001;
						this.body.velocity.y += (this.melanosome.y - this.y) * floatSpeed * .001;
					}else{
						// this.body.velocity.x += 1;
						this.body.velocity.y += (game.rnd.frac() - .5)*floatSpeed;
						this.body.velocity.x += (game.rnd.frac() - .5)*floatSpeed;
					}

					// var norm = this.body.velocity.normalize();
					// this.body.velocity.x = norm.x*100;// = this.body.velocity.normalize();
					// this.body.velocity.y = norm.y*100;// = this.body.velocity.normalize();
				}
			}


			this.body.velocity.x = game.math.clamp(this.body.velocity.x, -200, 200);
			this.body.velocity.y = game.math.clamp(this.body.velocity.y, -200, 200);
			//var ang = Math.atan2( this.body.velocity.x,  this.body.velocity.y);
			// this.body.rotation += (Phaser.Math.radToDeg(-ang) - this.body.rotation)*rotationSpeed;
			// this.body.rotation += (this.body.velocity.x + this.body.velocity.y)*.02;
		}else{
			this.body.velocity.x = 0;
			this.body.velocity.y = 0;
			// this.body.stopMovement(true);
		}
	}


	// var y_offset = 100 * this.simplex.noise(this.base_y + this.game.time.now*.000013, this.base_y + this.game.time.now*.000099);
	// // this.base_x+=.1;
	// this.target_x = this.base_x + x_offset;
	// this.target_y = this.base_y + y_offset;


	// this.body.x += (this.target_x - this.x)*.2;
	// this.body.y += (this.target_y - this.y)*.2;
  }

  rotateTo(value) {
	var diff = this.rotation - value;
	while(diff > Math.PI) {
		diff -= 2*Math.PI;
	}
	while(diff < -Math.PI) {
		diff += 2*Math.PI;
	}
	this.myTweens.push(game.add.tween(this).to({"rotation": this.rotation - diff}, 100).start());
  }


	stopAllTweens(){
		for(var i = 0;i<this.myTweens.length;i++){
			this.myTweens[i].stop();
			game.tweens.remove(this.myTweens[i]);
			this.myTweens[i] = null;
		}
		this.myTweens = [];
	}
	dieAfterTime(){
		game.time.events.add(25000, function(){
			if(this.isFloating && this.isInside){
				this.isFloating = false;
				game.add.tween(this).to({"alpha": 0}, 500).start();
				game.time.events.add(501, function(){
					this.mydot.destroy();
					this.destroy();
				}, this);
			}

		}, this);
	}

}
