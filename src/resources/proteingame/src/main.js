import 'pixi'
import 'p2'
import Phaser from 'phaser'

import iframePhone from 'iframe-phone'
import BootState from './states/Boot'
import SplashState from './states/Splash'
import SizeActivityState from './states/SizeActivity'
import MotorActivityState from './states/MotorActivity'
import GateActivityState from './states/GateActivity'
import FakeStateActivityState from './states/FakeStateActivity'
import BaseCellData from '../assets/data/all_working'
import TutorialData from '../assets/data/tutorials'
import FTUEData from '../assets/data/ftue'
import FTUEData_simplified from '../assets/data/ftue_simplified'

import NucleusView from './views/NucleusView'
import HudView from './views/HudView'
import CellModel from './models/CellModel'

import { getParameterByName } from './utils'

import config from './config'
import ActionTracker from './actionTracker';

class Game extends Phaser.Game {

  constructor () {
    const docElement = document.documentElement
    const width = window.innerWidth;// docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = window.innerHeight;//docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', '')
    //super(width, height, Phaser.AUTO, 'content', '')

    this.globalTimeScale = 1;

    this.phone = new iframePhone.getIFrameEndpoint();
    this.phone.initialize();


    this.phone.addListener('showTutorial', ()=>{
        this.hudView.showTutorial();
    });

    this.phone.addListener('hideTutorial', ()=>{
        this.hudView.hideTutorial();
    });


    this.phone.addListener('getActionStats', ()=>{
        this.phone.post('stats', this.actions.stats);
    });
    
    this.phone.addListener('showActionStats', ()=>{
        this.hudView.showStats();
    });

    this.phone.addListener('hideActionStats', ()=>{
        this.hudView.hideStats();
    });

    this.actions = new ActionTracker(this);
    var showStats = getParameterByName("stats");
    this.showStats = showStats && showStats === "true";

    
    this.initialState = getParameterByName("initial-state");

    //get custom starting conditions and build the model based on that
    var alleles = this.baseAlleles = getParameterByName("allele-shorthand");
    if(alleles){
        //already have them, do nothing?
    }else{
        alleles="11111111";
    }

    this.preAlleles = getParameterByName("pre-alleles");
    this.preTargetColor = getParameterByName("pre-target-color");

    
    this.numInitialStars = getParameterByName("num-stars");

    var target_color = getParameterByName("target-color");
    if(target_color){
        target_color = target_color.toLowerCase();
    }else{
        target_color = "lava";
    }
    this.finalTarget = target_color;


    
    var isBossLevel = getParameterByName("boss");
    if(isBossLevel){
        this.isBossLevel = true;
    }else{
        this.isBossLevel = false;
    }
    this.bossMoves = 0;
    
    var isNucleus = getParameterByName("nucleus");
    if(isNucleus){
        this.isNucleus = this.isBossLevel = true;
    }else{
        this.isNucleus = false;
    }

    
    this.relevantGeneShorthand = getParameterByName("relevant-gene-shorthand");
    
    var missionId = getParameterByName("mission");
    if(missionId){
        this.missionId = missionId;

        // temp hack so concord doesn't have to update the URL on their end
        var useFTUE = missionId == "3.2.1";

        if(useFTUE){
            this.ftueFile = FTUEData_simplified;
            this.ftueStep = 0;
            this.ftueData = this.ftueFile.steps[this.ftueStep];
        
            alleles = this.ftueData.alleles;
            this.numInitialStars = this.ftueData.stars;
        } else {
            
            this.tutorialData = TutorialData[missionId];
        
            // temp hack so concord doesn't have to update the URL
            if(missionId === "3.4.3") {
                alleles = this.baseAlleles = "00111111";
                this.initialState = "gate";
                this.finalTarget = "steel";
                this.isNucleus = true;
                this.relevantGeneShorthand = "11000011";
                this.isBossLevel = true;
                this.preAlleles = "11111111";
                this.preTargetColor = "charcoal";
                this.numInitialStars = 13;
            }
        }
    }

    this.loadCellData(alleles, this.finalTarget, this.numInitialStars);



    this.postNucleusMsgs = {
        'SizeActivity': "Watch as the proteins you created are delivered to the melapod.",
        'GateActivity': "Watch as the proteins you created are delivered to the tunnels.",
        'MotorActivity': ""
    }



    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('SizeActivity', SizeActivityState, false)
    this.state.add('MotorActivity', MotorActivityState, false)
    this.state.add('GateActivity', GateActivityState, false)
    this.state.add('FakeStateActivity', FakeStateActivityState, false)

    this.state.start('Boot')
  }

