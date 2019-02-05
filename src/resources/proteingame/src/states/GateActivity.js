/* globals __DEV__ */
import Phaser from 'phaser'
import dat from 'dat-gui'
import iframePhone from 'iframe-phone'
import ExpandingCircles from '../sprites/common/ExpandingCircles'
import ColorIndicators from '../sprites/common/ColorIndicators'
import GateMelanosome from '../sprites/gate_activity/GateMelanosome'
import Gate from '../sprites/gate_activity/Gate'
import GateStopper from '../sprites/gate_activity/GateStopper'
import Sparkle from '../sprites/gate_activity/Sparkle'
import config from '../config'



export default class extends Phaser.State {
    init (onFinishCallback) {
        this.onFinishCallback = onFinishCallback

    }
    create () {
        

        this.phone = new iframePhone.getIFrameEndpoint();
        this.phone.initialize();

        this.numGates = 11;
        
        this.gaps = [.34, .42, .51, .60, .67];
        this.gapSize = .04;

        this.bCellPos = 0.15;
        this.tCellPos = 0.47;
        this.sparklePos = 0.55;

        this.gates = [];
        this.stoppers = [];
        this.melanosomes = [];
        this.escapedMelanosomes = [];
        this.walls = [];


        this.maxFloatingStoppers = 8;
        this.numFloatingStoppers = 0;

        // action data tracking
        game.actions.track([
            "pushed_toward_nucleus", 
            "pushed_through_gate", 
            "working_stopper_removed", 
            "broken_stopper_removed",
            "gate_closed",
            "gate_left_open"
        ]);
        this.gateTimers = [];


        this.backgroundBlobsGroup = game.add.group();
        this.cellGroup = game.add.group();
        this.melanosomeCollisionGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.world = game.add.group();
        this.hudGroup = game.add.group();
        this.aboveAllGroup = game.add.group();
        
        this.sparkle = this.cellGroup.add(new Sparkle({
            game: game,
            x: this.sparklePos * 2048,
            y: -100,
            width: 0.1 * 2048,
            height: config.SAFE_ZONE_HEIGHT +200,
            density: 0,
            targetGroup: this.cellGroup
        }));


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

        

        this.gateCloseSfx = this.game.add.audio("dumbbell_attach");
        this.gateOpenSfx = this.game.add.audio("dumbbell_break");

        this.popoutSfx = this.game.add.audio("popout");
        this.blockerInsertSfx = this.game.add.audio("blocker_insert");

        this.melanosomeEscapeSfx = this.game.add.audio("pleasing_ding");
        this.melanosomeEscapeSfx.volume = 0;


        this.winSfx = this.game.add.audio("win");

        this.path_points = { 
            'x': [0, 60, 300, 60, 0], 
            'y': [0, 2048]
        };




        this.backgroundBmd = game.add.bitmapData(1024, 1024);
        this.cellBackgroundSprite = game.add.image(config.SAFE_ZONE_WIDTH/2,config.SAFE_ZONE_HEIGHT/2, this.backgroundBmd);
        this.cellBackgroundSprite.anchor.set(.5);
        this.cellBackgroundSprite.x -= 512;
        this.cellBackgroundSprite.alpha = .8;

        this.cellGroup.add(this.cellBackgroundSprite);

        //adjusts circular gradient to match cell wall curve
        var cellCurveScale = 1.2;

        this.cellBmd = game.add.bitmapData(512, 512)///cellCurveScale);
        this.cellSprite = game.add.image(config.SAFE_ZONE_WIDTH/2, config.SAFE_ZONE_HEIGHT/2, this.cellBmd);
        this.cellSprite.anchor.set(1, .5);
        this.cellSprite.scale.set(2/1.8, 2);///cellCurveScale);
        this.cellSprite.x -= 300;

        this.cellWallBmd = game.add.bitmapData(1024, 1024);
        this.cellWallSprite = game.add.image(config.SAFE_ZONE_WIDTH/2, config.SAFE_ZONE_HEIGHT/2, this.cellWallBmd);
        this.cellWallSprite.anchor.set(1, .5);

        this.cellGroup.add(this.cellSprite);
        this.cellGroup.add(this.cellWallSprite);

        var topCellOffset = 41;
        cellCurveScale = 1.85;
        this.topCellBmd = game.add.bitmapData(1024, 1024/cellCurveScale);
        this.topCellSprite = game.add.sprite(config.SAFE_ZONE_WIDTH/2-topCellOffset, config.SAFE_ZONE_HEIGHT/2, this.topCellBmd);
        this.topCellSprite.anchor.set(0, .5);
        this.topCellSprite.scale.set(1, cellCurveScale);
        this.topCellSprite.alpha = 1;

        this.cellGroup.add(this.topCellSprite);


        this.topCellWallBmd = game.add.bitmapData(1024, 1024);
        this.topCellWallSprite = game.add.sprite(config.SAFE_ZONE_WIDTH/2, config.SAFE_ZONE_HEIGHT/2, this.topCellWallBmd);
        this.topCellWallSprite.anchor.set(.5);
        this.topCellWallSprite.alpha = 1;

        this.cellGroup.add(this.topCellWallSprite);




        this.melanosomesSpawnedPerSecond = .5;
        this.stoppersSpawnedPerSecond = 1.5;


        this.percentWorkingGates = 1;
        this.updateStopperAlleles();
        game.cellModel.on("change", this.updateStopperAlleles, this);




        //spawn that many melanosomes on the other side of the wall
        this.maxEscaped = game.cellModel.get("maxEscaped");
        this.initialEscapedCount = 0;

        //get num escaped
        if(this.percentWorkingGates>.9){
            this.initialEscapedCount = this.maxEscaped;
        }
        this.numEscaped = 0;

        for(var i = 0;i<this.initialEscapedCount;i++){

            this.spawnEscapedMelanosome((i + 5) * 2000);
        }



        this.targetNumEscaped = game.cellModel.target_state.numEscaped;


        this.unwinnableGracePeriod = 5000;
        this.canWin = false;
        game.time.events.add(this.unwinnableGracePeriod, function(){
          this.canWin = true;
        }, this)





        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.stage.backgroundColor = '#001A38';


        
        var blobs = game.add.image(config.SAFE_ZONE_WIDTH/2, config.SAFE_ZONE_HEIGHT/2, "blobs");
        blobs.scale.set(4, 5);
        blobs.anchor.set(.5);
        blobs.alpha = 0.7;
        this.backgroundBlobsGroup.add(blobs);



        this.updateColors();

        this.drawCells();



        this.mouseCursorHitArea = game.add.sprite(0,0,"circle");
        this.mouseCursorHitArea.anchor.set(.5);
        this.mouseCursorHitArea.alpha = 0;
        this.mouseCursorHitArea.width = this.mouseCursorHitArea.height = 64;
        game.physics.enable(this.mouseCursorHitArea, Phaser.Physics.ARCADE);


        this.expandingCircles = new ExpandingCircles({
            game: game,
            x: config.SAFE_ZONE_WIDTH/2, 
            y: config.SAFE_ZONE_HEIGHT/2
        });
        this.aboveAllGroup.add(this.expandingCircles);







        this.colorIndicators = new ColorIndicators({"game": game, "x": 0, "y": 0, "showStart":true, "showTarget": true});
        this.colorIndicators.updateColors("gate", this.numEscaped/this.maxEscaped);
        this.hudGroup.add(this.colorIndicators);




 


        this.topCover = game.add.sprite(0,0,"square");
        this.topCover.width = 2048;
        this.topCover.height = 2048;
        this.topCover.tint = game.stage.backgroundColor;
        game.add.tween(this.topCover).to({"alpha": 0}, 3000).start();




        // if(game.datgui){
        //   game.datgui.destroy();
        // }
        // game.datgui = new dat.GUI({load: JSON});
        // game.datgui.remember(this);
        // game.datgui.closed = true;
        
        // game.datgui.add(this, 'melanosomesSpawnedPerSecond', 0.001, 10);
        // game.datgui.add(this, 'stoppersSpawnedPerSecond', 0.001, 10);
        // // game.datgui.add(this, 'percentWorkingGates', 0, 1).listen();

        // game.datgui.add(this, "gotoSizeActivity");
        // game.datgui.add(this, "gotoMotorActivity");





        // this.SpawnGateStoppersForever();
        game.time.events.add((1000/this.melanosomesSpawnedPerSecond)/game.globalTimeScale, this.SpawnMelanosomesForever, this)

        this.timer = this.game.time.create(false);
        this.timer.start();




        game.hudView.loadTutorial(this, "protein");


        if(game.isNucleus){
            game.input.enabled = false;
            if(game.isPostNucleus){
                this.handleReturnFromNucleus();
            }else{
                game.hudView.showNucleus(true);
            }
        }

        
        this.checkForOverlap();
        this.resize();
        this.checkForOverlap();
        this.checkForBounce();
    }

