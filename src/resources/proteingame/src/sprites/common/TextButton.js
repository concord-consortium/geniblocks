import Phaser from 'phaser'

export default class extends Phaser.Group {
  constructor ({ game, x, y, asset, label, actionOnClick, context }) {
  	super(game);
    this.x = x;
    this.y = y;

    this.actionOnClick = actionOnClick;
    this.context = context;
    this.btn = game.add.button(0, 0, asset, this.handleClick, this, 0, 0, 1 )
    this.btn.tint = 0x333;
    this.btn.anchor.set(.5);
    this.add(this.btn);


	  var style = { font: "48px yanone_kaffeesatzlight", fill: "#333", boundsAlignH: "center", boundsAlignV: "middle" };
    var text = game.add.text(0,0, label, style);
    text.anchor.set(.5);
    this.add(text);

    // this.SFX_UI_Button_Click = this.game.add.audio("SFX_UI_Button_Click");

  }
  handleClick(){
    this.actionOnClick.call(this.context);
    // this.SFX_UI_Button_Click.play();
  }
}