import Phaser from 'phaser'
import config from '../../config'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, color}) {
    super(game,x,y, "square");
    this.game = game;
    this.alpha = 1;
    this.x = game.width/2;
    this.y = game.height/2;
    this.width = game.width;
    this.height = game.height;
    this.anchor.set(.5);

    this.tint = color;

    this.myTween = null;


    this.fadeIn();
  }

  update () {




  }

  fadeIn(){
    game.add.tween(this).to({"alpha": 0}, 1000).start();
  }
  fadeOut(){
    game.add.tween(this).to({"alpha": 0}, 1000).start();

  }

  resize(){

  }

}
