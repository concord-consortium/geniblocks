/* globals __DEV__ */
import Phaser from 'phaser'
import dat from 'dat-gui'
import iframePhone from 'iframe-phone'
import BackgroundBlobs from '../sprites/common/BackgroundBlobs'
import ColorIndicators from '../sprites/common/ColorIndicators'
import Squiggle from '../sprites/common/Squiggle'
import MotorMelanosome from '../sprites/motor_activity/MotorMelanosome'
import MotorMelanosomeSlot from '../sprites/motor_activity/MotorMelanosomeSlot'
import Myocin from '../sprites/motor_activity/Myocin'
import Kinesin from '../sprites/motor_activity/Kinesin'
import config from '../config'

import Vignette from '../tools/filters/Vignette.js'
import { datalog } from '../utils.js'


export default class extends Phaser.State {
  init (onFinishCallback) {
    this.onFinishCallback = onFinishCallback
  }
  preload () {}

  create () {
    datalog("Motor Activity Started");


    this.phone = new iframePhone.getIFrameEndpoint();
    this.phone.initialize();


    this.melanosomes = [];
    this.actins = [];
    this.actinSlots = [];
    this.nucleusSlot = {};
    this.cellWallSlot = {};
    this.myocinsUp = [];
    this.myocinsDown = [];
    this.kinesins = [];
    this.dyneins = [];



    this.backgroundGroup = game.add.group();
    this.backgroundBlobsGroup = game.add.group();


    this.slotGroup = game.add.group();
    this.microtubuleGroup = game.add.group();

    this.myocinGroup = game.add.group();
    
    this.melanosomeGroup = game.add.group();
    this.kinesinGroup = game.add.group();
    this.actinGroup = game.add.group();
    
    this.aboveAllGroup = game.add.group();


    this.myocinSpawnsPerSecond = 1;
    this.myocinBaseStickiness = .5;
    this.myocinStickinessVariation = 5;
    this.percentMyocinWorking = 1;


    this.unwinnableGracePeriod = 2000;
    this.canWin = false;
    game.time.events.add(this.unwinnableGracePeriod, function(){
      this.canWin = true;
    }, this)


    this.pulses = [];
    for(let i = 0;i<3;i++){
      let successPulse = game.add.sprite(0,0,"circle_outline");
      successPulse.anchor.set(.5);
      successPulse.x = config.SAFE_ZONE_WIDTH/2;
      successPulse.y = config.SAFE_ZONE_HEIGHT/2;
      successPulse.width = successPulse.height = 0;
      this.backgroundBlobsGroup.add(successPulse);
      this.pulses.push(successPulse);
    }



    //audio setup
    // this.bgMusic = this.game.add.audio("bg-music");
    // this.bgMusic.loop = true;
    // this.bgMusic.play();
    // this.popSfx = this.game.add.audio("pop");


    this.onReleaseSfx = this.game.add.audio("popout");
    this.onReleaseSfx.volume = .7;
    this.onSlotSfx = this.game.add.audio("pleasing_ding");
    this.squitchSfx = this.game.add.audio("popout");
    this.squitchSfx.pitch = 2;
    this.squitchSfx.volume = .7;

    this.grabSfx = this.game.add.audio("dumbbell_attach");
    this.grabSfx.volume = .0;
    this.proteinReleaseMelanosomeSfx = this.game.add.audio("dumbbell_break");
    this.proteinReleaseMelanosomeSfx.volume = .2;





    this.winSfx = this.game.add.audio("win");


    this.updateMyocinAlleles();
    game.cellModel.on("change", this.updateMyocinAlleles, this);

    this.targetNumSlotted = game.cellModel.target_state.numSlotted;
    this.numSlotted = 0;


    this.kinesinSpawnsPerSecond = .2;
    this.kinesinBaseStickiness = .05;
    this.kinesinStickinessVariation = 5;
    this.percentKinesinWorking = 0;

    this.dyneinSpawnsPerSecond = .2;
    this.dyneinBaseStickiness = .05;
    this.dyneinStickinessVariation = 5;
    this.percentDyneinWorking = 0;

    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

    this.backgroundSprite = game.add.sprite(0,0, "square");
    this.backgroundSprite.tint = 0x0C233C;
    this.backgroundGroup.add(this.backgroundSprite);

    game.stage.backgroundColor = '#0C233C';
    this.world = game.add.group();















    var blobs = new BackgroundBlobs({
      game: game,
      x: 0,
      y: 0, 
      blobTint: 0xddddff,
      blobAlpha: .7,
      targetGroup: this.backgroundBlobsGroup,
      blobBlend: PIXI.blendModes.ADD,
      bloomAlpha: 0
    })








    this.squiggleBmd = game.add.bitmapData(2048, 2048);
    this.squiggleSprite = game.add.sprite(0,0, this.squiggleBmd);
    this.squiggleSprite.alpha = 1;
    this.microtubuleGroup.add(this.squiggleSprite);


    this.actinBmd = game.add.bitmapData(2048, 2048);
    this.actinSprite = game.add.sprite(0,0, this.actinBmd);
    this.actinGroup.add(this.actinSprite);



    var microtubule_y = config.SAFE_ZONE_HEIGHT/2;

    // var micro_tubule_y_values = [ microtubule_y, microtubule_y,  microtubule_y + 100,  microtubule_y - 100, microtubule_y, microtubule_y - 100, microtubule_y-100,  microtubule_y+100,  microtubule_y-100 ];

    this.microtubule_out = new Squiggle({
      game: game,
      x: 0, 
      y: 0,
      direction: 1,
      path_points: { 
        'x': [0, config.SAFE_ZONE_WIDTH],
        'y': [microtubule_y - 20]
      },
      thickness: 3,
      spacing: 12,
      alphaFade: .5,
      alpha: .75,
      color: "#D47FA9"
    });

    this.world.add(this.microtubule_out);



    this.microtubule_middle = new Squiggle({
      game: game,
      x: 0, 
      y: 0,
      direction: 1,
      path_points: { 
        'x': [ 0, config.SAFE_ZONE_WIDTH],
        'y': [microtubule_y]
      },
      thickness: 28,
      alphaFade: 1,
      alpha: 1,
      color: "#635D5B"
    });

    this.world.add(this.microtubule_middle);


    this.microtubule_in = new Squiggle({
      game: game,
      x: 0, 
      y: 0,
      direction: -1,
      path_points: { 
        'x': [ 0, config.SAFE_ZONE_WIDTH],
        'y': [microtubule_y + 20]
      },
      spacing: 12,
      thickness: 3,
      alphaFade: .5,
      alpha: .75,
      color: "#99CCCC",
      asset: "circle"
    });

    this.world.add(this.microtubule_in);

    this.microtubuleGroup.add(this.microtubule_in);
    this.microtubuleGroup.add(this.microtubule_middle);
    this.microtubuleGroup.add(this.microtubule_out);



    var numActin = game.cellModel.get("maxSlotted");
    var spacing = config.SAFE_ZONE_WIDTH/(numActin+4);
    for(var i = 0;i<numActin;i++){
        var actin_x = (i+2)*spacing;

        var signedDistFromCenter = (i+.5) - (numActin/2);
        var distFromCenter = Math.abs(signedDistFromCenter);
        
        var rand_x = signedDistFromCenter*-40;//this.rnd.between(-100,100);

        var delta_y = 0;//(distFromCenter * distFromCenter) * 5;

        var actin = new Squiggle({

          game: game,
          x: 0, 
          y: 0,
          thickness: 3,
          spacing: 10,
          alphaFade: 1,
          direction: i%2==0 ? -1 : 1,
          path_points: { 
            'x': [ actin_x, actin_x,  actin_x],
            'y': [ -300 + (delta_y), config.SAFE_ZONE_HEIGHT+300 - (delta_y)]
          },
          asset: "circle"
        });

        actin.drawToBmd(this.actinBmd);
        this.world.add(actin);
        this.actinGroup.add(actin);
        this.actins.push(actin);
    }

    this.createSlots();














    this.microtubule_middle.drawToBmd(this.squiggleBmd);
    this.microtubule_in.drawToBmd(this.squiggleBmd);
    this.microtubule_out.drawToBmd(this.squiggleBmd);



    this.golgi_glow = game.add.sprite(0,0,"medium_white_blur");
    this.golgi_glow.anchor.set(.5,.5);
    this.golgi_glow.height = config.SAFE_ZONE_HEIGHT + 400;
    this.golgi_glow.width = config.SAFE_ZONE_HEIGHT + 300;
    this.golgi_glow.x = -config.SAFE_ZONE_HEIGHT/2;
    this.golgi_glow.y = config.SAFE_ZONE_HEIGHT/2;
    this.golgi_glow.tint = 0x39D8D7;
    this.aboveAllGroup.add(this.golgi_glow);


    this.golgi_border = game.add.sprite(0,0,"circle");
    this.golgi_border.anchor.set(.5,.5);
    this.golgi_border.height = config.SAFE_ZONE_HEIGHT + 10;
    this.golgi_border.width = config.SAFE_ZONE_HEIGHT + 10;
    this.golgi_border.x = -config.SAFE_ZONE_HEIGHT/2;
    this.golgi_border.y = config.SAFE_ZONE_HEIGHT/2;
    this.golgi_border.tint = 0xFFFFFF;
    this.aboveAllGroup.add(this.golgi_border);


    this.golgi = game.add.sprite(0,0,"circle");
    this.golgi.anchor.set(.5,.5);
    this.golgi.height = config.SAFE_ZONE_HEIGHT;
    this.golgi.width = config.SAFE_ZONE_HEIGHT;
    this.golgi.x = -config.SAFE_ZONE_HEIGHT/2;
    this.golgi.y = config.SAFE_ZONE_HEIGHT/2;
    this.golgi.tint = 0x39D8D7;
    this.aboveAllGroup.add(this.golgi);

    //initial spawn of objects


    var numPreexistingMelanosomes = 0;
    if(this.myocin_allele_a.value == true || this.myocin_allele_b.value == true){
      numPreexistingMelanosomes=this.actinSlots.length;
    }

    var that = this;

    //for each slot, spawn a melanosome and myocin
    for(var i = 0;i<this.actinSlots.length;i++){
      if(i<numPreexistingMelanosomes){

        var slot = this.actinSlots[i];
        var newmel = this.spawnMelanosome();
        newmel.x = slot.x;
        newmel.y = slot.y;

        var myo = new Kinesin({
          game: game,
          x: newmel.x,
          y: newmel.y,
          asset: "circle",
          initialOffset: slot.myoffset,
          popSfx: this.squitchSfx,
          microtubule: slot.microtubule,
          strongChance: this.percentMyocinWorking,
          baseStickiness: this.myocinBaseStickiness,
          stickinessVariation: this.myocinStickinessVariation,
          tint: 0xCCCC99,
          canAnchor: true,
          onReleaseMelanosome: function(){
            that.proteinReleaseMelanosomeSfx.play();
          },
          onGrabMelanosome: function(){
            that.grabSfx.play();
          }
        })

        if(slot.microtubule.direction>0){
          this.myocinsUp.push(myo);
        }else{
          this.myocinsDown.push(myo);
        }
        this.myocinGroup.add(myo);

      }

    }

    for(var i = 0;i<this.actins.length;i++){
        var actin = this.actins[i];
        var initialOffset = game.rnd.frac()*.5;
        if(actin.direction<0){
          initialOffset = 1-initialOffset;
        }
        var myo = new Kinesin({
          game: game,
          x: 10000,
          y: 10000,
          asset: "circle",
          initialOffset: initialOffset,
          popSfx: this.squitchSfx,
          microtubule: actin,
          strongChance: this.percentMyocinWorking,
          baseStickiness: this.myocinBaseStickiness,
          stickinessVariation: this.myocinStickinessVariation,
          startDisabled: true,
          tint: 0xCCCC99,
          canAnchor: true,
          onReleaseMelanosome: function(){
            that.proteinReleaseMelanosomeSfx.play();
          },
          onGrabMelanosome: function(){
            that.grabSfx.play();
          }
        })


        if(actin.direction>0){
          this.myocinsUp.push(myo);
        }else{
          this.myocinsDown.push(myo);
        }
        this.myocinGroup.add(myo);

    }



    for(var i = 0;i<this.actins.length;i+=3){
        var actin = this.actins[i];
        var initialOffset = game.rnd.frac()*.5;
        if(actin.direction<0){
          initialOffset = 1-initialOffset;
        }
        var kin = new Kinesin({
          game: game,
          x: 10000,
          y: 10000,
          asset: "circle",
          initialOffset: initialOffset,
          popSfx: this.squitchSfx,
          microtubule: actin,
          strongChance: this.percentMyocinWorking,
          baseStickiness: this.myocinBaseStickiness,
          stickinessVariation: this.myocinStickinessVariation,
          startDisabled: true,
          tint: 0xCCCC99,
          canAnchor: true,
          onReleaseMelanosome: function(){
            that.proteinReleaseMelanosomeSfx.play();
          },
          onGrabMelanosome: function(){
            that.grabSfx.play();
          }
        })


        if(actin.direction>0){
          this.myocinsUp.push(myo);
        }else{
          this.myocinsDown.push(myo);
        }
        this.myocinGroup.add(myo);

    }



    for(var i = 0;i<3;i++){
        this.spawnKinesin(this.microtubule_out, 0xCC6699, .3 * i);
        this.spawnDynein(this.microtubule_in, 0x99CCCC, .3 * i);
    }



    for(var i = 0;i<5;i++){
      var start_p = this.microtubule_out.getPositionAtOffset(i/5); 
      var mel = new MotorMelanosome({
        game: game,
        x: start_p.x,
        y: start_p.y + (game.rnd.frac()*200)-100,
        asset: "circle"
      })
      this.melanosomes.push(mel);
      this.melanosomeGroup.add(mel);
    }






    // for(var i = 0;i<=this.nucleusSlot.capacity;i++){
    //   this.spawnMelanosome(0);
    // }
    // for(var i = 0;i<=this.cellWallSlot.capacity;i++){
    //   this.spawnMelanosome(1);
    // }
    /** TYRs **/
    // for( var i = 0; i < this.size_tyr_count; i++ ) {
    //   this.spawnTyr(i*(360/this.size_tyr_count));
    // }

    /** TRPs **/
    //     for( var i = 0; i < this.size_trp_count * 20; i++ ) {
    //   this.spawnTrp(-i*20,0);
    // }







    this.colorIndicators = new ColorIndicators({"game": game, "x": 0, "y": 0, "showStart":true, "showTarget": true});
    this.colorIndicators.updateColors("motor", this.numSlotted/this.game.cellModel.get("maxSlotted"));
    this.aboveAllGroup.add(this.colorIndicators);


    this.topCover = game.add.sprite(0,0,"square");
    this.topCover.width = 2048;
    this.topCover.height = 2048;
    this.squiggleSprite.alpha = 1;
    this.topCover.tint = game.stage.backgroundColor;
    game.add.tween(this.topCover).to({"alpha": 0}, 3000).start();






    if(game.datgui){
      game.datgui.destroy();
    }


    // game.datgui = new dat.GUI({load: JSON});
    // game.datgui.remember(this);

    // var myocinFolder = game.datgui.addFolder("Myocin");

    // myocinFolder.add(this, 'myocinSpawnsPerSecond', 0.001, 10);
    // // myocinFolder.add(this, 'myocinBaseStickiness', 0.05, 10);
    // // myocinFolder.add(this, 'myocinStickinessVariation', 0.1, 10);

    // var kinesinFolder = game.datgui.addFolder("Kinesin");
    // kinesinFolder.add(this, 'kinesinSpawnsPerSecond', 0.001, 10);
    // kinesinFolder.add(this, 'percentKinesinWorking', 0, 1);
    // // kinesinFolder.add(this, 'kinesinBaseStickiness', 0.05, 10);
    // // kinesinFolder.add(this, 'kinesinStickinessVariation', 0.1, 10);

    // var dyneinFolder = game.datgui.addFolder("Dynein");
    // dyneinFolder.add(this, 'dyneinSpawnsPerSecond', 0.001, 10);
    // dyneinFolder.add(this, 'percentDyneinWorking', 0, 1);
    // // dyneinFolder.add(this, 'dyneinBaseStickiness', 0.05, 10);
    // // dyneinFolder.add(this, 'dyneinStickinessVariation', 0.1, 10);

    // game.datgui.add(this, "gotoSizeActivity");
    // game.datgui.add(this, "gotoGateActivity");





    this.timer = this.game.time.create(false);
    this.spawnMelanosomesForever();
    this.spawnMyocinForever();
    this.spawnKinesinsForever();
    this.spawnDyneinsForever();
    this.timer.start();

    this.resize();
  }




