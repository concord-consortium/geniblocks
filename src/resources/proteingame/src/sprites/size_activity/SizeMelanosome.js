import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, maxStars, zoom=1 }) {
    super(game, x, y, "sizeMelanosome")
  	this.game = game;
  	this.tint = 0xB39483;
  	this.alpha = 1;
  	this.anchor.set(.5);
    this.size = .5;
    this.zoom = zoom;
	  this.numStars = 0;
    this.maxStars = maxStars ? maxStars : 29;
    this.halfMaxStars = this.maxStars/2;
  	this.scale.set(this.size);
	  this.tyrs=[];

    this.smallColor = 0xFFFFFF;
    this.midColor = 0xFFB486;
    this.largeColor = 0x544440;

    this.smallStarColor = 0xFFFFFF;
    this.midStarColor = 0xFFA486;
    this.largeStarColor = 0x665b57;


    this.starColor = this.midStarColor;

    this.outline = game.add.sprite(0,0,"sizeMelanosomeOutline");
    this.outline.x = this.x;
    this.outline.y = this.y;
    this.outline.anchor.set(.5);
    this.outline.alpha = .5;
  }

  update () {
    if(this.outline.parent == game.world && this.parent){
      this.parent.add(this.outline);
    }

  	this.size = this.getSize();
  	this.width += (this.size - this.width)*.1;
  	this.height+= (this.size - this.height)*.1;

    this.outline.width = this.outline.height = this.width;


    var targetColor = this.smallColor;
    if(this.numStars<this.halfMaxStars){
      var pos = Math.min(this.numStars/this.halfMaxStars, 1);
      targetColor = Phaser.Color.interpolateColor(this.smallColor, this.midColor, 1, pos);
      this.starColor = Phaser.Color.interpolateColor(this.smallStarColor, this.midStarColor, 1, pos);
    }else{
      var pos = Math.min((this.numStars-this.halfMaxStars)/this.halfMaxStars, 1);
      targetColor = Phaser.Color.interpolateColor(this.midColor, this.largeColor, 1, pos);
      this.starColor = Phaser.Color.interpolateColor(this.midStarColor, this.largeStarColor, 1, pos);
    }

    this.tint = targetColor;

  }

  getSize(){
  	return this.starsToSize(this.numStars) * this.zoom;
  }
  starsToSize(numStars){
    var min = 256;
    var max = 666;
    var expanse = max-min;
    return Math.min(min + ((numStars/this.maxStars)*expanse), max);
  }
  jumpToSize(){
  	this.size = this.getSize();
  	this.width = this.height = this.size;
    this.outline.width = this.outline.height = this.size;

    var targetColor = this.smallColor;
    if(this.numStars<this.halfMaxStars){
      var pos = Math.min(this.numStars/this.halfMaxStars, 1);
      targetColor = Phaser.Color.interpolateColor(this.smallColor, this.midColor, 1, pos);
      this.starColor = Phaser.Color.interpolateColor(this.smallStarColor, this.midStarColor, 1, pos);
    }else{
      var pos = Math.min((this.numStars-this.halfMaxStars)/this.halfMaxStars, 1);
      targetColor = Phaser.Color.interpolateColor(this.midColor, this.largeColor, 1, pos);
      this.starColor = Phaser.Color.interpolateColor(this.midStarColor, this.largeStarColor, 1, pos);
    }

    this.tint = targetColor;
  }

}
