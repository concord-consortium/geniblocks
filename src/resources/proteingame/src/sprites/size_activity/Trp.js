import Phaser from 'phaser'
import { clamp } from '../../utils'

export default class extends Phaser.Group {

  constructor ({ game, x, y, direction, axleFlowerBmd, melanosome, initialGroup, working, onConnect, onFalloff, onGrab }) {
    super(game);
  	initialGroup.add(this);

  	this.game = game;
  	this.x = x;
  	this.y = y;
  	this.v_x = 0;
  	this.v_y = 0;
    this.angle = game.rnd.frac()*360;
  	this.w = 90;
  	this.alpha = 0;
  	this.tyr = null;
    this.melanosome = melanosome;
    this.isFloating = true;
    this.isBeingDragged = false;
    this.numUses = 0;
    this.maxUses = 1;
    this.maxTrpFlowerSize = 32;
    this.minTrpFlowerSize = 10;
    this.direction = direction;
    this.hasFallenOff = false;

    this.onConnect = onConnect;
    this.onFalloff = onFalloff;
    this.onGrab = onGrab;

    var targetTexture = "trp_01";
    this.numCorrectAxles = 1;

    this.isWorking = working;


    if(working){
      targetTexture = "trp_02";
    }else{
      targetTexture = "trp_01";
    }







  	this.tube = game.add.sprite(0,0, targetTexture);
  	this.tube.width = this.w;
  	this.tube.height = this.w*.25;
  	this.tube.anchor.set(.5);
  	this.add(this.tube);



    //create the TRP from pieces, rather than one solid image
    // this.bar = game.add.sprite(0,0, "trp_bar");
    // this.bar.width = this.w*.25;
    // this.bar.height = this.w;
    // this.bar.angle = 90;
    // this.bar.anchor.set(.5);
    // this.add(this.bar);

    // this.flower1 = game.add.sprite(0,0,"trp_flower");
    // this.flower1.width = this.maxTrpFlowerSize;
    // this.flower1.height = this.maxTrpFlowerSize;
    // this.flower1.anchor.set(.5);
    // this.flower1.x = (this.w/2);
    // this.add(this.flower1);
    
    // this.flower2 = game.add.sprite(0,0,"trp_flower");
    // this.flower2.width = this.maxTrpFlowerSize;
    // this.flower2.height = this.maxTrpFlowerSize;
    // this.flower2.anchor.set(.5);
    // this.flower2.x = -(this.w/2);
    // this.add(this.flower2);




    // if(this.isWorking == false){
    //   this.flower1.tint = this.flower2.tint = this.bar.tint = Phaser.Color.interpolateColor(0x885555, 0xffffff, 1, .2);
    // }



  	this.fakeHitZone = game.add.sprite(x, y, 'square', null, this);
  	this.fakeHitZone.width = this.w;
  	this.fakeHitZone.height = this.w;
  	this.fakeHitZone.inputEnabled=true;
  	this.fakeHitZone.input.enableDrag();
  	this.fakeHitZone.anchor.set(.5);
  	this.fakeHitZone.alpha = 0;
  	this.fakeHitZone.trpRef = this;  
  	game.physics.enable(this.fakeHitZone, Phaser.Physics.ARCADE);

    this.width *= -1;
    this.height *= -1;

    this.fakeHitZone.body.velocity.x = 30 * this.direction.x;
    this.fakeHitZone.body.velocity.y = 30 * this.direction.y;

    this.parent.add(this.fakeHitZone);
    game.add.tween(this).to({"alpha": 1}, 500).start();

    this.fakeHitZone.events.onDragStart.add(function (sprite, pointer, x, y) {
      this.fakeHitZone.body.velocity.x = 0;
      this.fakeHitZone.body.velocity.y = 0;

      this.onGrab.call();
      this.isBeingDragged = true;
    }, this);

    this.fakeHitZone.events.onDragStop.add(function (sprite, pointer, x, y) {
      this.fakeHitZone.body.velocity.x = 30 * this.direction.x;
      this.fakeHitZone.body.velocity.y = 30 * this.direction.y;

      this.isBeingDragged = false;
    }, this);

    this.fakeHitZone.body.drag.set(10);


    this.fakeHitZone.events.onDragUpdate.add(function (sprite, pointer, x, y) {
          var pos = sprite.game.input.getLocalPosition(sprite.parent, pointer);
          if (sprite.hitArea) {
              sprite.x = pos.x;
              sprite.y = pos.y;
          } else {
              sprite.x = pos.x;
              sprite.y = pos.y;
          }
    }, this.fakeHitZone);

    // this.fakeHitZone.events.onInputDown.add(function (sprite, pointer, x, y) {
    //   this.fallOffTyr();
    // }, this);
  }



  fallOffTyr(){
    if(this.connecting_tyr && this.hasFallenOff !== true){
      this.hasFallenOff = true;
      var v_x = Math.sin(this.rotation);
      var v_y = Math.cos(this.rotation);
      var target_x = this.x + (v_x*-200) + 50;
      var target_y = this.y - (v_y*-200);
      game.add.tween(this).to({"alpha": 0, "x": target_x, "y": target_y}, 1000/game.globalTimeScale).start();
      
      if(this.onFalloff){
        this.onFalloff.call();
      }
      this.connecting_tyr.connecting_trp = null;




      game.time.events.add(1000/game.globalTimeScale, function(){
        this.fakeHitZone.destroy();
        this.destroy();
      }, this);

    }
  }