  handleReturnFromNucleus(){

      var resultingGeneticColor = game.cellModel.getGeneticColorName();
      var resultingGeneticState = game.cellModel.colorToState(resultingGeneticColor);
      var targetState=game.cellModel.target_state;
      if(resultingGeneticState.numSlotted == targetState.numSlotted){
        this.successfulNucleusReturn();
      }else{
        //womp womp
        //todo?
      }







      // if(resultingGeneticColor == this.cellModel.get("target_color")){
      //     this.successfulNucleusReturn();
      // }else{

      // }
  }


  successfulNucleusReturn(){
    //todo
    console.warn("Motor activity Nucleus return not implemented.");
    game.hideHud();
  }





  updateMyocinAlleles(){

    this.myocin_allele_a = game.cellModel.getCurrentAllele("Chromosome2A", "myocin_grabber");
    this.myocin_allele_b = game.cellModel.getCurrentAllele("Chromosome2B", "myocin_grabber");


    this.percentMyocinWorking = 0;
    if(this.myocin_allele_a.value == true){
      this.percentMyocinWorking+=.5;;
    }
    if(this.myocin_allele_b.value == true){
      this.percentMyocinWorking+=.5;;
    }
  }


  createSlots(){
    // var ct = 0;

    for(var i = 0;i<this.actins.length;i++){


          var distFromCenter = .24 * this.actins[i].direction;
        
          if(i%4==0 || i%4==1){
            var distFromCenter = .16 * this.actins[i].direction;
          }


          var end_p = this.actins[i].getPositionAtOffset(.5 + distFromCenter);
          var end_slot = this.createSlot(end_p.x, end_p.y, this.actins[i], true, (.5 + (distFromCenter * 1.2)));

          end_slot.spawnDirection = {"x": 0, "y": -1};

          this.actinSlots.push(end_slot);





    }


    // var nucleus_p = this.microtubule_middle.getPositionAtOffset(.1);
    // var cellWall_p = this.microtubule_middle.getPositionAtOffset(.9);

    // var nucleus_slot = this.createSlot(nucleus_p.x, nucleus_p.y);
    // nucleus_slot.capacity = 20;
    // nucleus_slot.scale.set(1);
    // nucleus_slot.spawnDirection = {"x": 2, "y": 0};
    // nucleus_slot.extents = 28;
    // this.nucleusSlot = nucleus_slot;

    // var wall_slot = this.createSlot(cellWall_p.x, cellWall_p.y);
    // wall_slot.capacity = 20;
    // wall_slot.scale.set(1);
    // wall_slot.spawnDirection = {"x": -2, "y": 0};
    // wall_slot.extents = 28;
    // this.cellWallSlot = wall_slot;

  }
  createSlot(x, y, microtubule, isActive, offset){
    var that = this;
    var slot = new MotorMelanosomeSlot({
      game: game,
      x: x,
      y: y,
      microtubule: microtubule,
      squirtSfx: this.squirtSfx,
      asset: "circle",
      offset: offset,
      isActive: isActive,
      onAddCallback: function(){ 
        that.numSlotted++; 
        that.colorIndicators.updateColors("motor", that.numSlotted/that.game.cellModel.get("maxSlotted"));
        that.onSlotSfx.play();
      },
      onReleaseCallback: function(){ 
        that.numSlotted --; 
        that.colorIndicators.updateColors("motor", that.numSlotted/that.game.cellModel.get("maxSlotted"));
        that.onReleaseSfx.play();
      }
    });
    slot.x = x;
    slot.y = y;
    this.slotGroup.add(slot);
    return slot;
  }



