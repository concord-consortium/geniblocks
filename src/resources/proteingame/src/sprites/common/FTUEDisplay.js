import Phaser from 'phaser'
import config from '../../config'
import FTUEData from '../../../assets/data/ftue'


export default class extends Phaser.Group {

    constructor ({ game, x, y, data, step=0 }) {
        super(game, x, y);

        this.game = game;
        this.alpha = 1;
        this.x = 230;
        this.y = config.SAFE_ZONE_HEIGHT - 230;

        this.numChecks = data.count || 3;
        this.step = step;
        this.actionsPerformed = 0;

        game.actions.onAction.add(this.onActionPerformed, this);


        this.container = game.add.image(0, 40, "ftue_container");
        this.container.anchor.set(.5);
        this.add(this.container);
        
        var textStyle = {font: "30px yanone_kaffeesatzregular", fill: "#FFFFFF"}
        this.text = game.add.text(-160, -25, FTUEData.steps[this.step].text, textStyle);
        this.add(this.text);

        this.action = game.add.image(0, 65, "ftue_" + FTUEData.steps[this.step].action);
        this.action.anchor.set(.5);
        this.add(this.action);

        this.checkGroup = game.add.group(this, "ftue_check_group");
        this.add(this.checkGroup);
        this.checkContainer = game.add.graphics(-50,-20);
        this.checkContainer.lineStyle(4, 0x318080,1); 
        this.checkContainer.beginFill(0xFFFFFF, 1);
        this.checkContainer.drawRoundedRect(0, 0, this.numChecks * 30+10, 40, 18);
        this.checkContainer.endFill();
        this.checkGroup.add(this.checkContainer);

        this.checks = [];
        for(var i=0; i<this.numChecks; i++) {
            var check = game.add.image((i-1)*30, 0, "ftue_check");
            check.anchor.set(.5);
            this.checkGroup.add(check);
            this.checks.push(check);
        }
        this.checkGroup.x = this.container.width/2 - 40;
        if(this.numChecks > 3) {
            this.checkGroup.x -= (this.numChecks - 3) * 15;
        }
        this.checkGroup.y = -10;

        

        this.stepGroup = game.add.group(this, "ftue_step_group");
        this.add(this.stepGroup);
        this.stepContainer = game.add.image(0, 0, "ftue_step_container");
        this.stepGroup.add(this.stepContainer);

        this.stepSelection = game.add.image(-2 + this.step * 53, -2, "ftue_step_selection");
        this.add(this.stepSelection);
        this.stepGroup.add(this.stepSelection);

        var regStyle = { font: "bold 42px yanone_kaffeesatzregular", fill: "#CCCC99", boundsAlignV: "center" }
        var selectStyle = { font: "bold 42px yanone_kaffeesatzregular", fill: "#FFFFFF", boundsAlignV: "center" }
    
        this.stepNums = [];
        for(var i=0; i<4; i++) {
            var numText = game.add.text(i * 52 + 23, 2, i+1, i==this.step ? selectStyle : regStyle);
            this.stepGroup.add(numText);
            this.stepNums.push(numText);
        }

        this.stepGroup.y = -this.container.height/2 - 2;
        this.stepGroup.x = -this.container.width/2 + 2;


        this.checkSfx = game.add.audio("pleasing_ding");
    }

    slideIn(pos) {
        this.checkGroup.scale.set(0, 0);
        game.add.tween(this).to(pos, 500, Phaser.Easing.Cubic.Out, true, 1500).start();
        game.add.tween(this.checkGroup.scale).to({x: 1, y: 1}, 400, Phaser.Easing.Elastic.Out, true, 2400).start();
    }

    slideOut(pos) {
        game.add.tween(this.checkGroup.scale).to({x: 0, y: 0}, 400, Phaser.Easing.Cubic.Out, true, 1000).start();
        game.add.tween(this).to(pos, 500, Phaser.Easing.Cubic.Out, true, 1800).start();
    }

    onActionPerformed(action){
        if(action.type !== FTUEData.steps[this.step].action)
            return;

        this.actionsPerformed++;
        var check = this.checks[this.actionsPerformed-1];
        check.loadTexture("ftue_check_active");

        var ping = game.add.image(check.x, check.y, "ftue_check_active");
        ping.anchor.set(.5);
        this.checkGroup.add(ping);
        game.add.tween(ping).to({alpha:0}, 500, Phaser.Easing.Linear.Out).start();
        game.add.tween(ping.scale).to({x:5, y:5}, 500, Phaser.Easing.Linear.Out).start();
        
        this.checkSfx.play();

        if(this.actionsPerformed === this.numChecks){
            this.step++;
            game.actions.onAction.remove(this.onActionPerformed, this);

            if(this.step < FTUEData.steps.length) {
                game.state.getCurrentState().handleWin(true);
            } else {
                game.state.getCurrentState().handleWin();
            }
        }
    }

    onStepLoaded(){
        
        this.actionsPerformed = 0;
        this.stepSelection.x = this.step * 60;
        this.action.loadTexture("ftue_" + FTUEData.steps[this.step].action);
    }
}