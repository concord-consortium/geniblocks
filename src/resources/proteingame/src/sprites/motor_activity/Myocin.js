import Phaser from 'phaser'

export default class extends Phaser.Group {

  constructor ({ game, x, y, actin, popSfx, asset, baseStickiness, stickinessVariation }) {
    super(game);//, x, y, "myocin")
    this.game = game;
    this.x = x;
    this.y = y;
  	this.tint = 0x3f377d;
  	this.alpha = 0;
  	// this.anchor.set(.5);
  	// this.inputEnabled = true;
  	this.offset = 0;
  	this.actin = null;
  	this.movement_speed = .1;
	
  	this.stickiness = (game.rnd.frac()*stickinessVariation) + baseStickiness;
  	this.scale.set(.05 + (.1 * (this.stickiness/5)));
  	this.popSfx = popSfx;


  	if(actin){
  		this.attachToActin(actin);
  	}
  	// this.input.enableDrag(true);
  	// this.tyrs=[];
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

  	// this.inputEnabled = true;
  	// this.events.onInputDown.add(this.onClick, this);

    this.lastPosition = {x:x, y:y};
    this.velocity = {x:0, y: 0};


  	game.add.tween(this).to({alpha: .75}, 2000, "Expo", true);


  }
  attachToActin(actin){
	this.actin = actin;
	if(this.actin.direction>0){
		this.offset = 0;
	}
	else{
		this.offset = 1;
	}
  }
  update () {
  	if(this.actin){
  		this.offset += game.time.elapsedMS * .001 * this.movement_speed * this.actin.direction;
  		var p = this.actin.getPositionAtOffset(this.offset);
  		this.x = p.x;
  		this.y = p.y;
  	}

  	if(this.offset>1 || this.offset <0){
  		this.fadeAway();
  	}

  	var diff_x = this.x - this.lastPosition.x;
  	var diff_y = this.y - this.lastPosition.y;

  	this.velocity.x = diff_x;
  	this.velocity.y = diff_y;
	this.lastPosition = {x: this.x, y: this.y};

	this.rotation = Math.atan2(this.velocity.y, this.velocity.x);

	if(this.parent && this.body){
	    var w = this.parent.scale.x * 512;
	    var h = this.parent.scale.y * 512;
		this.body.setSize(w, h, (512-w)/2, (512-h)/2);
	}

	// game.debug.bodyInfo(this, 32, 32);
 //    game.debug.body(this);
  }
  onClick(){
  	this.pop();
  }
  pop(){
  	var t = game.add.tween(this.scale).to({x: this.scale.x * 4, y: this.scale.y * 4}, 200, "Expo", true);
  	var a = game.add.tween(this).to({alpha: 0}, 200, "Expo", true);
  	this.popSfx.play();
  	game.time.events.add(201, this.destroy, this);
  }
  fadeAway(){
  	if(this.fading!== true){
  		this.body = null;
	  	this.fading = true;
	  	var a = game.add.tween(this).to({alpha: 0}, 2000, "Expo", true);
	  	game.time.events.add(2001, this.destroy, this);
  	}

  }

}
