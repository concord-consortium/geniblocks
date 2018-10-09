/* globals __DEV__ */
import Phaser from 'phaser'
import dat from 'dat-gui'
import SizeMelanosome from '../sprites/size_activity/SizeMelanosome'
import config from '../config'

export default class extends Phaser.State {
  init (onFinishCallback) {
    this.onFinishCallback = onFinishCallback

  }
  // preload () {}

  create () {

    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.stage.backgroundColor = '#223041';
    this.world = game.add.group();



    if(game.datgui){
      game.datgui.destroy();
    }
    game.datgui = new dat.GUI({load: JSON});
    game.datgui.remember(this);
    game.datgui.add(this, "gotoSizeActivity");
    game.datgui.add(this, "gotoMotorActivity");

    this.timer = this.game.time.create(false);
    this.timer.start();


    this.resize();
  }





  update(){

  }


  render () {

  }
  resize(){

    var lGameScale=Math.round(10000 * Math.min(this.game.width/config.SAFE_ZONE_WIDTH,this.game.height / config.SAFE_ZONE_HEIGHT)) / 10000;
    this.world.scale.setTo (lGameScale,lGameScale);
    this.world.x =(this.game.width-config.SAFE_ZONE_WIDTH*lGameScale)/2;
    this.world.y =(this.game.height-config.SAFE_ZONE_HEIGHT*lGameScale)/2;

  }
  gotoMotorActivity(){
    this.gotoState("MotorActivity");
  }
  gotoSizeActivity(){
    this.gotoState("SizeActivity");
  }
  gotoState(stateName){
    this.state.start(stateName, true, false);
  }
}
