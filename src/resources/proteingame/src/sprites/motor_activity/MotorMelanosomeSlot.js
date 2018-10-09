import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, microtubule, isActive, offset, onAddCallback, onReleaseCallback }) {
    super(game, x, y, "dashed_circle")
  	this.game = game;
  	this.tint = 0x1E6F7D;
  	this.alpha = 0;
  	this.anchor.set(.5);
    this.microtubule = microtubule;
    this.myoffset = offset;
  	// this.inputEnabled = true;
  	this.scale.set(.7);
  	this.capacity = 1;
  	this.extents = 0;

    this.isActive = isActive;

  	this.melanosomes = [];

  	this.spawnDirection = {"x": 1, "y": 0};

  	// this.velocity = {x: 0, y: 0};

    this.connectedSlot = null;


  	this.inputEnabled = true;
  	this.events.onInputDown.add(this.onClick, this);
    this.onAddCallback = onAddCallback;
    this.onReleaseCallback = onReleaseCallback;

  	this.thickness = 10;

    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    if(this.isActive === true){
      game.add.tween(this).to({"alpha": 1}).start();
    }

  }

  update () {

  	//todo: move this to resize only
  	if(this.parent){
  	    var w = this.parent.scale.x * 64;
  	    var h = this.parent.scale.y * 64;
  		this.body.setSize(w, h, (256-w)/2, (256-h)/2);
  	}
    // game.debug.body(this);
  }

  addMelanosome(melanosome){
    if(this.melanosomes.length<this.capacity){
      if(melanosome.heldBy!==null && melanosome.heldBy.canAnchor === true){

    		this.melanosomes.push(melanosome);

    		melanosome.wasGrabbed = true;
        melanosome.heldBy.halt();
    		melanosome.currentSlot = this;
    		melanosome.inSlotLocation = this.melanosomes.length;
    		this.parent.bringToTop(this);

        this.tint = 0xffffff;
        this.onAddCallback.call();
      }


      if(this.melanosomes.length >= this.capacity && this.connectedSlot!==null){
        this.connectedSlot.activate();
      }


  	}
  }


  activate(){
    if(this.isActive === false){
      this.isActive = true;
      game.add.tween(this).to({"alpha": 1}).start();
    }
  }

  fillSlot(){
  	this.isFull = true;
  	// this.alpha = .75;
  }
  onClick(){
    this.releaseMelanosome();
  }

  releaseMelanosome(){
    if(this.melanosomes.length>0){

      this.onReleaseCallback.call();
      this.tint = 0x1E6F7D;

      // this.squirtSfx.play();
      var mel = this.melanosomes[this.melanosomes.length-1];
      mel.velocity.x = 0;//1000 * this.spawnDirection.x;
      // mel.velocity.x += (game.rnd.frac() * 500 * this.spawnDirection.x) - 200;

      mel.velocity.y = -400 * this.microtubule.direction;// * this.spawnDirection.y;
      // mel.velocity.y += (game.rnd.frac() * 500 * this.spawnDirection.y) - 200;
      
      // mel.rotation = Math.atan2(mel.velocity.y, mel.velocity.x);

      // if(mel.heldBy){
      //   mel.heldBy.releaseGrabbedMelanosome();
      // }
      mel.DoJiggle();
      this.melanosomes.splice(this.melanosomes.length-1, 1);
      mel.currentSlot = null;
      game.time.events.add(1000, function(){ 
        this.wasGrabbed = false;
      }, mel);
    }
  }


}
