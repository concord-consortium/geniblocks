import Phaser from 'phaser'
import config from '../../config'

export default class extends Phaser.Group {

  constructor ({ game, x, y, width, targetGroup, blobTint, blobAlpha, blobBlend, bloomAlpha}) {
    super(game)
    this.game = game;
    this.alpha = 1;
    this.x = x;
    this.y = y;
    this.blobAlpha = blobAlpha;
    this.bloomAlpha = bloomAlpha;
    this.targetGroup = targetGroup;
    targetGroup.add(this);

    this.smallGroup = game.add.group();
    this.medGroup = game.add.group();
    this.lgGroup = game.add.group();

    this.add(this.smallGroup);
    this.add(this.medGroup);
    this.add(this.lgGroup);

    this.blobBlend = blobBlend;


    this.generateBackground(blobTint);




  }

  update () {
    this.smallGroup.x = Math.sin((game.time.time * .0001)) * 500;
    this.medGroup.x =   Math.sin((game.time.time * .0000876) + Math.PI/3) * 500;
    this.lgGroup.x =    Math.sin((game.time.time * .0000745) + (Math.PI * (2/3))) * 500;
  }

  resize(){
    // var w = this.scale.x * this.parent.scale.x * 256;
    // var h = this.scale.y * this.parent.scale.y * 512;
    // this.hitArea.body.setSize(w, h, (512-w)/2, (512-h));
    
    // w = this.scale.x * this.parent.scale.x * 768;
    // h = this.scale.y * this.parent.scale.y * 512 * 2;
    // this.wallBlocker.body.setSize(w, h, (512-w)/2, (512-h));
  }
  generateBackground(blobTint){
    this.backgroundBloom = game.add.sprite(config.SAFE_ZONE_WIDTH/2,config.SAFE_ZONE_HEIGHT/2, "white_radial_gradient");
    this.backgroundBloom.tint = 0xB19C91;
    this.backgroundBloom.scale.set(4);
    this.backgroundBloom.anchor.set(.5);
    this.backgroundBloom.alpha = this.bloomAlpha;
    this.backgroundBloom.blendMode = PIXI.blendModes.ADD;
    this.add(this.backgroundBloom);


    var width = config.SAFE_ZONE_WIDTH * 1.5;
    var height = config.SAFE_ZONE_HEIGHT * 1.5;
    for(var i = 0;i<10;i++){


      var rnd_x = ((game.rnd.frac())*width);
      var rnd_y = ((game.rnd.frac())*height);

      var blob = game.add.sprite(rnd_x, rnd_y, "small_white_blur");
      blob.scale.set((game.rnd.frac() * 1.6) + 3.2)
      blob.tint = blobTint;
      blob.alpha = .4 * this.blobAlpha;
      blob.anchor.set(.5);
      blob.blendMode = this.blobBlend;
      this.targetGroup.add(blob);
    }
    for(var i = 0;i<10;i++){
      
      var rnd_x = ((game.rnd.frac())*width);
      var rnd_y = ((game.rnd.frac())*height);

      var blob = game.add.sprite(rnd_x, rnd_y, "small_white_blur");
      blob.scale.set((game.rnd.frac() * 1) + 1)
      blob.tint = blobTint;
      blob.alpha = .3 * this.blobAlpha;
      blob.anchor.set(.5);
      blob.blendMode = this.blobBlend;
      this.targetGroup.add(blob);
    }

    for(var i = 0;i<10;i++){
      
      var rnd_x = ((game.rnd.frac())*width);
      var rnd_y = ((game.rnd.frac())*height);

      var blob = game.add.sprite(rnd_x, rnd_y, "small_white_blur");
      blob.scale.set((game.rnd.frac() * .5) + .5)
      blob.tint = blobTint;
      blob.alpha = .2 * this.blobAlpha;
      blob.anchor.set(.5);
      blob.blendMode = this.blobBlend;
      this.targetGroup.add(blob);
    }



  }

}
