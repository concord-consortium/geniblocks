import Phaser from 'phaser'
import config from '../../config'
import dat from 'dat-gui'


export default class extends Phaser.Group {

  constructor ({ game, x, y, showStart, showTarget}) {
    super(game)
    this.game = game;
    this.alpha = 1;
    this.x = config.SAFE_ZONE_WIDTH - 110;
    this.y = -115;



    this.h = 0.1;//(38)/360;
    this.s = 0.1;
    this.v = 0.1;




    this.drake_sprite = game.make.sprite(0,0,"red_drake");
    this.shine_sprite = game.make.sprite(0,0,"shine_drake");



    //chromoscope
    var geneticColorName = game.cellModel.getGeneticColorName();
    
    //hack to accomodate last minute request:
    var numStarsQuery = game.numInitialStars
    if(numStarsQuery){
      if(parseInt(numStarsQuery)==0){
        geneticColorName="frost";
      } else if(parseInt(numStarsQuery) < 23) {
        geneticColorName="lava";
      }
    }


/*
    //drake_bg
    var geneticDrakeBg = game.add.sprite(0, this.geneticColorChromoscope.y + 148, "chromoscope_circle01");
    geneticDrakeBg.anchor.set(.5, 0);
    geneticDrakeBg.width = geneticDrakeBg.height = 100;
    //create base color swatch
    this.geneticColorBmd = game.make.bitmapData(64, 64);
    this.geneticColorSwatch = game.add.sprite(0,0,this.geneticColorBmd);
    this.geneticColorSwatch.width = 65;
    this.geneticColorSwatch.height = 65;
    this.geneticColorSwatch.x = 3;
    this.geneticColorSwatch.y = geneticDrakeBg.y + 17;
    this.geneticColorSwatch.anchor.setTo(.5, 0)

    //create sparkle layer
    this.geneticColorShineBmd = game.make.bitmapData(64,64);
    this.geneticColorSparkles = game.add.sprite(0,0, this.geneticColorShineBmd);
    this.geneticColorSparkles.width = this.geneticColorSwatch.width;
    this.geneticColorSparkles.height = this.geneticColorSwatch.height;
    this.geneticColorSparkles.x = this.geneticColorSwatch.x;
    this.geneticColorSparkles.y = this.geneticColorSwatch.y;
    this.geneticColorSparkles.anchor.set(.5, 0)

    this.add(geneticDrakeBg);
    this.add(this.geneticColorSwatch);
    this.add(this.geneticColorSparkles);*/
/*
    //colorify
    var geneticHSLA = game.cellModel.getGeneticHSLA();
    this.geneticColorBmd.load(this.drake_sprite,0,0);
    this.geneticColorShineBmd.load(this.shine_sprite,0,0);
    this.geneticColorBmd.shiftHSL(geneticHSLA.h, geneticHSLA.s, geneticHSLA.l);
    this.geneticColorShineBmd.shiftHSL(geneticHSLA.h, geneticHSLA.s, geneticHSLA.l);
    this.geneticColorSparkles.alpha = geneticHSLA.a;

*/







    var labelStyle = { font: "24px yanone_kaffeesatzlight", fill: "#fff", boundsAlignH: "center" }
    
    //Current Color
    var currentLabelText = game.add.text(0, 260, "Current color", labelStyle);
    currentLabelText.setShadow(1, 1, 'rgba(0,0,0,0.8)', 1);
    currentLabelText.anchor.set(.5, 0)

    var currentDrakeBg = game.add.sprite(0, 40, "chromoscope_circle02");
    currentDrakeBg.anchor.set(.5, 0);
    currentDrakeBg.width = currentDrakeBg.height = 220;

    this.currentColorBmd = game.make.bitmapData(128, 128);
    this.currentColorSwatch = game.add.sprite(0,0,this.currentColorBmd);
    this.currentColorSwatch.width = 128;
    this.currentColorSwatch.height = 128;
    this.currentColorSwatch.x = 5;
    this.currentColorSwatch.y = currentDrakeBg.y + 40;
    this.currentColorSwatch.anchor.set(.5, 0);

    this.currentColorShineBmd = game.make.bitmapData(128,128);
    this.currentColorSparkles = game.add.sprite(0,0, this.currentColorShineBmd);
    this.currentColorSparkles.width = this.currentColorSwatch.width;
    this.currentColorSparkles.height = this.currentColorSwatch.height;
    this.currentColorSparkles.x = this.currentColorSwatch.x;
    this.currentColorSparkles.y = this.currentColorSwatch.y;
    this.currentColorSparkles.anchor.set(.5, 0);

    this.add(currentDrakeBg);
    this.add(this.currentColorSwatch);
    this.add(this.currentColorSparkles);
    this.add(currentLabelText);

    //this color will be set dynamically by the activity



    if(showStart) {
      //start color
      this.geneticColorChromoscope = game.add.sprite(0, 400, "chromoscope_" + geneticColorName);
      this.geneticColorChromoscope.scale.set(.8);
      this.geneticColorChromoscope.anchor.set(.5, 0)
      this.add(this.geneticColorChromoscope);

      //label
      var geneticLabelText = game.add.text(0, 530, "Start", labelStyle);
      geneticLabelText.setShadow(1, 1, 'rgba(0,0,0,0.8)', 1);
      geneticLabelText.anchor.set(.5, 0)
      this.add(geneticLabelText);
    }

    if(showTarget) {
      /// ----------------
      //in between
      var arrowDown = game.add.sprite(0, 0, "chromoscope_arrow_down");
      arrowDown.anchor.set(.5, 0);
      arrowDown.width = arrowDown.height = 60;
      arrowDown.y = 555;
      this.add(arrowDown);
      /// ----------------




      //label
      var targetLabelText = game.add.text(0, 760, "Target", labelStyle);
      targetLabelText.setShadow(1, 1, 'rgba(0,0,0,0.8)', 1);
      targetLabelText.anchor.set(.5, 0)


      //chromoscope
      var targetColorName = game.finalTarget;//game.cellModel.get("target_color");
      this.targetColorChromoscope = game.add.sprite(0, 630, "chromoscope_" + targetColorName);
      this.targetColorChromoscope.scale.set(.8);
      this.targetColorChromoscope.anchor.set(.5, 0)

      this.add(this.targetColorChromoscope);
      this.add(targetLabelText);
    }


    this.scale.set(.95);
    this.y+= 160;

    // Create highlight shape
    this.outline = game.make.graphics();
    var bounds = this.getLocalBounds();
    this.outline.beginFill(0xFFCC66, 0.8);
    this.outline.drawRoundedRect(-bounds.width/2 - 8, 0, bounds.width + 12, bounds.height + 40, 40);
  }

