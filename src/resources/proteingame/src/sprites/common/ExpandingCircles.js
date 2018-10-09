import Phaser from 'phaser'
import config from '../../config'

export default class extends Phaser.Group {

  constructor ({ game, x, y}) {
    super(game)
    this.game = game;
    this.alpha = 0;
    this.x = x;
    this.y = y;


    this.circles = [];
    for(var i = 0;i<15;i++){
      var newCircle = game.add.sprite(x, y, "circle_outline");
      this.add(newCircle);
      newCircle.anchor.set(.5);
      newCircle.x = 0;
      newCircle.y = 0;
      newCircle.blendMode = 1;
      this.circles.push(newCircle);
    }

    this.offset = 0;

    this.isActive = false;

    this.forcefieldSfx = game.add.sound("forcefield");
    this.forcefieldSfx.loop = true;
    this.forcefieldSfx.volume = 0;
    this.forcefieldSfx.play();


  }

  update () {

    if(this.isActive){
      this.alpha += (1-this.alpha)*.1;
    }else{
      this.alpha += (0-this.alpha)*.1;
    }
    this.forcefieldSfx.volume = Math.max((this.alpha/3) - .2, 0);

    for(var i = 0;i<this.circles.length;i++){
      
      var circle = this.circles[i];
      var pct = i/this.circles.length;
      this.offset += game.time.elapsed * .000025;

      var sc = pct + (this.offset);
      sc = sc%1;

      circle.scale.set((sc * (1-sc))*1.5);

      var a = (.5-sc)*.8;
      if(a<0){
        a = 0;
      }
      circle.alpha = a;
    }


  }

  resize(){

  }

}