  spawnMyocin(actin){
    
    var that = this;

    if(actin == null){
      var choice = game.rnd.integerInRange(0, this.actins.length-1);
      actin = this.actins[choice];
    }
    var myo = new Kinesin({
      game: game,
      x: 0,
      y: 0,
      asset: "circle",
      popSfx: this.squitchSfx,
      microtubule: actin,
      strongChance: this.percentMyocinWorking,
      baseStickiness: this.myocinBaseStickiness,
      stickinessVariation: this.myocinStickinessVariation,
      tint: 0xCCCC99,
      canAnchor: true,
      onReleaseMelanosome: function(){
        that.proteinReleaseMelanosomeSfx.play();
      },
      onGrabMelanosome: function(){
        that.grabSfx.play();
      }
    });

    if(actin.direction>0){
      this.myocinsUp.push(myo);
    }else{
      this.myocinsDown.push(myo);
    }
    this.myocinGroup.add(myo);
    return myo;
  }
  spawnMyocinForever(){
    this.spawnMyocin();
    game.time.events.add(1000/this.myocinSpawnsPerSecond, this.spawnMyocinForever, this);
  }



  spawnKinesin(microtubule, tint, initialOffset){
    var that = this;
    var kin = new Kinesin({
      game: game,
      x: 0,
      y: 0,
      asset: "circle",
      popSfx: this.squitchSfx,
      microtubule: microtubule,
      initialOffset: initialOffset,
      baseStickiness: this.kinesinBaseStickiness,
      strongChance: this.percentKinesinWorking,
      stickinessVariation: this.kinesinStickinessVariation,
      tint: tint,
      onReleaseMelanosome: function(){
        that.proteinReleaseMelanosomeSfx.play();
      },
      onGrabMelanosome: function(){
        that.grabSfx.play();
      }
    })
    this.kinesins.push(kin);
    this.kinesinGroup.add(kin);
  }
  spawnDynein(microtubule, tint, initialOffset){
    var that = this;
    var kin = new Kinesin({
      game: game,
      x: 0,
      y: 0,
      asset: "circle",
      popSfx: this.squitchSfx,
      microtubule: microtubule,
      initialOffset: initialOffset,
      baseStickiness: this.kinesinBaseStickiness,
      strongChance: this.percentDyneinWorking,
      stickinessVariation: this.kinesinStickinessVariation,
      tint: tint,
      onReleaseMelanosome: function(){
        that.proteinReleaseMelanosomeSfx.play();
      },
      onGrabMelanosome: function(){
        that.grabSfx.play();
      }
    })
    this.dyneins.push(kin);
    this.kinesinGroup.add(kin);
  }


