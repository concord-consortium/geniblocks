/* globals __DEV__ */
import Phaser from 'phaser'
import dat from 'dat-gui'
import iframePhone from 'iframe-phone'
import _ from 'underscore'
import $ from 'jquery'
import TextButton from '../sprites/common/TextButton'
import BackgroundBlobs from '../sprites/common/BackgroundBlobs'
import ExpandingCircles from '../sprites/common/ExpandingCircles'
import MouseGlow from '../sprites/common/MouseGlow'
import ColorIndicators from '../sprites/common/ColorIndicators'
import FTUEDisplay from '../sprites/common/FTUEDisplay'
import SizeMelanosome from '../sprites/size_activity/SizeMelanosome'
import Tyr from '../sprites/size_activity/Tyr'
import Trp from '../sprites/size_activity/Trp'
import Tyrosine from '../sprites/size_activity/Tyrosine'
import TyrosineDisc from '../sprites/size_activity/TyrosineDisc'
import Vignette from '../tools/filters/Vignette'
import config from '../config'
import { rgbToHex } from '../utils'

export default class extends Phaser.State {
  init (onFinishCallback) {

    this.onFinishCallback = onFinishCallback

  }
  
  preload () {}

  create () {
    //old habits die hard...
    var that = this;

    this.phone = new iframePhone.getIFrameEndpoint();
    this.phone.initialize();

    this.trps = [];
    this.tyrs = [];
    this.tyrosines = [];
    this.tyrosineStars = [];

    this.trpCt = 0;
    this.maxTrp = game.ftueData && game.ftueData.trp === false ? 0 : 15;
    this.size_trp_count = .2;
    this.floatingTyrosineCount = 0;
    this.maxFloatingTyrosineCount = game.ftueData && game.ftueData.tyrosine === false ? 0 : 150;
    this.tyrosineSpawnedPerSecond = 20;
    this.trpSpawnedPerSecond = 1;
    this.maxStars = game.cellModel.get("maxStars");

    // action data tracking
    game.actions.track([
      "disc_clicked", 
      "disc_destroyed", 
      "working_protein_assembled", 
      "broken_protein_assembled",
      "tri_pushed_into_small_gear",
      "protein_broken", 
      "barbell_grabbed"
    ]);
    
    this.bgStartColor = 0x223041;


    
    this.starMakeSfx = game.add.audio("pleasing_ding");
    this.starBreakSfx = game.add.audio("popout");
    this.starPokeSfx = game.add.audio("blocker_insert");

    this.trpAttachSfx = game.add.audio("dumbbell_attach");
    this.trpFalloffSfx = game.add.audio("dumbbell_break");
    this.tyrBreakApartSfx = game.add.audio("gate_close");

    this.winSfx = game.add.audio("win");

    this.trpAttachSfx.volume = .3;
    this.trpFalloffSfx.volume = .3;



    this.updateTYRAlleles();
    this.updateTRPAlleles();
    game.cellModel.on("change", this.updateTRPAlleles, this);
    game.cellModel.on("change", this.updateTYRAlleles, this);

    this.target_num_stars = game.cellModel.target_state.numStars;




    this.generateTextures();


    this.backgroundBlobsGroup = game.add.group();
    this.backgroundGroup = game.add.group();
    this.sizeMelanosomeGroup = game.add.group();


    this.starFactoryGroup = game.add.group();
    this.tyrosineGroup = game.add.group();
    this.tyrGroup = game.add.group();
    
    this.trpGroup = game.add.group();
    this.hudGroup = game.add.group();
    this.aboveAllGroup = game.add.group();


    this.pulses = [];
    for(let i = 0;i<3;i++){
      let successPulse = game.add.sprite(0,0,"circle_outline");
      successPulse.anchor.set(.5);
      successPulse.x = config.SAFE_ZONE_WIDTH/2;
      successPulse.y = config.SAFE_ZONE_HEIGHT/2;
      successPulse.width = successPulse.height = 0;
      this.backgroundGroup.add(successPulse);
      this.pulses.push(successPulse);
    }



    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.stage.backgroundColor = '#223041';



    if(game.ftueData) {
      this.ftue = new FTUEDisplay({"game": game, "x":0, "y":0, "step": game.ftueStep, "data": game.ftueData});
      this.hudGroup.add(this.ftue);

      this.ftue.y = 1400;
      this.ftue.slideIn({y:640});

    } else {
      this.backgroundGoal = game.add.sprite(config.SAFE_ZONE_WIDTH/2,config.SAFE_ZONE_HEIGHT/2, "size_goal");
      this.backgroundGoal.tint = 0xB19C91;
      this.backgroundGoal.scale.set(1.4);
      this.backgroundGoal.anchor.set(.5);
      this.backgroundGoal.alpha = 1;
      this.backgroundGoal.blendMode = PIXI.blendModes.ADD;
      this.backgroundGroup.add(this.backgroundGoal);
    }




    this.world = game.add.group();
    
    // this.generateBackground();

    // var blobs = new BackgroundBlobs({
    //   game: game,
    //   x: 0,
    //   y: 0,
    //   blobTint: 0x223041,
    //   blobAlpha: 1,
    //   blobBlend: PIXI.blendModes.MULTIPLY,
    //   targetGroup: this.backgroundBlobsGroup
    // })






    // /** Melanosome **/
    var melScale = game.ftueData && game.ftueData.melanosomeScale ? game.ftueData.melanosomeScale : 1; 
    this.sizeMelanosome = new SizeMelanosome({
      game: game, 
      x: config.SAFE_ZONE_WIDTH/2, 
      y: config.SAFE_ZONE_HEIGHT/2,
      maxStars: this.maxStars,
      asset: "circle",
      zoom: melScale
    });
    this.sizeMelanosomeGroup.add(this.sizeMelanosome);

    if(this.backgroundGoal){
      this.backgroundGoal.width = this.sizeMelanosome.starsToSize(this.target_num_stars);
      this.backgroundGoal.height = this.backgroundGoal.width;
    }

    this.starImage = game.add.sprite(-config.SAFE_ZONE_WIDTH,-config.SAFE_ZONE_HEIGHT,"disc");
    this.starImage.anchor.set(.5);
    this.starImage.tint = 0xE94A1B;
    this.starImage.alpha = .9;
    this.darkStarImage = game.add.sprite(-config.SAFE_ZONE_WIDTH,-config.SAFE_ZONE_HEIGHT,"disc");
    this.darkStarImage.anchor.set(.5);
    this.darkStarImage.tint = 0x000000;
    this.darkStarImage.alpha = 0.35;

    this.starBmd = game.add.bitmapData(1024, 1024);
    this.starContainer = game.add.sprite(this.sizeMelanosome.x-512, this.sizeMelanosome.y-512, this.starBmd);
    this.tyrGroup.add(this.starContainer);




    this.expandingCircles = new ExpandingCircles({
        game: game,
        x: config.SAFE_ZONE_WIDTH/2, 
        y: config.SAFE_ZONE_HEIGHT/2
    });
    this.aboveAllGroup.add(this.expandingCircles);

    this.mouseTrail = new MouseGlow({
      game: game,
      x: game.input.x,
      y: game.input.y
    });
    

    /** Borders/Indicators **/
    // this.big_border = this.game.add.sprite(config.SAFE_ZONE_WIDTH/2, config.SAFE_ZONE_HEIGHT/2, 'dotted_circle');
    // this.big_border.anchor.set(.5);
    // this.big_border.scale.set(1.33);
    // this.big_border.alpha = .5;
    // this.world.add(this.big_border);

    // this.small_border = this.game.add.sprite(config.SAFE_ZONE_WIDTH/2, config.SAFE_ZONE_HEIGHT/2, 'dotted_circle');
    // this.small_border.anchor.set(.5);
    // this.small_border.scale.set(.67);
    // this.small_border.alpha = .5;
    // this.world.add(this.small_border);


    if(!game.ftueData) {
      this.colorIndicators = new ColorIndicators({"game": game, "x": 1, "y": 0, showStart: true, showTarget: true});
      this.colorIndicators.updateColors("size", this.sizeMelanosome.numStars/this.maxStars);

      this.hudGroup.add(this.colorIndicators);
    }

    
    this.topCover = game.add.sprite(0,0,"square");
    this.topCover.width = 2048;
    this.topCover.height = 2048;
    this.topCover.tint = game.stage.backgroundColor;
    game.add.tween(this.topCover).to({"alpha": 0}, 3000).start();

    //initial spawn of objects
    this.numPreexistingStars = 0;

    var overrideNumPreexistingStars = game.cellModel.get("initial_stars");

    if(overrideNumPreexistingStars===null || overrideNumPreexistingStars === undefined){

      /** STARS **/
      if(this.tyr_allele_a.value || this.tyr_allele_b.value){

        this.numPreexistingStars += this.maxStars / 2;

        if(this.trp_allele_a.value || this.trp_allele_b.value){
          this.numPreexistingStars+= this.maxStars / 2;
        }

      }
    }else{
      this.numPreexistingStars = overrideNumPreexistingStars;
    }

    for(var i = 0;i<this.numPreexistingStars;i++){
        
        var lifetime = (i+10)*1500;
        if(this.trp_allele_a.value || this.trp_allele_b.value){
          lifetime = (i+20)*3000;
        }

        var visible = true;
        if(this.game.ftueData && game.ftueData.action === "disc_destroyed") {
          // only show every 3rd disc
          visible = (i-1)%3 === 0;
          lifetime = Number.POSITIVE_INFINITY;
        }
        
        
        this.createStarProcedurally(lifetime, visible);
        
    }

    this.jumpToLocation();
    if(this.colorIndicators && this.colorIndicators.currentColorSwatch){
      this.colorIndicators.updateColors("size", this.sizeMelanosome.numStars/this.maxStars);
    }


    /** TYRs **/
    for( var i = 0; i < 8; i++ ) {
      var foo = Math.floor(i/4); 
      var allele_to_use = foo%2; //every other double
      var shouldBeActive = (i%4 == 0);
      this.spawnTyr(i*(360/8), shouldBeActive, allele_to_use);
    }


    this.updateTyrVisibility();

    /** TRPs **/
    var workingTyr = 0;
    for( var i = 0; i < this.tyrs.length; i++ ){
      var tyr = this.tyrs[i];
      
      if(tyr.isActive && (!game.ftueData || workingTyr < game.ftueData.working)){
        var trp = this.spawnTrp(tyr.x, tyr.y);
        if(trp){
          trp.connectToTyr(tyr);
          workingTyr++;
        }
      }
    }

    if(game.ftueData && game.ftueData.action === "working_protein_assembled") {
      this.spawnTrp(-config.SAFE_ZONE_WIDTH/4, 0);
      this.spawnTrp(config.SAFE_ZONE_WIDTH/4, 0);
      this.spawnTrp(0, -config.SAFE_ZONE_HEIGHT/4);
      this.spawnTrp(0, config.SAFE_ZONE_HEIGHT/4);
    }

    if(game.ftueData && game.ftueData.action === "tri_pushed_into_small_gear") {
      // spawn 6 tyrosine inside melanosome
      for( var i = 0; i < 6; i++) {
        var dist = this.sizeMelanosome.getSize() * 0.25;
        var theta = i * 2*Math.PI / 6;
        var x = Math.cos(theta)*dist;
        var y = Math.sin(theta)*dist;
        this.spawnTyrosine(x, y, true, true);
      }
    }



    this.mouseCursorHitArea = game.add.sprite(0,0,"circle");
    this.mouseCursorHitArea.anchor.set(.5);
    this.mouseCursorHitArea.alpha = 0;
    this.mouseCursorHitArea.width = this.mouseCursorHitArea.height = 80;
    game.physics.enable(this.mouseCursorHitArea, Phaser.Physics.ARCADE);



    this.timer = this.game.time.create(false);
    this.spawnTrpsForever();
    this.SpawnTyrosineForever();
    this.timer.start();

    if(this.colorIndicators) {
      this.colorIndicators.forceUpdateStartColor("size", this.sizeMelanosome.numStars/this.maxStars);
    }

    this.resize();
    game.hudView.loadTutorial(this, "protein");


    if(game.isNucleus){
      game.input.enabled = false;
      if(game.isPostNucleus){
          this.handleReturnFromNucleus();
      }else{
          game.hudView.showNucleus(true);
      }
    }
  }

