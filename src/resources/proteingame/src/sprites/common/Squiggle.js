import Phaser from 'phaser'
import config from '../../config'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, path_points, thickness, spacing, direction, asset, color, alpha, alphaFade }) {
    super(game, x, y, "")
  	this.game = game;
  	this.tint = 0xffffff;
  	this.alpha = alpha ? alpha : 1;
    this.alphaFade = alphaFade;
  	this.anchor.set(0);
  	this.inputEnabled = true;
  	this.thickness = thickness || .05;
    this.spacing = spacing || 3;

  this.color = color || "#EACF8D";

	this.direction = direction;
	// this.input.enableDrag(true);
	// this.tyrs=[];




	  this.points = path_points; 

    // this.bmd = game.add.bitmapData(config.SAFE_ZONE_WIDTH, config.SAFE_ZONE_HEIGHT);
    // this.loadTexture(this.bmd);


    // this.draw();
  }
  draw(){
    this.drawToBmd(this.bmd);
  }
  drawToBmd(bmd){
    var x = (1 / config.SAFE_ZONE_WIDTH) * this.spacing;
    var ct = 0;

    var lineColor = Phaser.Color.hexToColor(this.color);

    for (var i = 0; i <= 1; i += (x))
    {

      var extremeness = Math.abs(i-.5);
      extremeness*=2.1 * this.alphaFade;
      var alpha = (1 - (extremeness));
      alpha *= this.alpha;
      var jitter_x = 0;//game.rnd.frac() * 1.5;
      var jitter_y = 0;//game.rnd.frac() * 1.5;

      // jitter_x += Math.sin(i*50);
      // jitter_y += Math.cos(i*50);

      var p = this.getPositionAtOffset(i);

      var thicknessJitter = 0;//game.rnd.frac()*2;

      // var circ = this.game.add.sprite(p.x, p.y, 'circle');
      // circ.scale.set(this.thickness);
      // this.world.add(circ);

      // var totalThickness = Math.max((this.thickness + thicknessJitter)*foo, this.thickness/2);
      var totalThickness = (this.thickness + thicknessJitter);


      var colorString = "rgba(" + lineColor.r + ", " + lineColor.g + ", " + lineColor.b + ", " + alpha + ")";
      bmd.circle(p.x + jitter_x, p.y + jitter_y, totalThickness, colorString);

    }
  }
  update () {
	// var delta = (this.tyrs.length*this.game.gameData.size_tyr_growth_impact)-10;
	// var newScale = this.scale.x + (.0002 * delta);
	// // Clamp scale between 0.1 and 3.
	// newScale = Math.max( newScale, 0.1 );
	// newScale = Math.min( newScale, 3);

	// this.scale.x = newScale;
	// this.scale.y = newScale;
  }

  getPositionAtOffset(offset){
  	var px = this.game.math.bezierInterpolation(this.points.x, offset);
	  var py = this.game.math.bezierInterpolation(this.points.y, offset);
	  return {"x": px, "y": py};
  }

}