  spawnKinesinsForever(){
    var chosenMicrotubule = this.microtubule_out;
      // chosenMicrotubule = this.microtubule_in;
    this.spawnKinesin(chosenMicrotubule, 0xCC6699);
    var that = this;
    game.time.events.add(1000/this.kinesinSpawnsPerSecond, this.spawnKinesinsForever, this);
  }
  spawnDyneinsForever(){
    var chosenMicrotubule = this.microtubule_in;
    this.spawnDynein(chosenMicrotubule, 0x99CCCC, 1.2);
    var that = this;
    game.time.events.add(1000/this.dyneinSpawnsPerSecond, this.spawnDyneinsForever, this);
  }
  spawnMelanosome(force_choice){
    var choice = game.rnd.integerInRange(0, 1);
    if(force_choice != null){
      choice = force_choice;
    }
    var start_p = {};
    if(choice===0){
      start_p = this.microtubule_in.getPositionAtOffset(1.2);
    }
    if(choice===1){
      start_p = this.microtubule_out.getPositionAtOffset(-.05);
    }


    var mel = new MotorMelanosome({
      game: game,
      x: start_p.x,
      y: start_p.y,
      asset: "circle"
    })
    this.melanosomes.push(mel);
    this.melanosomeGroup.add(mel);
    return mel;
  }
  spawnMelanosomesForever(){
    this.spawnMelanosome();
    this.game.time.events.add(5000, this.spawnMelanosomesForever, this);
  }