  connectToTyr(tyr){
  		this.fakeHitZone.input.draggable = false;
      this.fakeHitZone.input.enabled = false;
  		this.isFloating = false;
  		this.connecting_tyr = tyr;

  		tyr.connecting_trp = this;
  		tyr.isSeparate = false;
      tyr.isConnecting = true;


      if(this.onConnect){
        this.onConnect.call(undefined, this);
      }
      this.isBeingDragged = false;

      game.time.events.add(1000/game.globalTimeScale, function(){

        tyr.isConnecting = false;

      }, this);



  		// tyr.add(this);

  		// tyr.add(this);
  		// this.fakeHitZone.x = (tyr.alphaBlob.x + tyr.betaBlob.x)/2;
  		// this.angle = tyr.angle;
  		// tyr.add(this.fakeHitZone);
  		// this.fakeHitZone.x = tyr.alphaBlob.x;
  		// this.fakeHitZone.y = tyr.alphaBlob.y;

  }
  update () {



    // var usePct = 1 - (this.numUses/this.maxUses);
    // usePct = clamp(usePct, 0, 1);


    // this.flower1.width = this.flower1.height = this.flower2.width = this.flower2.height 
    //   = ((this.maxTrpFlowerSize - this.minTrpFlowerSize)*usePct) + this.minTrpFlowerSize;

    // this.flower1.tint = this.flower2.tint = this.bar.tint = Phaser.Color.interpolateColor(0x885555, 0xffffff, 1, usePct);










  	if(this.isFloating){


      var outOfBoundsAcceleration = .01 * game.globalTimeScale;
      var floatSpeed = 20 * game.globalTimeScale;
      var rotationSpeed = .02 * game.globalTimeScale;
      //todo, performance: calculate these values only on resize or state change
      var dist = this.parent.scale.x * Phaser.Math.distance(this.x, this.y, this.melanosome.x, this.melanosome.y);
      var minDist = (this.melanosome.width * this.melanosome.parent.scale.x * .5)+16;
      var maxDist = 960 * this.parent.scale.x;
      var superMaxDist = 480 * this.parent.scale.x;



        if(dist>maxDist){
          this.fakeHitZone.body.velocity.x += (this.melanosome.x - this.x) * outOfBoundsAcceleration;
          this.fakeHitZone.body.velocity.y += (this.melanosome.y - this.y) * outOfBoundsAcceleration;
        }
        else if(dist<minDist){
          outOfBoundsAcceleration = .25;
          this.fakeHitZone.body.velocity.x = (this.x - this.melanosome.x) * outOfBoundsAcceleration;
          this.fakeHitZone.body.velocity.y = (this.y - this.melanosome.y) * outOfBoundsAcceleration;
        
          this.fakeHitZone.input.isDragged = false;
          this.fakeHitZone.input.disableDrag();
        }
        else{
          this.fakeHitZone.input.enableDrag();

          // this.fakeHitZone.body.velocity.x += 1;
          this.fakeHitZone.body.velocity.y += (game.rnd.frac() - .5)*floatSpeed;
          this.fakeHitZone.body.velocity.x += (game.rnd.frac() - .5)*floatSpeed;

          // var norm = this.body.velocity.normalize();
          // this.body.velocity.x = norm.x*100;// = this.body.velocity.normalize();
          // this.body.velocity.y = norm.y*100;// = this.body.velocity.normalize();
        }

        var speedLim = 400 * game.globalTimeScale;
        this.fakeHitZone.body.velocity.x = game.math.clamp(this.fakeHitZone.body.velocity.x, -speedLim, speedLim);
        this.fakeHitZone.body.velocity.y = game.math.clamp(this.fakeHitZone.body.velocity.y, -speedLim, speedLim);

        this.x = this.fakeHitZone.x;
        this.y = this.fakeHitZone.y;

  	}else if(this.connecting_tyr!=null){



      if(this.isWorking !== true && this.numUses>this.maxUses){
        this.fallOffTyr();
      }





      var targetAngle = this.connecting_tyr.angle;
  		this.angle += (targetAngle-this.angle)*.1;


      //it wants to be halfway between the two tyr blobs
      //todo: make this less bad
      var target_x = (((this.connecting_tyr.alphaBlob.world.x+this.connecting_tyr.betaBlob.world.x)/2)/this.parent.scale.x) - (this.parent.x/this.parent.scale.x);
      var target_y = (((this.connecting_tyr.alphaBlob.world.y+this.connecting_tyr.betaBlob.world.y)/2)/this.parent.scale.y) - (this.parent.y/this.parent.scale.y);
  		this.x += (target_x - this.x) * .08;
  		this.y += (target_y - this.y) * .08;

      if(this.isWorking !== true){
        this.x += (game.rnd.frac() - .5) * 5 * this.numUses/this.maxUses;
        this.y += (game.rnd.frac() - .5) * 5 * this.numUses/this.maxUses;
      }

  		this.fakeHitZone.position = this.position;
      this.fakeHitZone.body.velocity.x = 0;
      this.fakeHitZone.body.velocity.y = 0;
  	}

  }

}