  loadCellData(alleles, targetColor, numStars){
      
    //base data structure of a cell, stored in /assets/data/all_working.json
    this.cellData = BaseCellData;

    //this is all hardcoded and bad, what else can be done?
    //use the allele-shorthand query string data to set the 'sellected_allele' for each gene
    //trp
    this.cellData.chromosomePairs[1].chromosomeA.genes[0].selected_allele = alleles[0];
    this.cellData.chromosomePairs[1].chromosomeB.genes[0].selected_allele = alleles[1];

    //tyr
    this.cellData.chromosomePairs[1].chromosomeA.genes[1].selected_allele = alleles[2];
    this.cellData.chromosomePairs[1].chromosomeB.genes[1].selected_allele = alleles[3];

    //myocin
    this.cellData.chromosomePairs[2].chromosomeA.genes[0].selected_allele = alleles[4];
    this.cellData.chromosomePairs[2].chromosomeB.genes[0].selected_allele = alleles[5];

    //asip
    this.cellData.chromosomePairs[0].chromosomeA.genes[0].selected_allele = alleles[6];
    this.cellData.chromosomePairs[0].chromosomeB.genes[0].selected_allele = alleles[7];




    
    if(this.relevantGeneShorthand){
        //already have them, do nothing?
    }else{
        this.relevantGeneShorthand="11111111";
    }

    //trp
    this.cellData.chromosomePairs[1].chromosomeA.genes[0].isRelevant = (this.relevantGeneShorthand[0] == '1');
    this.cellData.chromosomePairs[1].chromosomeB.genes[0].isRelevant = (this.relevantGeneShorthand[1] == '1');

    //tyr
    this.cellData.chromosomePairs[1].chromosomeA.genes[1].isRelevant = (this.relevantGeneShorthand[2] == '1');
    this.cellData.chromosomePairs[1].chromosomeB.genes[1].isRelevant = (this.relevantGeneShorthand[3] == '1');

    //myocin
    this.cellData.chromosomePairs[2].chromosomeA.genes[0].isRelevant = (this.relevantGeneShorthand[4] == '1');
    this.cellData.chromosomePairs[2].chromosomeB.genes[0].isRelevant = (this.relevantGeneShorthand[5] == '1');

    //asip
    this.cellData.chromosomePairs[0].chromosomeA.genes[0].isRelevant = (this.relevantGeneShorthand[6] == '1');
    this.cellData.chromosomePairs[0].chromosomeB.genes[0].isRelevant = (this.relevantGeneShorthand[7] == '1');




    //based on the current activity/state, modify the cell data and tell it what is active/relevant
    switch(this.initialState){
        case "size":
            this.cellData.chromosomePairs[1].isRelevant = true;
            this.cellData.current_pair_index = 1;

            if(this.cellData.chromosomePairs[1].chromosomeA.genes[0].isRelevant == true){
                this.cellData.initial_chromosome_location = this.cellData.chromosomePairs[1].chromosomeA.genes[0].location;
            }else if(this.cellData.chromosomePairs[1].chromosomeA.genes[1].isRelevant == true){
                this.cellData.initial_chromosome_location = this.cellData.chromosomePairs[1].chromosomeA.genes[1].location;
            }
            // this.cellData.chromosomePairs[1].chromosomeB.genes[0].isRelevant = true;
            // this.cellData.chromosomePairs[1].chromosomeA.genes[1].isRelevant = true;
            // this.cellData.chromosomePairs[1].chromosomeB.genes[1].isRelevant = true;

            break;
        case "motor":
            this.cellData.chromosomePairs[2].isRelevant = true;
            // this.cellData.chromosomePairs[2].chromosomeA.genes[0].isRelevant = true;
            // this.cellData.chromosomePairs[2].chromosomeB.genes[0].isRelevant = true;
            this.cellData.current_pair_index = 2;
            this.cellData.initial_chromosome_location = this.cellData.chromosomePairs[2].chromosomeA.genes[0].location;
            break;
        case "gate":
            this.cellData.chromosomePairs[0].isRelevant = true;
            // this.cellData.chromosomePairs[0].chromosomeA.genes[0].isRelevant = true;
            // this.cellData.chromosomePairs[0].chromosomeB.genes[0].isRelevant = true;
            this.cellData.current_pair_index = 0;
            this.cellData.initial_chromosome_location = this.cellData.chromosomePairs[0].chromosomeA.genes[0].location;
            break;
        default:
            this.cellData.chromosomePairs[1].isRelevant = true;
            // this.cellData.chromosomePairs[1].chromosomeA.genes[0].isRelevant = true;
            // this.cellData.chromosomePairs[1].chromosomeB.genes[0].isRelevant = true;
            // this.cellData.chromosomePairs[1].chromosomeA.genes[1].isRelevant = true;
            // this.cellData.chromosomePairs[1].chromosomeB.genes[1].isRelevant = true;
            this.cellData.current_pair_index = 1;
            this.cellData.initial_chromosome_location = this.cellData.chromosomePairs[1].chromosomeA.genes[0].location;
            break;
    }





    //setup model
    //in the future, we'll get some data from wrapper app, and plug it in here
    this.cellModel = new CellModel({
        "cellData": this.cellData,
        "chromosomePairs": this.cellData.chromosomePairs,
        "target_color": targetColor,
        "initial_stars": numStars
    });
  }

