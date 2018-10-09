import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, direction, asset }) {
    super(game, x, y, asset)
	this.game = game;
	this.tint = 0xffffff;
	this.alpha = .75;
	this.anchor.set(.5);
	this.inputEnabled = true;

	// this.input.enableDrag(true);
	// this.tyrs=[];

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

}