  update(){
    if(this.numSlotted == this.targetNumSlotted && this.canWin){
      this.handleWin();
    }
    this.checkForOverlap();

  }

  handleWin(){

    if(this.hasWon !== true){
      this.hasWon = true;
      game.input.enabled = false;
      game.hideHud();

      //play pretty sound
      this.winSfx.play();

      for(let i=0;i<this.pulses.length;i++){
        let pulse = this.pulses[i];
        pulse.alpha = .5;
        pulse.blendMode = 1;
        // pulse.tint = 0x238087;
        game.add.tween(pulse).to({"width": 4000, "height": 4000, "alpha": 0}, 1000*(i+1), Phaser.Easing.Cubic.Out).start();
      }


      game.time.events.add(2500, function(){
        game.tweens.removeFrom(this.topCover);
        game.add.tween(this.topCover).to({"alpha": 1}, 1000).start();
        //return to cell view
        this.phone.post("activityWin", {
          "activity": "motor",
          "cellModel": game.cellModel.toJSON(),
          "resultingGeneticColor": game.cellModel.getGeneticColorName(),
          "geneticShortcode": game.cellModel.getGeneticShortcode()
        });
        // window.location.href = "debug.html";
      }, this);

    }
  }

  handleExit(){

    if(this.isExiting !== true){
      this.isExiting = true;
      game.input.enabled = false;
      
      game.tweens.removeFrom(this.topCover);
      game.add.tween(this.topCover).to({"alpha": 1}, 1000).start();
      game.hideHud();

      game.time.events.add(1501, function(){
        game.paused = true;
        this.phone.post("activityExit", {
          "activity": "motor",
          "cellModel": game.cellModel.toJSON(),
          "resultingGeneticColor": game.cellModel.getGeneticColorName(),
          "geneticShortcode": game.cellModel.getGeneticShortcode()
        });
        // window.location.href = "debug.html";
      }, this);

    }

  }