  useBossMove(){
      this.bossMoves++;
      
      if(this.isBossLevel) {
        // disabled until supported on CC's end
        //this.phone.post('moveUsed');
        console.log('moveUsed');
      }
  }

  handleReturnFromNucleus(){
    game.paused = false;
    var currentState = game.state.states[game.state.current];


    // show size game until target color is achieved
    // then gates game until target shine level achieved
    if(game.state.current === 'GateActivity' && game.isBossLevel
            && game.cellModel.getGeneticColorName() == game.finalTarget) {
        game.isPostNucleus = true;
        game.currentAlleles = this.cellModel.getGeneticShortcode();
    
        game.inPreScene = true;
        this.loadCellData(this.preAlleles, this.preTargetColor, this.numInitialStars);
        game.state.start('SizeActivity');

        game.hudView.showMessage(this.postNucleusMsgs['SizeActivity']);

    } else if(currentState && currentState.handleReturnFromNucleus) {
        currentState.handleReturnFromNucleus();
        var msg = this.postNucleusMsgs[game.state.current];
        if(msg != '') {
            game.hudView.showMessage(msg);
        } else {
            game.hudView.hideMessage();
        }
    }
  }

  handlePreSceneComplete(){
    this.inPreScene = false;
    this.loadCellData(game.currentAlleles, game.finalTarget, 0);
    game.state.start('GateActivity');
    
    game.hudView.showMessage(this.postNucleusMsgs['GateActivity']);
  }

  loadNextStep(){
      this.ftueStep++;
      if(this.ftueStep < this.ftueFile.steps.length) {
        this.ftueData = this.ftueFile.steps[this.ftueStep];
        
        this.globalTimeScale = this.ftueData.gameSpeed;

        this.numInitialStars = this.ftueData.stars;
        this.loadCellData(this.ftueData.alleles, null, this.numInitialStars);
        game.state.restart();
      } else {
          game.state.postWin();
      }
  }


  exit(){
    console.log("game.exit()");    
    console.log("ATTN: You'll probably need to re-focus on the app for it to unpause and complete the win.");
    game.state.states[game.state.current].handleExit();

    
  }
  fastExit(){
    this.phone.post("activityExit", {
      "activity": "gate",
      "cellModel": this.cellModel.toJSON()
    });
  }
  win(){
    console.log("game.win()");    
    console.log("ATTN: You'll probably need to re-focus on the app for it to unpause and complete the win.");
    game.state.states[game.state.current].handleWin();
  }

  hideHud(hideMessage){
    this.hudView.hideEverything(hideMessage);

  }


}

window.game = new Game()

// disable context menu to prevent Chromebook issues
window.addEventListener("contextmenu", function(e) {e.preventDefault();})