  update(){

    // update background color based on melanosome color
    game.stage.backgroundColor = Phaser.Color.interpolateColor(this.bgStartColor, this.sizeMelanosome.tint, 100, 60, .2);
    
    // multiple stars can be created destroyed on the same update, so check above/below target as well 
    if(!game.ftueData && (this.target_num_stars < this.numPreexistingStars && this.sizeMelanosome.numStars <= this.target_num_stars ||
        this.target_num_stars > this.numPreexistingStars && this.sizeMelanosome.numStars >= this.target_num_stars)){ 
      this.handleWin();
      return;
    }


    if(this.hasWon!==true){


      this.mouseCursorHitArea.x = game.input.x;
      this.mouseCursorHitArea.y = game.input.y;

      this.expandingCircles.x = game.input.x;
      this.expandingCircles.y = game.input.y;
      
      this.checkForTyrOverlap();
    }

    this.updateStarBmd();
  }

  updateStarBmd(){
    this.starBmd.clear();
    this.starBmd.blendMultiply();
    var xOffset = 512 - this.sizeMelanosome.x;
    var yOffset = 512 - this.sizeMelanosome.y;
    for(var i=0; i < this.tyrosineStars.length; i++){
      var star = this.tyrosineStars[i];
      if(star.visible) {
        this.starImage.rotation = star.rotation;
        this.starImage.alpha = 0.9 - 0.2 * i/this.maxStars;
        this.starBmd.draw(this.starImage, star.x + xOffset, star.y + yOffset);
      }
    }
    // add desaturation filter so overlapping stars turn gray
    this.starBmd.blendSaturation();
    for(var i=0; i < this.tyrosineStars.length; i++){
      var star = this.tyrosineStars[i];
      if(star.visible) {
        this.darkStarImage.rotation = star.rotation;
        // desaturate more as they get further from center
        this.darkStarImage.alpha = .25 + 0.05 * i/this.tyrosineStars.length + 0.05 * i/this.maxStars;
        this.starBmd.draw(this.darkStarImage, star.x + xOffset, star.y + yOffset);
      }
    }
  }