    updateStopperAlleles(){

        var allele1 =  game.cellModel.getCurrentAllele("Chromosome0A", "gate_stopper_button");
        var allele2 = game.cellModel.getCurrentAllele("Chromosome0B", "gate_stopper_button");

        this.percentWorkingGates = 0;
        if(allele1.value == true){
          this.percentWorkingGates+=.5;;
        }
        if(allele2.value == true){
          this.percentWorkingGates+=.5;;
        }


        for(var i = 0;i<this.stoppers.length;i++){
            if(i<this.stoppers.length/2){
                this.stoppers[i].isWorking = allele1.value;
            }else{
                this.stoppers[i].isWorking = allele2.value;
            }

            this.stoppers[i].redraw();
        }

    }


    updateColors() {

        this.genColor = game.cellModel.getGeneticColorName();

        switch(this.genColor) {
            case "steel":
            case "charcoal":
                this.fillColor = "#333333";
                this.melImage = "dark_melanosome";
                break;
            case "copper":
            case "lava":
                this.fillColor = "#E34A15";
                this.melImage = "gate_melanosome";
                break;
            case "sand":
            case "gold":
                this.fillColor = "#E3E315";
                this.melImage = "gate_melanosome";
                break;
            default:
                this.fillColor = "#FFFFFF";
                this.melImage = "gate_melanosome";
                break;
        }
    }


