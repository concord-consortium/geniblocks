import Phaser from 'phaser'

export default class extends Phaser.Group {

  constructor ({ game, x, y}) {
    super(game)
    this.game = game;
    this.alpha = 0;
    this.x = 0;
    this.y = 0;


    this.particles = [];
    for(var i = 0; i < 8; i++) {
      var particle = game.add.sprite(x, y, "mouse_trail");
      this.add(particle);
      particle.anchor.set(0.5);
      particle.x = 0;
      particle.y = 0;
      particle.blendMode = 1;
      
      // particles fade out as they get further from the pointer
      particle.alpha = 1/(i+1);
      
      this.particles.push(particle);
    }

    this.offset = 0;

    this.isActive = true;
    this.lastPos = {x:0,y:0};
  }

  update () {
    
    if(this.isActive && this.alpha < 1 && Phaser.Math.distance(game.input.x, game.input.y, this.lastPos.x, this.lastPos.y) > 1){
      this.alpha += (1-this.alpha)*.3;
    }else{
      // fade out if mouse hasn't moved or set to inactive
      this.alpha += (0-this.alpha)*.1;
    }

    for(var i = this.particles.length-1; i>=0; i--){
      var particle = this.particles[i];
      if(i == 0) {
        particle.x = game.input.x;
        particle.y = game.input.y;
      } else {
        var target = this.particles[i-1];
        var dx = target.x - particle.x;
        var dy = target.y - particle.y;
        if(Math.abs(dx) > .5)
          particle.x = (particle.x + target.x) / 2;

        if(Math.abs(dy) > .5)
          particle.y = (particle.y + target.y) / 2;
      }
    }

    this.lastPos = {x:game.input.x, y:game.input.y};
  }

}