  // pulseStarsForever(index){
  //   var pulseDuration = 700;
  //   if(index>this.tyrosineStars.length){
  //     index = 0;
  //   }
  //   if(this.tyrosineStars[index]!=null && this.tyrosineStars[index].isVulnerable !== true){
  //     this.tyrosineStars[index].pulseVulnerable(pulseDuration);
  //   }


  //   game.time.events.add(pulseDuration, function(){
  //     this.pulseStarsForever(index+1);
  //   }, this);
  // }


  updateTYRAlleles(){

    var chromosome1A = game.cellModel.get("Chromosome1A");
    var chromosome1B = game.cellModel.get("Chromosome1B");

    for(var i = 0;i<this.tyrs.length;i++){
      this.tyrs[i].handleAlleleChange();
    }

    this.tyr_allele_a = game.cellModel.getCurrentAllele("Chromosome1A", "tyr_mouth");
    this.tyr_allele_b = game.cellModel.getCurrentAllele("Chromosome1B", "tyr_mouth");


  }

  spawnTyr(location, shouldBeActive, allele_to_use){

    var allele = null;
    var chromosome_id="";
    if(allele_to_use == 0){
      chromosome_id = "Chromosome1A";
      allele = game.cellModel.getCurrentAllele(chromosome_id, "tyr_mouth");
    }else{
      chromosome_id = "Chromosome1B";
      allele = game.cellModel.getCurrentAllele(chromosome_id, "tyr_mouth");
    }
    var that = this;
    var newTyr = new Tyr({
      game: game, 
      x: config.SAFE_ZONE_WIDTH/2, 
      y: config.SAFE_ZONE_HEIGHT/2,

      asset: "circle",
      axleFlowerBmd: this.axleFlowerBmd,
      melanosome: this.sizeMelanosome,
      shouldBeActive: shouldBeActive,
      chromosome_id: chromosome_id,
      allele: allele,
      anchorPosition: location,
      onSeparate: function(){
        that.handleTyrSeparation()
      },
      onPlayerBreak: function(){
        that.handleTyrPlayerBreak();
      },
      breakable: !(game.ftueData && game.ftueData.action === "tri_pushed_into_small_gear")
    });

    // this.sizeMelanosome.tyrs.push(newTyr);
    this.tyrs.push(newTyr);
    this.tyrGroup.add(newTyr);
    newTyr.onStarCreation.add(this.handleStarCreation, this);
  }

