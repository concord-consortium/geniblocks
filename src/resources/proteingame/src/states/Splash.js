import Phaser from 'phaser'
import Backbone from 'backbone'
import ChromosomeView from '../views/ChromosomeView'
import NucleusView from '../views/NucleusView'
import HudView from '../views/HudView'
import ChromosomeModel from '../models/ChromosomeModel'
import CellModel from '../models/CellModel'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //

    //Common
    this.load.image('circle', 'assets/images/circle.png')
    this.load.image('square', 'assets/images/square.png')
    this.load.image('circle_outline', 'assets/images/circle_outline.png')
    this.load.image('dotted_circle', 'assets/images/dotted_circle.png')
    this.load.image('dashed_circle', 'assets/images/dashed_circle.png')
    this.load.image('hexagon', 'assets/images/common/hexagon.png')
    this.load.image('color_sparkles', 'assets/images/common/color_sparkles.png')
    this.load.image('mouse_trail', 'assets/images/mouse_trail.png')

    this.load.image('white_radial_gradient', 'assets/images/white_radial_gradient.png')
    this.load.image('small_white_blur', 'assets/images/small_white_blur.png')
    this.load.image('medium_white_blur', 'assets/images/medium_white_blur.png')
    this.load.image('large_white_blur', 'assets/images/large_white_blur.png')
    this.load.image('blobs', 'assets/images/blobs256.png')

    this.load.image('white_drake', 'assets/images/white_drake.png')
    this.load.image('red_drake', 'assets/images/red_drake.png')
    this.load.image('shine_drake', 'assets/images/shine_drake.png')



    this.load.image('chromoscope_circle01', 'assets/images/chromoscope/chromoscope_circle01.png')
    this.load.image('chromoscope_circle02', 'assets/images/chromoscope/chromoscope_circle02.png')
    this.load.image('chromoscope_arrow_down', 'assets/images/chromoscope/arrow_down.png')

    this.load.image('chromoscope_charcoal', 'assets/images/chromoscope/chromoscope_charcoal.png')
    this.load.image('chromoscope_steel', 'assets/images/chromoscope/chromoscope_steel.png')
    this.load.image('chromoscope_ash', 'assets/images/chromoscope/chromoscope_ash.png')
    this.load.image('chromoscope_silver', 'assets/images/chromoscope/chromoscope_silver.png')
    this.load.image('chromoscope_lava', 'assets/images/chromoscope/chromoscope_lava.png')
    this.load.image('chromoscope_copper', 'assets/images/chromoscope/chromoscope_copper.png')
    this.load.image('chromoscope_sand', 'assets/images/chromoscope/chromoscope_sand.png')
    this.load.image('chromoscope_gold', 'assets/images/chromoscope/chromoscope_gold.png')
    this.load.image('chromoscope_frost', 'assets/images/chromoscope/chromoscope_frost.png')



    //size
    this.load.image('sizeMelanosome', 'assets/images/size_melanosome.png')
    this.load.image('sizeMelanosomeOutline', 'assets/images/size_melanosome_outline.png')
    this.load.image('size_goal', 'assets/images/size_goal.png')
    this.load.image('tyrosine', 'assets/images/tyrosine.png')
    this.load.image('tyr', 'assets/images/tyr.png')
    this.load.image('disc', 'assets/images/disc.png')
    this.load.image('trp_01', 'assets/images/trp_01.png')
    this.load.image('trp_02', 'assets/images/trp_02.png')
    this.load.image('trp_bar', 'assets/images/trp_bar.png')
    this.load.image('trp_flower', 'assets/images/trp_flower.png')
    this.load.image('tyrosine_crazy', 'assets/images/tyrosine_crazy_christina.png')

    


    this.load.image('whiteMelanosome', 'assets/images/white_melanosome.png')


    //ftue
    this.load.image('ftue_container', 'assets/images/ftue/action_container.png');
    this.load.image('ftue_step_container', 'assets/images/ftue/step_container.png');
    this.load.image('ftue_step_selection', 'assets/images/ftue/step_selection.png');
    this.load.image('ftue_check_container', 'assets/images/ftue/check_container.png');
    this.load.image('ftue_check', 'assets/images/ftue/check.png');
    this.load.image('ftue_check_active', 'assets/images/ftue/check_active.png');
    
    this.load.image('ftue_working_protein_assembled', 'assets/images/ftue/working_protein_assembled.png');
    this.load.image('ftue_disc_destroyed', 'assets/images/ftue/disc_destroyed.png');
    this.load.image('ftue_protein_broken', 'assets/images/ftue/protein_broken.png');
    this.load.image('ftue_tri_pushed_into_small_gear', 'assets/images/ftue/tri_pushed_into_small_gear.png');

    //motor
    this.load.image('motor_melanosome', 'assets/images/motor_melanosome.png')
    this.load.image('propeller_foot', 'assets/images/propeller_foot.png')
    this.load.image('myocin', 'assets/images/myocin.png')
    this.load.image('grabber', 'assets/images/grabber.png')
    this.load.image('gears', 'assets/images/gears.png')
  
    //gate
    this.load.image('gate_half', 'assets/images/gate_half.png')
    this.load.image('tunnel', 'assets/images/tunnel.png')
    this.load.image('gate_stopper_wing', 'assets/images/gate_stopper_wing_pink.png')
    this.load.image('gate_stopper_body_working', 'assets/images/gate_stopper_body_working.png')
    this.load.image('gate_stopper_body_broken', 'assets/images/gate_stopper_body_broken.png')
    this.load.image('gate_stopper_tail', 'assets/images/gate_stopper_tail.png')
    this.load.image('gate_melanosome', 'assets/images/melanocyte.png')
    this.load.image('dark_melanosome', 'assets/images/dark_melanosome.png')

    this.load.image("meter_outline", "assets/images/meter_outline.png")
    this.load.image("meter_fill", "assets/images/meter_fill.png")
    this.load.image("meter_indicator", "assets/images/meter_indicator.png")
    this.load.image("sparkle", "assets/images/sparkle_star.png")


    //audio

    //music

    //http://tones.wolfram.com/generate/GhYhjzvOhAbBmBxzvrfdz7G4VZwKpV0MNginSuDph50J
    // this.game.load.audio("bg-music", ["assets/audio/music/NKM-G-50-31-37641278-1-34056-64-75-4-2773-48-0-9-545-0-0-109-102-0-0-109-351-0.mp3", "assets/audio/music/NKM-G-50-31-37641278-1-34056-64-75-4-2773-48-0-9-545-0-0-109-102-0-0-109-351-0.ogg"]);

    //sfx
    this.game.load.audio("pop", ["assets/audio/sfx/244654__greenvwbeetle__pop-2.mp3", "assets/audio/sfx/244654__greenvwbeetle__pop-2.ogg"]);
    this.game.load.audio("squirt", ["assets/audio/sfx/167073__drminky__squelchy-squirt.mp3", "assets/audio/sfx/167073__drminky__squelchy-squirt.ogg"]);
    this.game.load.audio("squitch", ["assets/audio/sfx/233343__otisjames__squitch.mp3", "assets/audio/sfx/233343__otisjames__squitch.ogg"]);


    this.game.load.audio("click_hit", ["assets/audio/sfx/click_generic.mp3", "assets/audio/sfx/click_generic.ogg"])
    this.game.load.audio("dumbbell_attach", ["assets/audio/sfx/dumbbell_attach.mp3", "assets/audio/sfx/dumbbell_attach.ogg"])
    this.game.load.audio("dumbbell_break", ["assets/audio/sfx/dumbbell_break.mp3", "assets/audio/sfx/dumbbell_break.ogg"])
    this.game.load.audio("gate_close", ["assets/audio/sfx/gate_close.mp3", "assets/audio/sfx/gate_close.ogg"])
    this.game.load.audio("pleasing_ding", ["assets/audio/sfx/star_form.mp3", "assets/audio/sfx/star_form.ogg"])
    this.game.load.audio("popout", ["assets/audio/sfx/blocker_popout.mp3", "assets/audio/sfx/blocker_popout.ogg"])
    this.game.load.audio("rip", ["assets/audio/sfx/star_break.mp3", "assets/audio/sfx/star_break.ogg"])
    this.game.load.audio("blocker_insert", ["assets/audio/sfx/blocker_insert.mp3", "assets/audio/sfx/blocker_insert.ogg"])
    this.game.load.audio("forcefield", ["assets/audio/sfx/forcefield.mp3", "assets/audio/sfx/forcefield.ogg"])
    this.game.load.audio("compile", ["assets/audio/sfx/compile.mp3", "assets/audio/sfx/compile.ogg"])



    this.game.load.audio("win", ["assets/audio/sfx/win_state.mp3"]);

    


    this.load.json('cell_data', "assets/data/chromosome_data.json");
    this.load.json('all_working_data', "assets/data/all_working.json");
    this.load.json('tutorials', "assets/data/tutorials.json");
    // this.load.json('all_broken_data', "assets/data/all_broken.json");
    // this.load.json('all_hetero_data', "assets/data/hetero.json");

    // this.load.json('charcoal_hetero_trp', "assets/data/charcoal_hetero_trp.json");
    // this.load.json('lava_homozygous_broken_trp', "assets/data/lava_homozygous_broken_trp.json");
    // this.load.json('frost_homozygous_broken_tyr', "assets/data/frost_homozygous_broken_tyr.json");
    // this.load.json('copper_broken_tyr_hetero_asip', "assets/data/copper_broken_tyr_hetero_asip.json");
    // this.load.json('sand_broken_trp_hetero_myocin', "assets/data/sand_broken_trp_hetero_myocin.json");






  }




  create () {
    this.loaderBar.alpha = 0;
    this.loaderBg.alpha = 0;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // this.chromosomeView = new ChromosomeView({el: "#chromosome", model: chromosome1AModel });
    this.game.nucleusView = new NucleusView({el: "#nucleus", model: this.game.cellModel, game: this.game});
    this.game.hudView = new HudView({el: "#hud", model: this.game.cellModel, game: this.game });
    if(this.game.showStats) {
        this.game.hudView.showStats();
    }
     

    var initialState = game.initialState;
    
    game.phone.post("activityLoaded", {"hasTutorial":this.game.tutorialData != null});
    
    switch(initialState){
        case "size":
            this.game.state.start('SizeActivity');
            break;
        case "motor":
            this.game.state.start('MotorActivity');
            break;
        case "gate":
            this.game.state.start('GateActivity');
            break;
        case "nucleus":
            this.game.nucleusOnly = true; //hacky temp flag
            this.game.hudView.showNucleus();
            this.game.hideHud();
            break;

        default:
            this.game.state.start('SizeActivity');
            break;
    }

    game.stage.disableVisibilityChange = true;


  }

}
