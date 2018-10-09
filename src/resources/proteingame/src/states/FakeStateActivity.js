/* globals __DEV__ */
import Phaser from 'phaser'
import dat from 'dat-gui'
import SizeMelanosome from '../sprites/size_activity/SizeMelanosome'
import Tyr from '../sprites/size_activity/Tyr'
import Trp from '../sprites/size_activity/Trp'
import Tyrosine from '../sprites/size_activity/Tyrosine'
import Vignette from '../tools/filters/Vignette'
import FilmGrain from '../tools/filters/FilmGrain'
import config from '../config'

export default class extends Phaser.State {
  init (onFinishCallback) {
    this.onFinishCallback = onFinishCallback

  }
  // preload () {}

  create () {





    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.stage.backgroundColor = '#aa3333';
    this.world = game.add.group();



    if(game.datgui){
      game.datgui.destroy();
    }


    game.datgui = new dat.GUI({load: JSON});
    game.datgui.remember(this);

    game.datgui.add(this, "gotoMotorActivity");



    this.timer = this.game.time.create(false);
    //this.spawnTrpsForever();
    this.timer.start();

    this.resize();



    this.thing = this.game.add.graphics(0, 0);
    
    this.thing.clear();
    this.thing.clearDirty = true;
    this.thing.dirty = true;


    this.thing.beginFill(0xFF3300, 1);
    this.thing.lineStyle(10, 0xffd900, 1);

    // draw a shape
    this.thing.moveTo(50,50);
    this.thing.lineTo(250, 50);
    this.thing.lineTo(100, 100);
    this.thing.lineTo(250, 220);
    this.thing.lineTo(50, 220);
    this.thing.lineTo(50, 50);
    this.thing.endFill();

    console.log(this.thing);
    this.thing.clearDirty = true;
    this.thing.dirty = true;


  }

  update(){


    // this.thing.clearDirty = true;
    // this.thing.dirty = true;

    // this.thing.clear();
    // this.thing.clearDirty = true;
    // this.thing.dirty = true;


    // this.thing.beginFill(0xFF3300);
    // this.thing.lineStyle(10, 0xffd900, 1);

    // // draw a shape
    // this.thing.moveTo(50,50);
    // this.thing.lineTo(250, 50);
    // this.thing.lineTo(100, 100);
    // this.thing.lineTo(250, 220);
    // this.thing.lineTo(50, 220);
    // this.thing.lineTo(50, 50);
    // this.thing.endFill();

    //     this.thing.clearDirty = true;
    // this.thing.dirty = true;
  }


  render () {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.mushroom, 32, 32)
    // }
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
  gotoState(stateName){
    this.state.start(stateName, true, false);
  }
}