  handleTyrSeparation(){
    this.tyrBreakApartSfx.play();
  }

  handleTyrPlayerBreak(){
    game.actions.record("protein_broken");
  }


  createStarProcedurally(lifetime, visible){
    var numPoints = 6;
    var starGroup = game.add.group();
    for(var i = 0;i<numPoints;i++){
      var tyrosine = this.spawnTyrosine();
      tyrosine.isFloating = false;
      
      var off = (i/numPoints) * (Math.PI*2);
      var x = Math.sin(off);
      var y = Math.cos(off);
      tyrosine.x = -x;
      tyrosine.y = -y;
      tyrosine.rotation = Math.atan2(y, x) - (Math.PI/2);

      this.floatingTyrosineCount--;

      starGroup.add(tyrosine);


    }

    var starProps = {
      game: game,
      x: (this.starFactoryGroup.worldPosition.x/this.tyrGroup.scale.x) - (this.tyrGroup.x/this.tyrGroup.scale.x),
      y: (this.starFactoryGroup.worldPosition.y/this.tyrGroup.scale.y) - (this.tyrGroup.y/this.tyrGroup.scale.y),
      targetGroup: this.tyrGroup,
      existingGroup: starGroup,
      rotation: 0,
      melanosome: this.sizeMelanosome,
      visible: visible
    };
    if(lifetime === Number.POSITIVE_INFINITY) {
      starProps.immortal = true;
    } else {
      starProps.initialLifetime = lifetime;
    }
    var newTyrosineStar = new TyrosineDisc(starProps);
    
    this.sizeMelanosome.numStars++;
    this.handleStarCreation(newTyrosineStar, false);
  }




  handleStarCreation(newStar, shouldUpdateIndicator = true){
    if(this.starMakeSfx && !game.ftueData)
      this.starMakeSfx.play();

    this.tyrosineStars.push(newStar);

    newStar.onStarDestruction.add(this.handleStarDestruction, this);
    newStar.onPoke.add(this.handleStarPoke, this);
    this.updateStarPositions();
    this.updateTyrVisibility();


    if(this.colorIndicators && this.colorIndicators.currentColorSwatch && shouldUpdateIndicator){
      this.colorIndicators.updateColors("size", this.sizeMelanosome.numStars/this.maxStars);
    }


  }
  handleStarPoke(){
    game.actions.record("disc_clicked");

    this.starPokeSfx.volume = .5 + ((game.rnd.frac()*.4)-.2); // .3 ... .7
    this.starPokeSfx.pitch = 1 - (game.rnd.frac()*.5); // 1 ... .9

    this.starPokeSfx.play();
  }
  handleStarDestruction(oldStar){
    // don't count if star died of old age
    if(oldStar.wasPoked) {
      game.actions.record("disc_destroyed");
    }

    if(this.starBreakSfx){
      this.starBreakSfx.play();
    }

    var ind = this.tyrosineStars.indexOf(oldStar);
    if(ind>-1){
      this.tyrosineStars.splice(ind, 1);
      this.updateStarPositions();
      this.updateTyrVisibility();

    }

    if(this.colorIndicators && this.colorIndicators.currentColorSwatch){
      this.colorIndicators.updateColors("size", this.sizeMelanosome.numStars/this.maxStars);
    }


  }
  updateTyrVisibility(){
    var length = this.tyrosineStars.length;
    if(this.tyrs === null || this.tyrs.length == 0){
      return 0;
    }




    var numTyrsToShow = 2;


    if(game.ftueData) {
      numTyrsToShow = game.ftueData.tyrs;

    } else if((length >= 13 || this.forceAllTyrsActive==true)
      // make sure lava drake doesn't transition to charcoal unless user connects proteins
      && !(game.cellModel.getGeneticShortcode() == "00111111" && game.actions.stats["broken_protein_assembled"] < 3)){
      numTyrsToShow = 8;

    } else {
      if(length < 2){
        numTyrsToShow = 2;
      } else {
        numTyrsToShow = 4;
      }

      if(this.doubleActiveTyrs == true){
        numTyrsToShow *=2;
        numTyrsToShow = Math.min(8, numTyrsToShow);
      }
    }
    

    if(numTyrsToShow==1){
      this.tyrs[0].activate();

      this.tyrs[1].deactivate();
      this.tyrs[2].deactivate();
      this.tyrs[3].deactivate();
      this.tyrs[4].deactivate();
      this.tyrs[5].deactivate();
      this.tyrs[6].deactivate();
      this.tyrs[7].deactivate();

    }
    if(numTyrsToShow==2){
      this.tyrs[0].activate();
      this.tyrs[4].activate();

      this.tyrs[1].deactivate();
      this.tyrs[2].deactivate();
      this.tyrs[3].deactivate();
      this.tyrs[5].deactivate();
      this.tyrs[6].deactivate();
      this.tyrs[7].deactivate();
    }
    if(numTyrsToShow==4){
      this.tyrs[0].activate();
      this.tyrs[2].activate();
      this.tyrs[4].activate();
      this.tyrs[6].activate();

      this.tyrs[1].deactivate();
      this.tyrs[3].deactivate();
      this.tyrs[5].deactivate();
      this.tyrs[7].deactivate();
    }
    if(numTyrsToShow>=8){
      this.tyrs[0].activate();
      this.tyrs[1].activate();
      this.tyrs[2].activate();
      this.tyrs[3].activate();
      this.tyrs[4].activate();
      this.tyrs[5].activate();
      this.tyrs[6].activate();
      this.tyrs[7].activate();
    }



  }

