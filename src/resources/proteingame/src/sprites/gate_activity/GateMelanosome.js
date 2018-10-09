import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, targetGroup, limit, onEscapeCallback, lifetime, onDeathCallback, drag=1, image="gate_melanosome" }) {
    super(game, x, y, image)
    this.game = game;
    this.limit = limit;
  	// this.tint = 0xB39483;
  	this.alpha = 1;
    this.width = 64;
    this.height = 64;
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.velocity.x = 100*game.globalTimeScale;
    this.body.velocity.y = 0;
    this.body.bounce.set(.75);
    this.body.gravity.x = 9.8;
    // this.body.gravity.x = .5;
    this.body.drag.set(drag*game.globalTimeScale);
    targetGroup.add(this);
    this.resize();
    this.hasPassed = false;



    this.maxLifetime = 60000;
    if(lifetime){
      this.lifetime = lifetime;
    }else{
      this.lifetime = 60000;
    }

    // this.limit = game.add.sprite(0,0,"square");
    // this.limit.width = 1000;
    // this.limit.height = 5;

    this.onEscapeCallback = onEscapeCallback;
    this.onDeathCallback = onDeathCallback;
    // game.add.tween(this).to({"alpha": 1}, 1000).start();

    // game.time.events.add(1100, function(){
    //   game.add.tween(this).to({"alpha": 0}, this.lifetime).start();
    //   game.time.events.add(this.lifetime + 10, function(){
    //     this.handleDeath();
    //   }, this);
    // }, this);
  }

  update () {
    this.body.gravity.x = 9.8 * game.globalTimeScale;

    if(this.wasPushedBack && this.body.velocity.x > 0) {
      game.time.events.remove(this.pushBackTimer);
      this.wasPushedBack = false;
    } else if(this.wasPushedForward && this.body.velocity.x < 0) {
      this.wasPushedForward = false;
    }

    // this.limit.x = 100;
    // this.limit.y = lim;
    if(this.x > this.limit && this.hasPassed !== true){
      this.handlePass ();
    }

    this.alpha = Math.min(1, (this.lifetime / this.maxLifetime)+.1);
    this.lifetime-=game.time.physicsElapsed*1000*game.globalTimeScale;

    if(this.lifetime<=0){
      this.handleDeath();
    }
  }


  // keep track so we know if it was pushed through the gate
  pushForward(){
    this.wasPushedForward = true;
  }

  // or pushed toward nucleus
  pushBack(){
    if(this.wasPushedBack && this.pushBackTimer){
      game.time.events.remove(this.pushBackTimer);
    }
    this.wasPushedBack = true;
    this.pushBackTimer = game.time.events.add(4000, function(){
      this.wasPushedBack = false;
    }, this);
  }

  handlePass(){
    // game.tweens.removeFrom(this);
    // this.alpha = 1;
      this.body.checkCollision.none = true
      this.hasPassed = true;
      this.onEscapeCallback.call(null, this.wasPushedForward);
      this.body.drag.set(150);
      this.body.velocity.x += ((50 * game.rnd.frac())-25) * game.globalTimeScale;
      // this.tint = 0xff0000;

      // game.add.tween(this).to({"alpha": 0}, this.lifetime).start();
      // game.time.events.add(this.lifetime + 10, function(){
      //   this.handleDeath();
      // }, this);
  }
  handleDeath(){
      this.onDeathCallback.call(null, this);
      this.destroy();
    // game.destroy(this);
  }
  resize(){
    if(!this.parent) {
      return;
    }
    var w = this.parent.scale.x * this.width * 2;
    var h = this.parent.scale.y * this.height * 2;
    this.body.setSize(w, h, 0, 0);
  }



}
