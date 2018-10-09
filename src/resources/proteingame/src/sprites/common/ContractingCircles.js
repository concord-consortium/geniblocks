import Phaser from 'phaser'
import config from '../../config'
import ExpandingCircles from './ExpandingCircles'

export default class extends ExpandingCircles {


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
      sc = 1 - sc%1;

      circle.scale.set((sc * (1-sc))*1.5);

      var a = (.5-sc)*.8;
      if(a<0){
        a = 0;
      }
      circle.alpha = a;
    }

  }

}