  spawnTyrsForever(){
    this.spawnTyr(-config.SAFE_ZONE_WIDTH/2);
    this.timer.add(1000/this.size_tyr_count, this.spawnTyrsForever, this);
  }

  updateTRPAlleles(){
    this.trp_allele_a = game.cellModel.getCurrentAllele("Chromosome1A", "trp_flower_01");
    this.trp_allele_b = game.cellModel.getCurrentAllele("Chromosome1B", "trp_flower_01");;
  }

  spawnTrp(x_offset, y_offset, direction){
    var max = this.maxTrp;
    
    // make sure lava drake doesn't transition to charcoal unless user connects proteins
    if(game.cellModel.getGeneticShortcode() == "00111111" && game.actions.stats["broken_protein_assembled"] < 3) {
      var color = game.cellModel.getGeneticColorName();
      var geneticState = game.cellModel.colorToState(color);

      var extraStars = this.sizeMelanosome.numStars - geneticState.numStars;
      if(extraStars > 0) {       
        max -= extraStars * extraStars; 
      }
    }
    
    if(this.trpCt < max){
      this.trpCt++;

      
      var direction = direction ? direction : {x: 1, y: 0};


      var alleleToUseRoll = Math.round(game.rnd.frac());
      var alleleToUse = null;

      if(alleleToUseRoll === 0){
        alleleToUse = this.trp_allele_a;
      }else{
        alleleToUse = this.trp_allele_b
      }

      var that = this;
      var newTrp = new Trp({
        game: game, 
        x: config.SAFE_ZONE_WIDTH/2 + x_offset, 
        y: config.SAFE_ZONE_HEIGHT/2 + y_offset,
        direction: direction,
        melanosome: this.sizeMelanosome,
        axleFlowerBmd: this.axleFlowerBmd,
        initialGroup: this.trpGroup,
        working: ( alleleToUse.value ),
        onConnect: function(trp){
          that.handleTrpConnect(trp);
        },
        onFalloff: function(){ 
          that.handleTrpFalloff();
        },
        onGrab: function(){
          that.handleTrpGrab();
        }
      });

      // this.sizeMelanosome.tyrs.push(newTyr);
      this.trps.push(newTrp);
      return newTrp;
    }
  }

  handleTrpConnect(trp){
    this.trpCt--;
    this.trpAttachSfx.play();

    if(trp && trp.isBeingDragged) {
      if(trp.isWorking) {
        // todo: separate class for action tracking, events on changes
        game.actions.record("working_protein_assembled");
      } else {
        game.actions.record("broken_protein_assembled");
      }
    }
  }
  handleTrpFalloff(){
    this.trpFalloffSfx.play();

  }
  handleTrpGrab(){
    game.actions.record("barbell_grabbed");
  }
  spawnTrpsForever(){
    this.spawnRandomTrp();
    this.timer.add((1000/this.trpSpawnedPerSecond)/game.globalTimeScale, this.spawnTrpsForever, this);
  }


  spawnRandomTrp(distFromCenter){

    var hDist = config.SAFE_ZONE_WIDTH;
    var vDist = config.SAFE_ZONE_HEIGHT;

    if(distFromCenter !== undefined) {
      // spawn on edges of game
      hDist = vDist = distFromCenter;
    }
    

    var dir_choice = game.rnd.integerInRange(0,3);

    switch(dir_choice){
      //left
      case 0:
        this.spawnTrp(-hDist/2, (game.rnd.frac()*vDist) - vDist/2, { x: 1, y: 0 });
        break;
      //top
      case 1:
        this.spawnTrp((game.rnd.frac()*hDist) - hDist/2, -vDist/2, { x: 0, y: 1 });
        break;
      //right
      case 2:
        this.spawnTrp(hDist/2, (game.rnd.frac()*vDist) - vDist/2, { x: -1, y: 0 });
        break;
      //bottom
      case 3:
        this.spawnTrp((game.rnd.frac()*hDist) - hDist/2, vDist/2, { x: 0, y: -1 });
        break;

    }
  }