  updateColors(stateName, value){
    var currentHSLA = game.cellModel.getGeneticHSLA(stateName, value);

    this.currentColorBmd.load(this.drake_sprite);
    this.currentColorBmd.shiftHSL(currentHSLA.h, currentHSLA.s, currentHSLA.l);

    this.currentColorShineBmd.load(this.shine_sprite);
    this.currentColorShineBmd.shiftHSL(currentHSLA.h, currentHSLA.s, currentHSLA.l);

    this.currentColorSparkles.alpha = currentHSLA.a;

  }

  forceUpdateStartColor(stateName, value){
    var currentHSLA = game.cellModel.getGeneticHSLA(stateName, value);
    /*
    this.geneticColorBmd.load(this.drake_sprite);
    this.geneticColorBmd.shiftHSL(currentHSLA.h, currentHSLA.s, currentHSLA.l);

    this.geneticColorShineBmd.load(this.shine_sprite);
    this.geneticColorShineBmd.shiftHSL(currentHSLA.h, currentHSLA.s, currentHSLA.l);

    this.geneticColorSparkles.alpha = currentHSLA.a;
    */
  }

  setHighlight(on) {
    if(on) {
      this.outline.alpha = 0.2;
      this.addChildAt(this.outline, 0);
      this.game.add.tween(this.outline).to( { alpha: 0.6 }, 800, Phaser.Easing.Linear.In, true, 0.2, 400, true);
    } 
    else {
      this.removeChild(this.outline);
      this.outline.alpha = 0;
    }
  }
}
