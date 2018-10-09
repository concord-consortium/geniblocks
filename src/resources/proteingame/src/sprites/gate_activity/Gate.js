import Phaser from 'phaser'

export default class extends Phaser.Group {

  constructor ({ game, x, y, rotation, height, targetPhysicsGroup, wallWidth, onOpenGate, onCloseGate, onClickRelease, onClickClose}) {
    super(game)
    this.game = game;
    this.alpha = 1;
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.closedGapSize = 8;
    this.openGapSize = height*.5;
    this.totalWidth = height;
    this.currentStopper = null;

    this.isOpen = true;

  	this.left_half = game.add.sprite(0,0,"gate_half");
  	this.left_half.anchor.set(1);
  	this.left_half.width = this.left_half.height = (height/2);
  	this.left_half.tint = 0x8F8965;
    
  	this.add(this.left_half);
  	this.left_half.x = -this.closedGapSize/2;
  	this.left_half.y = 0;


  	this.right_half = game.add.sprite(0,0,"gate_half");
  	this.right_half.anchor.set(1);
  	this.right_half.width = this.right_half.height = (height/2);
  	this.right_half.width *= -1;
    this.right_half.tint = 0x8F8965;
  	
  	this.add(this.right_half);
  	this.right_half.x = this.closedGapSize/2;
  	this.right_half.y = 0;


  	this.hitArea = game.add.sprite(0,height/6,"square");
  	this.hitArea.anchor.set(.5, 1);
  	this.hitArea.alpha = 0;
  	this.hitArea.width = height/2;
  	this.hitArea.height = height;
  	this.add(this.hitArea);
    this.game.physics.enable(this.hitArea, Phaser.Physics.ARCADE);




    this.clickArea = game.add.sprite(0,0,"square");
    this.clickArea.anchor.set(.5, .5);
    this.clickArea.alpha = 0;
    this.clickArea.height = height;
    this.clickArea.width = height/2 + 20;
    this.add(this.clickArea);

    this.clickArea.inputEnabled = true;
    this.clickArea.events.onInputUp.add(this.handleClick, this)
    this.isReleasing = false;



    this.onOpenGate = onOpenGate;
    this.onCloseGate = onCloseGate;
    this.onClickRelease = onClickRelease;
    this.onClickClose = onClickClose;

    this.wallBlocker = game.add.sprite(0,0,"square");
    this.wallBlocker.anchor.set(0, .5);
    this.wallBlocker.alpha = 0;
    this.wallBlocker.width = height/4;
    this.wallBlocker.height = height;
    this.game.physics.enable(this.wallBlocker, Phaser.Physics.ARCADE);

    // this.add(this.wallBlocker);
    this.wallBlocker.x = this.x + height/3;
    this.wallBlocker.y = this.y;
    this.wallBlocker.body.immovable = true;

    targetPhysicsGroup.add(this.wallBlocker);
    this.wallBlocker.body.enable = false;




    // this.leftWallBlocker = game.add.sprite(0,0,"square");
    // this.leftWallBlocker.anchor.set(1,1);
    // this.leftWallBlocker.alpha = 0;
    // this.leftWallBlocker.width = wallWidth;
    // this.leftWallBlocker.height = width/2;
    // this.game.physics.enable(this.leftWallBlocker, Phaser.Physics.ARCADE);

    // // this.add(this.leftWallBlocker);
    // this.leftWallBlocker.x = this.x - width/4;
    // this.leftWallBlocker.y = this.y;
    // this.leftWallBlocker.body.immovable = true;

    // targetPhysicsGroup.add(this.leftWallBlocker);
    // this.leftWallBlocker.body.enable = false;







    // this.rightWallBlocker = game.add.sprite(0,0,"square");
    // this.rightWallBlocker.anchor.set(0, 1);
    // this.rightWallBlocker.alpha = 0;
    // this.rightWallBlocker.width = wallWidth;
    // this.rightWallBlocker.height = width/2;
    // this.game.physics.enable(this.rightWallBlocker, Phaser.Physics.ARCADE);

    // // this.add(this.rightWallBlocker);
    // this.rightWallBlocker.x = this.x + width/4;
    // this.rightWallBlocker.y = this.y ;
    // this.rightWallBlocker.body.immovable = true;

    // targetPhysicsGroup.add(this.rightWallBlocker);
    // this.rightWallBlocker.body.enable = false;

  }

  update () {

    var target_rotation = 0;

    var target_x = this.closedGapSize/2;

  	if(this.isOpen){
        target_x = this.openGapSize/2;
        target_rotation = Math.PI/4;
  	}else{

  	}
    // this.left_half.x += (-target_x - this.left_half.x) * .1;
    // this.right_half.x += (target_x - this.right_half.x) * .1;


    this.left_half.rotation += (-target_rotation - this.left_half.rotation) * .1;
    this.right_half.rotation += (target_rotation - this.right_half.rotation) * .1;
  }

  toggleOpen(isOpen){
  	this.isOpen = isOpen;
  }
  handleClick(){
    if(this.currentStopper!==null){
        this.onClickRelease.call(null, this.currentStopper);
        this.releaseStopper();
    }else if(!this.isReleasing){
        this.tempClose();
        this.onClickClose.call();
    }
  }
  acceptStopper(stopper){
        this.currentStopper = stopper;

        if(this.closeTimer){
            game.time.events.remove(this.closeTimer);
        }
        this.isOpen = false;
      
        if(!stopper.isWorking){

          this.wallBlocker.body.enable = true;
          // this.leftWallBlocker.body.enable = true;
          // this.rightWallBlocker.body.enable = true;

          // move the wall blocker so the mel bounces at the end of the stopper
          this.wallBlocker.x = this.x + this.wallBlocker.height/16;
        }
  }
  releaseStopper(){
    this.wallBlocker.body.enable = false;

    // put the wall blocker back in original position
    this.wallBlocker.x = this.x + this.wallBlocker.height/3;

    if(this.currentStopper!==null){
        this.currentStopper.fallOff();
    }
    this.isOpen = true;

    this.isReleasing = true;
    game.time.events.add(100/game.globalTimeScale, function(){
      this.isReleasing = false;
    }, this);
    
    if(this.onCloseGate){
      this.onOpenGate.call(null, this);
    }

  }
  tempClose(){
    this.isOpen = false;
    this.wallBlocker.body.enable = true;

    if(this.closeTimer){
        game.time.events.remove(this.closeTimer);
    }

    if(this.onCloseGate){
      this.onCloseGate.call(null, this);
    }
    // this.closeTimer = game.time.events.add(5000, function(){
    //   this.isOpen = true;
    //   this.wallBlocker.body.enable = false;
    // }, this)
  }
  resize(){
    var w = this.scale.x * this.parent.scale.x * 256;
    var h = this.scale.y * this.parent.scale.y * 512;
    this.hitArea.body.setSize(w, h, (512-w)/2, (512-h));
    
    w = this.scale.x * this.parent.scale.x * 512;
    h = this.scale.y * this.parent.scale.y * 512;
    this.wallBlocker.body.setSize(w, h, (512-w)/2, (512-h)/2);
  }

}