  spawnTyrosine(x, y, inside, immortal){
    var rnd = game.rnd.frac() * Math.PI*2;
    var distance = inside ? 0.1 : 0.5
    var xpos = x ? x : (Math.sin(rnd) * this.sizeMelanosome.getSize() * distance) * (1+game.rnd.frac());
    var ypos = y ? y : (Math.cos(rnd) * this.sizeMelanosome.getSize() * distance) * (1+game.rnd.frac());

    var newTyrosine = new Tyrosine({
      game: game, 
      x: (config.SAFE_ZONE_WIDTH/2) + xpos, 
      y: (config.SAFE_ZONE_HEIGHT/2) + ypos,
      base_x: config.SAFE_ZONE_WIDTH/2,
      base_y: config.SAFE_ZONE_HEIGHT/2,
      asset: "tyrosine",
      melanosome: this.sizeMelanosome,
      immortal: immortal
    });

    if(inside) {
      newTyrosine.isInside = true;
    }
    this.floatingTyrosineCount++;
    this.tyrosines.push(newTyrosine);
    this.tyrosineGroup.add(newTyrosine);
    return newTyrosine;
  }
  SpawnTyrosineForever(){
    // if(this.tyrosines.length<this.max_tyrosine){
      if(this.floatingTyrosineCount<this.maxFloatingTyrosineCount){
        this.spawnTyrosine();
      }
      this.timer.add( ((1000/this.tyrosineSpawnedPerSecond))/game.globalTimeScale, this.SpawnTyrosineForever, this);
    // }
  }

  updateStarPositions(){

    //var n = this.tyrosineStars.length;
    //var a = 1;
    //var b = 1;
    //var maxDist = (this.sizeMelanosome.width/2) * .75;

    // for(var i = 0;i<n;i++){
    //   var pct = i/this.maxStars;
    //   var foo = pct * 720;

    //   var star = this.tyrosineStars[i];
    //   var angle = foo * .5;


    //   var x = (a + b * angle) * Math.cos(angle);
    //   var y = (a + b * angle) * Math.sin(angle);

    //   // var x = r*Math.cos(theta) * maxDist;
    //   // var y = r*Math.sin(theta) * maxDist;
    //   star.targetPos.x = this.sizeMelanosome.x + x;
    //   star.targetPos.y = this.sizeMelanosome.y + y;

    // }


    var alpha = 0;
    var n = this.tyrosineStars.length;
    var b = Math.round(alpha*Math.sqrt(n));      // number of boundary points

    var phi = Math.PI*Math.PI;
    // var phi = Math.PI;

    var maxDist = (this.sizeMelanosome.width/2) * .8;



    for(var i = 0;i<n;i++){

      var star = this.tyrosineStars[i];
      var r = 0;

      if (i>n-b){
          r = 1; // put on the boundary
      }
      else{
          r = Math.sqrt(i-1/2)/Math.sqrt(n-(b+1)/2) || 0; // apply square root
      }

      var theta = (2*Math.PI*i)/(phi);
      var x = r*Math.cos(theta) * maxDist;
      var y = r*Math.sin(theta) * maxDist;
      star.targetPos.x = this.sizeMelanosome.x + x;
      star.targetPos.y = this.sizeMelanosome.y + y;

    }

    // hold on
    // phi = (sqrt(5)+1)/2;           % golden ratio
    // for k=1:n
    //     r = radius(k,n,b);
    //     theta = 2*pi*k/phi^2;
    //     plot(r*cos(theta), r*sin(theta), 'r*');
    // end




    // var ct = 0;
    // var length = this.tyrosineStars.length;


    // var phi = (Math.sqrt(5)+1)/2

    // var rot_spacing = Math.PI / 5 ;
    // rot_spacing = phi;
    // var maxDist = (this.sizeMelanosome.width/2) * .75;

    // for(var i = 0;i<length;i++){
    //   var star = this.tyrosineStars[i];

    //   //push them outwards to get a better ring around the outside
    //   var pct = (i * 1.5)/length;

    //   if(pct>1)
    //     pct = 1;
    //   var x = Math.cos(i*rot_spacing) * maxDist * pct;
    //   var y = Math.sin(i*rot_spacing) * maxDist * pct;
    //   star.targetPos.x = this.sizeMelanosome.x + x;
    //   star.targetPos.y = this.sizeMelanosome.y + y;

    // }




  }


  jumpToLocation(){
    this.sizeMelanosome.jumpToSize();
    this.updateStarPositions();
    for(var i = 0;i<this.tyrosineStars.length;i++){
      this.tyrosineStars[i].jumpToLocation();
    }
    this.updateStarPositions();
    this.updateTyrVisibility();
  }



  sunflowerRadius(k,n,b){
    var r = 1;
    if (k>n-b){
        r = 1;            // put on the boundary
    }
    else{
        r = Math.sqrt(k-1/2)/Math.sqrt(n-(b+1)/2);     // apply square root
    }
    return r;
  }