  checkForOverlap(){

      for(var i = 0;i<this.melanosomes.length;i++){
          var mel = this.melanosomes[i];

          //if the melanosome is not in a slot
          if(mel.wasGrabbed !== true){


            //check for collisions with all myocin
            for( var j = 0; j < this.myocinsUp.length; j++ ) {
                var myo = this.myocinsUp[ j ];
                if(myo.grabbedMelanosome === null){
                    this.game.physics.arcade.overlap(myo.grabber, mel.c3, function(myoGrabber, mel){
                        // mel.velocity.x+= myo.velocity.x * myo.stickiness * .75;
                        // mel.velocity.y+= myo.velocity.y * myo.stickiness * .75;
                        myo.grab(mel.parent);
                    }, null, this);
                }
            }
            for( var j = 0; j < this.myocinsDown.length; j++ ) {
                var myo = this.myocinsDown[ j ];
                if(myo.grabbedMelanosome === null){
                    this.game.physics.arcade.overlap(myo.grabber, mel.c1, function(myoGrabber, mel){
                        // mel.velocity.x+= myo.velocity.x * myo.stickiness * .75;
                        // mel.velocity.y+= myo.velocity.y * myo.stickiness * .75;
                        myo.grab(mel.parent);
                    }, null, this);
                }
            }


            //check for collisions with all kinesin
            for( var k = 0; k < this.kinesins.length; k++ ) {
                var kin = this.kinesins[ k ];

                this.game.physics.arcade.overlap(kin.grabber, mel.c4, function(kinGrabber, mel){
                    // mel.velocity.x+= kin.velocity.x * kin.stickiness * .75;
                    // mel.velocity.y+= kin.velocity.y * kin.stickiness * .75;
                    kin.grab(mel.parent);
                }, null, this);
            }
            for( var k = 0; k < this.dyneins.length; k++ ) {
                var dyn = this.dyneins[ k ];

                this.game.physics.arcade.overlap(dyn.grabber, mel.c2, function(dynGrabber, mel){
                    // mel.velocity.x+= dyn.velocity.x * dyn.stickyness * .75;
                    // mel.velocity.y+= dyn.velocity.y * dyn.stickyness * .75;
                    dyn.grab(mel.parent);
                }, null, this);
            }

            for( var s = 0; s < this.actinSlots.length; s++ ) {
                var slot = this.actinSlots[ s ];
                if(slot.isActive === true){
                  this.game.physics.arcade.overlap(slot, mel, function(slot, mel){
                      // mel.applyFriction(.98);
                      if(mel.wasGrabbed!== true){
                        slot.addMelanosome(mel);
                      }
                  }, null, this);
                }
            }

            // this.game.physics.arcade.overlap(this.nucleusSlot, mel, function(slot, mel){
            //     if(mel.wasGrabbed!== true){
            //       slot.addMelanosome(mel);
            //     }
            // }, null, this);
            // this.game.physics.arcade.overlap(this.cellWallSlot, mel, function(slot, mel){
            //     if(mel.wasGrabbed!== true){
            //       slot.addMelanosome(mel);
            //     }
            // }, null, this);
          }

      }

    this.game.stage.filterArea = new Phaser.Rectangle(0,0,this.game.width, this.game.height);

  }
  render () {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.mushroom, 32, 32)
    // }
  }
  resize(){

    var lGameScale=Math.round(10000 * Math.min(this.game.width/config.SAFE_ZONE_WIDTH,this.game.height / config.SAFE_ZONE_HEIGHT)) / 10000;
    this.world.scale.setTo (lGameScale,lGameScale);

    this.backgroundSprite.width = game.width;
    this.backgroundSprite.height = game.height;
    
    this.microtubuleGroup.scale.setTo (lGameScale,lGameScale);
    this.actinGroup.scale.setTo (lGameScale,lGameScale);
    this.myocinGroup.scale.setTo (lGameScale,lGameScale);
    this.kinesinGroup.scale.setTo (lGameScale,lGameScale);
    this.slotGroup.scale.setTo (lGameScale,lGameScale);
    this.melanosomeGroup.scale.setTo (lGameScale,lGameScale);
    this.backgroundBlobsGroup.scale.setTo (lGameScale,lGameScale);
    this.aboveAllGroup.scale.setTo (lGameScale,lGameScale);

    this.aboveAllGroup.x = this.backgroundBlobsGroup.x = this.melanosomeGroup.x = this.slotGroup.x = this.kinesinGroup.x = this.myocinGroup.x = this.actinGroup.x = this.microtubuleGroup.x = this.world.x=(this.game.width-config.SAFE_ZONE_WIDTH*lGameScale)/2;
    this.aboveAllGroup.y = this.backgroundBlobsGroup.y = this.melanosomeGroup.y = this.slotGroup.y = this.kinesinGroup.y = this.myocinGroup.y = this.actinGroup.y = this.microtubuleGroup.y = this.world.y=(this.game.height-config.SAFE_ZONE_HEIGHT*lGameScale)/2;


  }

  shutdown(){
    for(var i = 0;i<this.kinesins.length;i++){
      this.kinesins[i].destroy();
    }
    for(var i = 0;i<this.melanosomes.length;i++){
      this.melanosomes[i].destroy();
    }
    for(var i = 0;i<this.myocins.length;i++){
      this.myocins[i].destroy();
    }
    for(var i = 0;i<this.actins.length;i++){
      this.actins[i].destroy();
    }
    for(var i = 0;i<this.actinSlots.length;i++){
      this.actinSlots[i].destroy();
    }
    
    for(var i = 0;i<game.stage.filters;i++){
      game.stage.filters[i].destroy();
    }
    game.stage.filters = null;
    this.backgroundSprite.destroy();
    this.squiggleSprite.destroy();
    this.squiggleBmd.destroy();
    this.world.destroy();

  }

  gotoGateActivity(){
    this.gotoState("GateActivity");
  }
  gotoSizeActivity(){
    this.gotoState("SizeActivity");
  }
  gotoState(stateName){
    this.state.start(stateName, true, false);

  }
}