    drawCells(){
        var totalThickness = 14;
        var spacing = totalThickness/2;
        var yDelta = (1 / 2048) * spacing;
        var lineColorString = "#CA9B8C";
        

        this.cellBmd.clear();

        for (var i = 0; i <= 1; i += (yDelta))
        {
            var shouldDraw = true;

            for(var j = 0;j<this.gaps.length;j++){
                if(i > this.gaps[j]-(this.gapSize/2) && i < this.gaps[j] + (this.gapSize/2) ){
                    shouldDraw = false;
                }
            }

            if(shouldDraw){
                var px = this.game.math.bezierInterpolation(this.path_points.x, i) + 2048 * this.bCellPos;//config.SAFE_ZONE_WIDTH/2;
                var py = this.game.math.bezierInterpolation(this.path_points.y, i) - 512;
                
                this.cellWallBmd.circle(px, py, totalThickness, lineColorString);                
            }
        }

        var w=this.cellBmd.width, h=this.cellBmd.height;
        var ctx = this.cellBmd.context;

        var grad = ctx.createRadialGradient(-w, h/2, w, 0, h/2, w*2);
        this.setGradientAlphaStops(grad, this.fillColor, [
            [.15,1],
            [.22,.6],
            [.28,0]
        ]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
            
        

        // tunnels
        var tunnelWidth = (this.tCellPos - this.bCellPos) * 2048 * 1.4;
        for(var i = 0;i<this.gaps.length;i++){
            var x_offset = tunnelWidth/2 - 50;
            var y_offset = (2048-config.SAFE_ZONE_HEIGHT)/2;
            var px = this.game.math.bezierInterpolation(this.path_points.x, this.gaps[i]) + x_offset;
            var py = this.game.math.bezierInterpolation([0, 2048], this.gaps[i]) - y_offset;
            
            var tunnelSprite = game.add.sprite(px, py, "tunnel");
            tunnelSprite.tint = 0xD0C573;
            tunnelSprite.anchor.set(.5);
            tunnelSprite.height = 128;
            tunnelSprite.width = tunnelWidth;
            this.cellGroup.add(tunnelSprite);

            for(var x = 0; x < px; x+=2){
                this.backgroundBmd.circle(x+125, py - (Math.sin(x*.05)*3)+y_offset - 512, 5, "#669999");
            }

        }

        this.cellGroup.bringToTop(this.cellSprite);
        this.cellGroup.bringToTop(this.cellWallSprite);


        this.createTopCell();

        // gates
        var that = this;
        for(var i = 0; i<this.gaps.length; i++){
            var x_offset = 2048 * this.tCellPos - 230;
            var y_offset = (1024-config.SAFE_ZONE_HEIGHT)/2;
            var px = this.game.math.bezierInterpolation(this.path_points.x, this.gaps[i]) + x_offset;
            var py = this.game.math.bezierInterpolation(this.path_points.y, this.gaps[i]) - y_offset - 512;
              
            var gate = new Gate({
                game: game, 
                x: px, 
                y: py,
                rotation: Math.PI/2,
                height: 100,
                targetPhysicsGroup: this.melanosomeCollisionGroup,
                wallWidth: 0,
                onOpenGate: function(gate){
                    // that.gateOpenSfx.play();
                },
                onCloseGate: function(gate){
                    that.gateCloseSfx.play();
                    that.removeGateTimer(gate);
                },
                onClickRelease: function(stopper){
                    if(stopper.isWorking){
                        game.actions.record("working_stopper_removed");
                    } else {
                        game.actions.record("broken_stopper_removed");
                    }

                    var gate = stopper.currentGate;
                    var gateIndex = that.gates.indexOf(gate);
                    that.gateTimers[gateIndex] = game.time.events.add(3000, function(){
                        if(gate.isOpen) {
                            game.actions.record("gate_left_open");
                        }
                        this.gateTimers[gateIndex] = null;
                    }, that);
                },
                onClickClose: function(){
                    game.actions.record("gate_closed");
                }
            });
            this.cellGroup.add(gate);
            this.gates.push(gate);

            var y_dir = 1;


            //spawn initial stopper at each gate location
            if(game.rnd.frac()<.5){
                y_dir = -1;
            }

            if(this.percentWorkingGates>=.99){
                this.SpawnGateStopper(px+(50*this.world.scale.x), py, y_dir, true);
                this.SpawnGateStopper(px+(150*this.world.scale.x), py, y_dir, true);
                this.SpawnGateStopper(px+(250*this.world.scale.x), py, y_dir, true);
                // this.SpawnGateStopper(px, py-(50*this.world.scale.y), x_dir, true);
                // this.SpawnGateStopper(px, py-(50*this.world.scale.y), x_dir, true);

            }else if(this.percentWorkingGates >= 0.01){
                this.SpawnGateStopper(px+(50*this.world.scale.x), py, y_dir, false);
                this.SpawnGateStopper(px+(50*this.world.scale.x), py, y_dir, false);
                this.SpawnGateStopper(px+(350*this.world.scale.x), py, y_dir, true);
                // this.SpawnGateStopper(px, py-(400*this.world.scale.y), x_dir, true);
            }else{
                this.SpawnGateStopper(px+(50*this.world.scale.x), py, y_dir, false);
                this.SpawnGateStopper(px+(150*this.world.scale.x), py, y_dir, false);
                this.SpawnGateStopper(px+(250*this.world.scale.x), py, y_dir, false);
                // this.SpawnGateStopper(px, py-(100*this.world.scale.y), x_dir, false);
                // this.SpawnGateStopper(px, py-(100*this.world.scale.y), x_dir, false);
            }

        }
    }

    removeGateTimer(gate) {
        var gateIndex = this.gates.indexOf(gate);
        var gateTimer = this.gateTimers[gateIndex];
        if(gateTimer) {
            game.time.events.remove(gateTimer);
            this.gateTimers[gateIndex] = null;
        }
    }

    createTopCell() {
        var totalThickness = 16;
        var spacing = totalThickness/2;
        var yDelta = (1 / 2048) * spacing;

        var alpha = .8;

        this.topCellBmd.clear();

        for (var i = 0; i <= 1; i += (yDelta))
        {
            var shouldDraw = true;

            for(var j = 0;j<this.gaps.length;j++){
                if(i > this.gaps[j]-(this.gapSize/2) && i < this.gaps[j] + (this.gapSize/2) ){
                    shouldDraw = false;
                }
            }

            if(shouldDraw){
                var px = this.game.math.bezierInterpolation(this.path_points.x, i) + 1024 * this.tCellPos - totalThickness*2;
                var py = this.game.math.bezierInterpolation(this.path_points.y, i) - 512;

                // white for now, tint as cell changes
                var colorString = "rgba(255,255,255," + alpha + ")";
                
                this.topCellWallBmd.circle(px, py, totalThickness, colorString);
            }

        }
        var w=this.topCellBmd.width, h=this.topCellBmd.height;
        var ctx = this.topCellBmd.context;

        colorString = "rgba(255,255,255,";
        var grad = ctx.createRadialGradient(-w, h/2, w, 0, h/2, w*2);
        this.setGradientAlphaStops(grad, "#FFFFFF", [
            [0.0,0],
            [.05,0],
            [.06,1],
            [.12,.9],
            [.25,.8],
            [.27,.8],
            [.31,.85],
            [.38,1],
            [.48,.9],
        ]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }

    setGradientAlphaStops(grad, hexColor, stops){
        var color = Phaser.Color.hexToColor(hexColor);
        for(var i=0; i < stops.length; i++) {
            grad.addColorStop(stops[i][0], `rgba(${color.r},${color.g},${color.b},${stops[i][1]})`);
        }
    }

    tintBottomCell(colorPercent){
        colorPercent = Math.clamp(colorPercent, 0, 100);
        var startColor = 0xDADED2;
        var endColor = Phaser.Color.hexToRGB(this.fillColor);
        var newColor = Phaser.Color.interpolateColor(startColor, endColor, 100, colorPercent, 1);
        var newWallColor = Phaser.Color.interpolateColor(newColor, 0xFFFFFF, 100, 60, 1);
        
        this.cellSprite.tint = newColor;
        this.cellSprite.alpha = .4 + .3 * colorPercent/100;
        this.cellWallSprite.tint = newWallColor;
    }

    tintTopCell(colorPercent) {
        colorPercent = Math.clamp(colorPercent, 0, 100);
        var startColor = 0xDADED2;
        var endColor = Phaser.Color.hexToRGB(this.fillColor);
        var newColor = Phaser.Color.interpolateColor(startColor, endColor, 100, colorPercent, 1);
        var newWallColor = Phaser.Color.interpolateColor(newColor, 0xFFFFFF, 100, 60, 1);
        
        this.topCellSprite.tint = newColor;
        this.topCellSprite.alpha = .4 + .3 * colorPercent/100;
        this.topCellWallSprite.tint = newWallColor;
        this.gates.forEach((gate)=>{
            gate.setAll("tint", newWallColor);
        });
    }

    update(){

        // if(this.numEscaped>this.maxEscaped){
        //     this.numEscaped = this.maxEscaped;
        // }

        this.numEscaped-=.001 * Math.pow(game.globalTimeScale, 4);
        if(this.numEscaped<0){
            this.numEscaped = 0;
        }

        if(this.canWin === true && Math.round(this.numEscaped) == this.targetNumEscaped){
            this.handleWin();
        }



        var sparkleDensity = Math.max(0, 0.1 * (1 - this.numEscaped/this.maxEscaped));
        this.sparkle.setDensity(sparkleDensity);

        this.tintTopCell( 100*this.numEscaped/this.maxEscaped );


        this.mouseCursorHitArea.x = game.input.x;
        this.mouseCursorHitArea.y = game.input.y;
        this.expandingCircles.x = game.input.x;
        this.expandingCircles.y = game.input.y;

        this.checkForBounce();
        this.checkForOverlap();

        // for(var i = 0;i<this.walls.length;i++){
        //     game.debug.body(this.walls[i]);
        // }

    }


    handleWin(){

        if(this.hasWon !== true){
            this.hasWon = true;
            game.input.enabled = false;

            //play pretty sound
            this.winSfx.play();
            game.hideHud(true);

            for(let i =0;i<this.pulses.length;i++){
              let pulse = this.pulses[i];
              pulse.alpha = .5;
              pulse.blendMode = 1;
              game.add.tween(pulse).to({"width": 4000, "height": 4000, "alpha": 0}, 1000*(i+1), Phaser.Easing.Cubic.Out).start();
            }

            game.time.events.add(2500, function(){
                //fade out
                game.tweens.removeFrom(this.topCover);
                game.add.tween(this.topCover).to({"alpha": 1}, 1000).start();
                //return to cell view
                this.phone.post("activityWin", {
                  "activity": "gate",
                  "cellModel": game.cellModel.toJSON(),
                  "resultingGeneticColor": game.cellModel.getGeneticColorName(),
                  "geneticShortcode": game.cellModel.getGeneticShortcode(),
                  "actionStats": game.actions.stats
                });
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
                    "activity": "gate",
                    "cellModel": game.cellModel.toJSON(),
                    "resultingGeneticColor": game.cellModel.getGeneticColorName(),
                    "geneticShortcode": game.cellModel.getGeneticShortcode()
                });
            }, this);

        }

    }
    render () {
        //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    }




    handleReturnFromNucleus(){
      var resultingGeneticColor = game.cellModel.getGeneticColorName();
      var resultingGeneticState = game.cellModel.colorToState(resultingGeneticColor);
      var targetState=game.cellModel.target_state;

      if(game.isBossLevel){
        this.updateColors();
        this.tintBottomCell( 100*this.numEscaped/this.maxEscaped );
        this.escapedMelanosomes.forEach((mel)=>{
            mel.loadTexture(this.melImage);
        });
      }

      if(resultingGeneticState.numEscaped == targetState.numEscaped &&
        (!game.isBossLevel || resultingGeneticColor == game.finalTarget)){
        this.successfulNucleusReturn();
      }else{
        //womp womp
        //todo?
      }

    }
    successfulNucleusReturn(){
        game.hideHud();

        this.winSfx.play();


        game.globalTimeScale = 2;
        for(let i=0; i<10; i++){
            let isWorking = game.rnd.frac() < this.percentWorkingGates;
            this.SpawnGateStopper(config.SAFE_ZONE_WIDTH, game.rnd.frac()*config.SAFE_ZONE_HEIGHT*.5, -1, isWorking);
        }
        this.numEscaped = this.maxEscaped/2;
        if(game.isBossLevel){
            for(let i=0; i<this.numEscaped; i++) {
                this.spawnEscapedMelanosome((i+1) * 3000)
            }
        }

      //todo, change nucleus hinting to say good job!

    }


    guardChange(){
        //gates should have already changed body style
    }
    checkForBounce(){
        // for(var i = 0; i < this.gates.length; i++){
        //     var g = this.gates[i];
        //     if(g.currentStopper !== null){
        //         for(var j = 0; j < this.melanosomes.length; j++){
        //             var mel = this.melanosomes[j];
        //             game.physics.arcade.collide(mel, g.wallBlocker);
        //         }
        //     }
        // }

        game.physics.arcade.collide(this.melanosomeCollisionGroup);

    }
    checkForOverlap(){
        var that = this;

        for(var i = 0;i<this.gates.length;i++){
            var gate = this.gates[i];
            if(gate.currentStopper === null){
                for(var j = 0;j<this.stoppers.length;j++){
                    var stopper = this.stoppers[j];
                    if(stopper.isFloating && stopper.currentGate == null){

                        game.physics.arcade.overlap(gate.hitArea, stopper.hitArea, function(gateHitArea, stopperHitArea){
                            stopper.connectToGate(gate);
                        }, null, this);
                    }
                }
            }else if(gate.currentStopper!==null && gate.currentStopper.isWorking){
                for(var j = 0;j<this.melanosomes.length;j++){
                    var mel = this.melanosomes[j];
                    game.physics.arcade.overlap(gate.hitArea, mel, function(gateHitArea, mel){
                        gate.releaseStopper();
                        // mel.body.velocity.y*=-(mel.body.bounce.y)
                        // stopper.connectToGate(gate);
                    }, null, this);
                }
            }



        }

        //mouse nudge melanosomes
        if(game.input.activePointer.isDown && this.expandingCircles){
            this.expandingCircles.isActive = true;

            for(var i = 0;i<this.melanosomes.length;i++){
                var melanosome = this.melanosomes[i];
                this.game.physics.arcade.overlap(this.mouseCursorHitArea, melanosome, function(cursor, melanosome){
                    var diff_x = game.input.x - melanosome.world.x;
                    if(diff_x < 0){
                        diff_x *= 1.5;
                    }
                    melanosome.body.velocity.x += -diff_x*.2;
                    if(diff_x < 0) {
                        melanosome.pushForward();
                    } else if(!melanosome.wasPushedBack && melanosome.body.velocity.x < 0) {
                        game.actions.record("pushed_toward_nucleus");
                        melanosome.pushBack();
                    }
                });
            }
        }else{
            this.expandingCircles.isActive = false;

        }

    }


    SpawnGateStopper(x_start, y_start, x_dir, isWorking){
        
        var that = this;
        var gateStopper = new GateStopper({
            game: game,
            x: x_start, 
            y: y_start,
            dir: x_dir,
            isWorking: isWorking,
            onInsert: function(){
                that.blockerInsertSfx.play();
            }, 
            onPopout: function(){
                that.popoutSfx.play();
            }
        });
        this.world.add(gateStopper);
        this.world.add(gateStopper.hitArea);
        this.stoppers.push(gateStopper);

        this.numFloatingStoppers++;
    }
    SpawnGateStoppersForever(){
        
        if(this.numFloatingStoppers<this.maxFloatingStoppers){

            var y_dir = -1;
            var y_start = 0;

            if(game.rnd.frac()<.5){
                y_dir = 1;
                y_start = config.SAFE_ZONE_HEIGHT;
            }

            var isWorking = game.rnd.frac() < this.percentWorkingGates;
            this.SpawnGateStopper(2048, y_start, y_dir, isWorking);

        }

        game.time.events.add((1000/this.stoppersSpawnedPerSecond)/game.globalTimeScale, this.SpawnGateStoppersForever, this)

    }

    SpawnMelanosomesForever(){
        this.SpawnMelanosome();
        game.time.events.add((1000/this.melanosomesSpawnedPerSecond)/game.globalTimeScale, this.SpawnMelanosomesForever, this)
    }

    SpawnMelanosome(){
        var y_offset = (2048-config.SAFE_ZONE_HEIGHT)/2;
        var rndGapIndex = game.rnd.integerInRange(0, this.gaps.length-1);
        var gapLocation = this.gaps[rndGapIndex];

        var y = this.game.math.bezierInterpolation(this.path_points.y, gapLocation);
        var that = this;
        
        var melanosome = new GateMelanosome({
            game: game,
            x: -100 - 32,
            y: y - y_offset - 32,
            targetGroup: this.world,
            limit: this.sparklePos * 2048,
            drag: 1,
            onEscapeCallback: function(wasPushed){
                that.numEscaped++;
                that.colorIndicators.updateColors("gate", that.numEscaped/that.maxEscaped);
                that.melanosomeEscapeSfx.play();

                if(wasPushed){
                    game.actions.record("pushed_through_gate");
                }
                that.escapedMelanosomes.push(melanosome);
            },
            onDeathCallback: function(mel){
                that.onMelanosomeDeath.call(that, mel);
            },
            image: this.melImage
        });
        this.melanosomeCollisionGroup.add(melanosome);
        this.melanosomes.push(melanosome);
        // this.world.add(melanosome);
    }

    spawnEscapedMelanosome(lifetime){
        var that = this;

        var melanosome = new GateMelanosome({
            game: game,
            x: config.SAFE_ZONE_WIDTH - 400,
            y: game.rnd.frac() * config.SAFE_ZONE_HEIGHT,
            lifetime: lifetime,
            targetGroup: that.world,
            limit: that.sparklePos * 2048,
            drag:300,
            onEscapeCallback: function(){
                that.numEscaped++;
                that.colorIndicators.updateColors("gate", that.numEscaped/that.maxEscaped);                    
            },
            onDeathCallback: function(mel){
                that.onMelanosomeDeath.call(that, mel);
            },
            image: that.melImage
        });
        this.escapedMelanosomes.push(melanosome);
    }

    onMelanosomeDeath(mel){
        
        this.numEscaped--;
        this.colorIndicators.updateColors("gate", this.numEscaped/this.maxEscaped);
        var escapedIndex = this.escapedMelanosomes.indexOf(mel);
        if(escapedIndex != -1){
            this.escapedMelanosomes.splice(escapedIndex, 1);
        }
    }

    resize(){
        var lGameScale=Math.round(10000 * Math.min(this.game.width/config.SAFE_ZONE_WIDTH,this.game.height / config.SAFE_ZONE_HEIGHT)) / 10000;
        this.world.scale.setTo (lGameScale,lGameScale);
        this.backgroundBlobsGroup.scale.setTo (lGameScale,lGameScale);
        this.melanosomeCollisionGroup.scale.setTo(lGameScale, lGameScale);
        this.cellGroup.scale.setTo(lGameScale, lGameScale);
        this.hudGroup.scale.setTo(lGameScale, lGameScale);
        this.hudGroup.x = this.cellGroup.x = this.backgroundBlobsGroup.x = this.melanosomeCollisionGroup.x = this.world.x = (this.game.width-config.SAFE_ZONE_WIDTH*lGameScale)/2;
        this.hudGroup.y = this.cellGroup.y = this.backgroundBlobsGroup.y = this.melanosomeCollisionGroup.y = this.world.y = (this.game.height-config.SAFE_ZONE_HEIGHT*lGameScale)/2;

        for(var i = 0;i<this.melanosomes.length;i++){
            this.melanosomes[i].resize();
        }
        for(i = 0; i < this.gates.length; i++) {
            this.gates[i].resize();
        }


        var w = 512*lGameScale;
        for(var i = 0;i<this.walls.length;i++){
            var wall = this.walls[i];
            if(i%2==0){
                wall.body.setSize(w, w, 0, 512-w);
            }
            else{
                wall.body.setSize(w,w,0,0);
            }
        }
    }

    gotoMotorActivity(){
        this.gotoState("MotorActivity");
    }

    gotoSizeActivity(){
        this.gotoState("SizeActivity");
    }

    gotoState(stateName){
        this.state.start(stateName, true, false);
    }

}