  checkForTyrOverlap(){
      var that = this;

      for( var i = 0; i < this.tyrs.length; i++ ) {
          var tyr = this.tyrs[ i ];

          //if the tyr is not currently processing a tyrosine, check for other tyrosine overlaps
          if(tyr.isProcessing !== true && tyr.isSeparate !== true && tyr.isActive === true){

            for(var j = 0;j<this.tyrosines.length;j++){
                var tyrosine = this.tyrosines[j];
                if(tyrosine.isFloating && tyr.isProcessing !== true && tyr.currentTyrosine==null && tyr.isSeparate !== true && tyr.isConnecting !== true){
                    if(tyrosine.isInside === true){
                        this.game.physics.arcade.overlap(tyr.alphaBlob, tyrosine, function(tyrAlphaBlob, tyrosine){
                            tyr.innerGrab(tyrosine);
                            
                            if(tyrosine.wasPushed) {
                              game.actions.record("tri_pushed_into_small_gear");
                            }
                        }, null, this);
                    }else{
                        this.game.physics.arcade.overlap(tyr.betaBlob, tyrosine, function(tyrBetaBlob, tyrosine){
                            this.floatingTyrosineCount--;
                            tyr.grab(tyrosine);
                        }, null, this);
                    }

                }



            }
          }


          for(var k = 0; k < this.trps.length; k ++){
            var trp = this.trps[k];
            if(trp.isBeingDragged || !(game.ftueData && game.ftueData.action === "working_protein_assembled")){
          
              if(trp.isFloating && tyr.connecting_trp == null && tyr.isActive === true && tyr.isConnecting !== true){
                this.game.physics.arcade.overlap(tyr.alphaBlob, trp.fakeHitZone, function(tyrAlphaBlob, trpHitZone){
                    //alert("H");
                    trp.connectToTyr(tyr)
                }, null, this);

                this.game.physics.arcade.overlap(tyr.betaBlob, trp.fakeHitZone, function(tyrBetaBlob, trpHitZone){
                    //alert("H");
                    trp.connectToTyr(tyr)
                }, null, this);
              }
            }
          }

      }


      if(game.input.activePointer.isDown){
        this.expandingCircles.isActive = true;
        for(var j = 0;j<this.tyrosines.length;j++){
            var tyrosine = this.tyrosines[j];
            if(tyrosine.isFloating){
                  this.game.physics.arcade.overlap(this.mouseCursorHitArea, tyrosine, function(cursor, tyrosine){
                      var diff_x = game.input.x - tyrosine.world.x;
                      var diff_y = game.input.y - tyrosine.world.y;
                      tyrosine.body.velocity.x += -diff_x*(.75+(game.rnd.frac()*.5));
                      tyrosine.body.velocity.y += -diff_y*(.75+(game.rnd.frac()*.5));

                      var targetRot = Math.atan2(tyrosine.body.velocity.y, tyrosine.body.velocity.x) - Math.PI/2;
                      tyrosine.rotateTo(targetRot);

                      tyrosine.push();
                  });
            }
        }
      }else{
        this.expandingCircles.isActive = false;

      }


  }

  generateTextures(){
    var axleFlowerBmd = game.add.bitmapData(64, 64);

    var spacing = .2;
    var center = axleFlowerBmd.width/2;
    for(var i = 0;i<1;i+=spacing){
      var spread = i*Math.PI*2;
      var x = center + (Math.sin(spread)*(center* .2));
      var y = center + (Math.cos(spread)*(center* .2));
      var thickness = 5;
      axleFlowerBmd.circle(x, y, thickness, 'rgba(0,0,0, 1)');
    }
    this.axleFlowerBmd = axleFlowerBmd;

  }


  handleWin(inFTUE){

    if(this.hasWon !== true){
      if(!inFTUE) {
        this.hasWon = true;
        game.input.enabled = false;
      } else {
        this.ftue.slideOut({y:1400});
      }

      //play pretty sound
      this.winSfx.play();
      
      game.tweens.removeFrom(this.topCover);


      
      for(let i =0;i<this.pulses.length;i++){
        let pulse = this.pulses[i];
        pulse.alpha = .5;
        game.add.tween(pulse).to({"width": 4000, "height": 4000, "alpha": 0}, 1000*(i+1), Phaser.Easing.Cubic.Out).start();
      }

      
      if(game.inPreScene){
        game.handlePreSceneComplete();
      } else {
        game.hideHud(true);
        game.time.events.add(3500, function(){
          //fade out and send event
          var fadeOut = game.add.tween(this.topCover).to({"alpha": 1}, 1000).start();
          if(inFTUE) {
            fadeOut.onComplete.add(()=>{
              game.loadNextStep();
            });
            return;
          }
          
          this.postWin();
          
        }, this);
      }
    }

  }

  postWin() {    
    this.phone.post("activityWin", {
      "activity": "size",
      "cellModel": game.cellModel.toJSON(),
      "resultingGeneticColor": game.cellModel.getGeneticColorName(),
      "geneticShortcode": game.cellModel.getGeneticShortcode(),
      "actionStats": game.actions.stats,
      "ftue": this.game.ftueData
    });
  }


   pauseEverything(){
    
    // for(let i = 0;i<this.trps.length;i++){
    //   let trp = this.trps[i];
    //   trp.v_x = 0;
    //   trp.v_y = 0;
    // }




   }


  handleExit(){

    if(this.isExiting !== true){
      game.input.enabled = false;
      this.isExiting = true;
      
      game.tweens.removeFrom(this.topCover);
      game.add.tween(this.topCover).to({"alpha": 1}, 1000).start();
      game.hideHud();
      game.time.events.add(1501, function(){
        game.paused = true;
        this.phone.post("activityExit", {
          "activity": "size",
          "cellModel": game.cellModel.toJSON(),
          "resultingGeneticColor": game.cellModel.getGeneticColorName(),
          "geneticShortcode": game.cellModel.getGeneticShortcode()
        });
        // window.location.href = "debug.html";
      }, this);

    }

  }




  guardChange(){
    //for all old TRPs, tween them off to the right

    //spawn a bunch of TRPs. Tween on from the left

    //for all old TYRs, shoot them off to the right

    //spawn new TYRs, tween on from left.
  }



  render () {
    //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
  }
  resize(){

    var lGameScale=Math.round(10000 * Math.min(this.game.width/config.SAFE_ZONE_WIDTH,this.game.height / config.SAFE_ZONE_HEIGHT)) / 10000;
    this.world.scale.setTo (lGameScale,lGameScale);
    

    this.sizeMelanosomeGroup.scale.setTo (lGameScale,lGameScale);
    this.tyrGroup.scale.setTo (lGameScale,lGameScale);
    this.tyrosineGroup.scale.setTo (lGameScale,lGameScale);
    this.trpGroup.scale.setTo (lGameScale,lGameScale);
    this.backgroundGroup.scale.setTo (lGameScale,lGameScale);
    this.backgroundBlobsGroup.scale.setTo (lGameScale,lGameScale);
    this.hudGroup.scale.setTo(lGameScale, lGameScale);
    // this.aboveAllGroup.scale.setTo (lGameScale,lGameScale);


    this.hudGroup.x = this.backgroundBlobsGroup.x = this.backgroundGroup.x = this.trpGroup.x = this.tyrosineGroup.x = this.tyrGroup.x = this.sizeMelanosomeGroup.x = this.world.x = (this.game.width-config.SAFE_ZONE_WIDTH*lGameScale)/2;
    this.hudGroup.y = this.backgroundBlobsGroup.y = this.backgroundGroup.y = this.trpGroup.y = this.tyrosineGroup.y = this.tyrGroup.y = this.sizeMelanosomeGroup.y = this.world.y = (this.game.height-config.SAFE_ZONE_HEIGHT*lGameScale)/2;

    for(var i=0; i<this.tyrosineStars.length; i++) {
      this.tyrosineStars[i].resize();
    }

    // var w = this.mouseCursorHitArea.width * lGameScale;
    // var h = this.mouseCursorHitArea.height * lGameScale;
    // this.mouseCursorHitArea.body.setSize(w, h, (512-w)/2, (512-h)/2);


  }


  handleReturnFromNucleus(){
      var resultingGeneticColor = game.cellModel.getGeneticColorName();
      var resultingGeneticState = game.cellModel.colorToState(resultingGeneticColor);
      var targetState=game.cellModel.target_state;

      if(resultingGeneticState.numStars == targetState.numStars){
        this.successfulNucleusReturn();
      }else{
        //womp womp
        //todo?
      }
  }
  successfulNucleusReturn(){
      game.hideHud();

      this.winSfx.play();


      //if the trps are relevant, dump a bunch of them on the stage
      var trp_a = game.cellModel.getGene("Chromosome1A", "trp_flower_01");
      var trp_b = game.cellModel.getGene("Chromosome1B", "trp_flower_01");
      if(trp_a.isRelevant || trp_b.isRelevant){
        this.maxTrp = 50;
        for(var i = 0;i<20;i++){
          var trp = this.spawnTrp(-512 - (game.rnd.frac()*1024), (game.rnd.frac()*1024)-512);
          
          if(trp) trp.fakeHitZone.body.velocity.x+=250+(500*game.rnd.frac());
        }
        game.globalTimeScale = 1.25;
      }






      //if the tyrs are relevant, quick animation of them changing
      var tyr_a = game.cellModel.getGene("Chromosome1A", "tyr_mouth");
      var tyr_b = game.cellModel.getGene("Chromosome1B", "tyr_mouth");
      if(tyr_a.isRelevant || tyr_b.isRelevant){
          this.maxTrp*=2;
          game.globalTimeScale = 1.5;

          // console.log("DO TYR SWAP");

          // this.forceAllTyrsActive = true;
          this.doubleActiveTyrs = true;
          for(let i = 0;i<this.tyrs.length;i++){
            let tyr = this.tyrs[i];
            tyr.deactivate();


          }
          game.time.events.add(750, function(){
            this.updateTyrVisibility();
            for(let i = 0;i<this.tyrs.length;i++){
              let tyr = this.tyrs[i];
              if(tyr.isActive){
                this.spawnTrp(0, 0)
              }
            }
          }, this);
      }



      //todo, change nucleus hinting to say good job!


  }


  highlightChromoscope(on) {
    this.colorIndicators.setHighlight(on);
  }
  highlightDrake(on) {
    game.hudView.setHighlight("#nucleus-inner .target", on);
  }
  highlightBuild(on) {
    game.hudView.setHighlight("#nucleus-inner .compile", on);
  }

  gotoGateActivity(){
    this.gotoState("GateActivity");
  }
  gotoMotorActivity(){
    this.gotoState("MotorActivity");
  }
  gotoState(stateName){
    this.state.start(stateName, true, false);

  }

}
