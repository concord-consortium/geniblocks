import Phaser from 'phaser'
import config from '../../config'
import TyrosineDisc from '../size_activity/TyrosineDisc'
import Tyrosine from './Tyrosine';

export default class extends Phaser.Group {

  constructor ({ game, x, y, asset, axleFlowerBmd, melanosome, shouldBeActive, allele, chromosome_id, anchorPosition, onSeparate, onPlayerBreak, breakable=false }) {
    super(game)
	this.game = game;
	// this.tint = 0xffffff;
	// this.anchor.set(.5);
	this.inputEnabled = true;
	this.alpha = 0;
	this.melanosome = melanosome;
	this.anchorPosition = anchorPosition;
    this.angle = (this.anchorPosition*-1);

    this.separation_amount = 50;
	this.separation = this.separation_amount;
    this.isSeparate = true;
    this.isProcessing = false;
	this.delta = 0;
    this.axleFlowerBmd = axleFlowerBmd;
    this.y_offset = 0;
    this.scale.set(0);

    this.activationTweens = [];

    this.chromosome_id = chromosome_id;

    this.isActive = shouldBeActive;

    this.tyrosines = [];
    this.connecting_trp = null;

    //numpoints/numpetals
    this.capacity = 6;

    this.allele = allele;
    this.isWorking = this.allele.value;

    this.grabEvents = [];

    this.onSeparate = onSeparate;
    this.onPlayerBreak = onPlayerBreak;
    this.breakable = breakable;

    this.onStarCreation = new Phaser.Signal();

    this.alphaBlob = game.add.sprite(124, 0, 'tyr');
    // this.alphaBlob.tint = 0x33aa33;
    this.alphaBlob.anchor.set(.5);
    this.alphaBlob.scale.set(.4);
    this.add(this.alphaBlob);

    this.alphaOpenAmount = 0;
    this.betaOpenAmount = 0;
    this.aMask = this.game.add.graphics(0, 0);
    this.aMask.beginFill(0x00ff00);
    this.aMask.arc(0, 0, 128, game.math.degToRad(0), game.math.degToRad(30), true);
    this.aMask.endFill();
    this.aMask.anchor.set(.5);
    this.alphaBlob.addChild(this.aMask);
    this.alphaBlob.mask = this.aMask;










    this.betaBlob = this.game.add.sprite(-124, 0, 'tyr');
    this.betaBlob.anchor.set(.5);
    this.betaBlob.scale.set(.6);
    this.add(this.betaBlob);

    this.betaMask = this.game.add.graphics(0, 0);
    this.betaMask.beginFill(0xffffff);
    this.betaMask.arc(0, 0, 128, game.math.degToRad(0), game.math.degToRad(30), true);
    this.betaMask.endFill();
    this.betaMask.anchor.set(.5);
    this.betaBlob.addChild(this.betaMask);
    this.betaBlob.mask = this.betaMask;


    this.alphaBlob.inputEnabled = true;
    this.alphaBlob.events.onInputDown.add(this.handleClick, this);
    this.betaBlob.inputEnabled = true;
    this.betaBlob.events.onInputDown.add(this.handleClick, this);



    this.game.physics.enable(this.alphaBlob, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.betaBlob, Phaser.Physics.ARCADE);

    var targetAlphaX = this.alphaBlob.width/2 + this.separation;
    var targetBetaX = -this.betaBlob.width/2 - this.separation;

    this.alphaBlob.x = targetAlphaX;
    this.betaBlob.x = targetBetaX;

    var targetY = (this.melanosome.scale.x) * ((this.alphaBlob.width/2)-this.alphaBlob.x)/Math.PI;

    this.alphaBlob.y = targetY;
    this.betaBlob.y = targetY;

    // this.alphaBlob.angle = 0;
    this.betaBlob.angle = -180;


    this.tyrosineAngle = (2*Math.PI)/this.capacity;

    this.semiformedStarGroup = game.add.group();
    this.semiformedStarGroup.rotation = -Math.PI - this.tyrosineAngle * .5;

    this.add(this.semiformedStarGroup);


    if(this.isActive === true){
        // this.alpha = 1;
        // this.scale.set(1);
        game.add.tween(this).to({"alpha": 1}, 1000).start();
        game.add.tween(this.scale).to({"x": 1, "y": 1}, 500).start();

    }


  }
  create(){
  }
  update () {
    if(!this.isActive)
        return;
    

    this.angle = (this.anchorPosition*-1);


    var w = this.scale.x * this.parent.scale.x * 128;
    var h = this.scale.y * this.parent.scale.y * 128;
    this.alphaBlob.body.setSize(w*1.125, h*1.125, (128-(w*1.125))/2, (128-(h*1.125))/2);
    this.betaBlob.body.setSize(w, h, (128-w)/2, (128-h)/2);


    var targetOpenAmount = 0;
    if(this.isSeparate){
        this.separation = this.separation_amount;
        targetOpenAmount = 0;
    }else{
        this.separation = 0;
        targetOpenAmount = Math.PI/3;;
    }


    var targetAlphaOpenAmount = targetOpenAmount;
    var targetBetaOpenAmount = targetOpenAmount;

    if(!this.isWorking){
        targetBetaOpenAmount*=2;
    }


    if(this.isSeparate!==true){
		this.delta += (game.time.elapsed/150);
		// var amount = game.math.degToRad((Math.sin(this.delta)+1) * 30);
        this.alphaOpenAmount += (targetAlphaOpenAmount - this.alphaOpenAmount) * .1;
        this.betaOpenAmount  += (targetBetaOpenAmount  - this.betaOpenAmount ) * .1;
		var wedgePosition = game.math.degToRad(-90);


		this.aMask.clear();
	    this.aMask.beginFill(0xffffff);
	    this.aMask.arc(0, 0, 128, wedgePosition-this.alphaOpenAmount/2, wedgePosition+this.alphaOpenAmount/2, true, 128);
        this.aMask.endFill();

		this.betaMask.clear();
	    this.betaMask.beginFill(0xffffff);
	    this.betaMask.arc(0, 0, 128, wedgePosition-this.betaOpenAmount/2, wedgePosition+this.betaOpenAmount/2, true);
        this.betaMask.endFill();

        if(this.isProcessing !== true){
            this.alphaBlob.angle += (0 - this.alphaBlob.angle)*.1;
            this.betaBlob.angle += (-180 - this.betaBlob.angle)*.1;
        }
    }else{


        this.alphaOpenAmount += (targetOpenAmount - this.alphaOpenAmount) * .05;
        this.betaOpenAmount += (targetOpenAmount - this.betaOpenAmount) * .05;

        var wedgePosition = game.math.degToRad(-90);

        
        this.aMask.clear();
        this.aMask.beginFill(0xffffff);
        if(this.alphaOpenAmount > 0.001) {
            this.aMask.arc(0, 0, 128, wedgePosition-this.alphaOpenAmount/2, wedgePosition+this.alphaOpenAmount/2, true, 128);
        } else {
            this.aMask.drawRect(-128, -128, 256, 256);
        }
        this.aMask.endFill();

        this.betaMask.clear();
        this.betaMask.beginFill(0xffffff);
        if(this.betaOpenAmount > 0.001) {
            this.betaMask.arc(0, 0, 128, wedgePosition-this.betaOpenAmount/2, wedgePosition+this.betaOpenAmount/2, true);
        } else {
            this.betaMask.drawRect(-128, -128, 256, 256);
        }
        this.betaMask.endFill();


        this.alphaBlob.angle += (-180 - this.alphaBlob.angle)*.1;
        this.betaBlob.angle += (0 - this.betaBlob.angle)*.1;
    }


    var scaledSep = this.separation * this.parent.scale.x;
    var targetAlphaX = this.alphaBlob.width/2 + scaledSep;
    var targetBetaX = -this.betaBlob.width/2 - scaledSep;

    this.alphaBlob.x += (targetAlphaX - this.alphaBlob.x) * .1;
	this.betaBlob.x += (targetBetaX - this.betaBlob.x) * .1;

    var r = (256*this.melanosome.scale.x);
    var targetY = Math.sqrt((r*r)-(this.alphaBlob.x * this.alphaBlob.x));
	this.alphaBlob.y = targetY;
    this.betaBlob.y = targetY;



    this.semiformedStarGroup.x = this.alphaBlob.x;
    this.semiformedStarGroup.y = this.alphaBlob.y - 50;

	this.x = config.SAFE_ZONE_WIDTH/2;// + (Math.sin(game.math.degToRad(this.anchorPosition)) * this.melanosome.scale.x * 256);
	this.y = config.SAFE_ZONE_HEIGHT/2;// + (Math.cos(game.math.degToRad(this.anchorPosition)) * this.melanosome.scale.y * 256);
  }

  grab(tyrosine){
        //this should never really happen, just a redundant failsafe
        if(tyrosine.isInside || this.isProcessing || this.isConnecting){
            return;
        }
        this.isProcessing = true; //set to 'busy'
        this.currentTyrosine = tyrosine;

        
        var quickness = 100/game.globalTimeScale; //global animation speed adjustment
        var brokenRotationAdjustment = 0; //currently not really used, used to change the resulting star shape



        if(this.isWorking === true){
            // then pull the tyrosine inside and place into a disc

            tyrosine.isFloating = false;
            tyrosine.body.velocity.x = 0;
            tyrosine.body.velocity.y = 0;

            //move the tyrosine into position
            var targetTyrosineX = (this.betaBlob.world.x/this.parent.scale.x)  - (this.parent.x/this.parent.scale.x);
            var targetTyrosineY = (this.betaBlob.world.y/this.parent.scale.y)  - (this.parent.y/this.parent.scale.y);
            var targetTyrosineAngle = (this.angle + this.betaBlob.angle);
            var shortestAngle = game.math.getShortestAngle(tyrosine.angle, targetTyrosineAngle);
            var tyroMoveTween = game.add.tween(tyrosine).to({"angle": shortestAngle + tyrosine.angle, "x": targetTyrosineX, "y": targetTyrosineY}, quickness*3).start();
            tyrosine.myTweens.push(tyroMoveTween);

            // once tyrosine is finished moving...
            tyroMoveTween.onComplete.add(function(){

                this.tyrosines.push(tyrosine);
                tyrosine.angle = this.betaBlob.angle;
                //constantly check to see if the tyrosine has started floating off again
                if(tyrosine.isFloating === false){
                    this.add(tyrosine);

                    tyrosine.x = this.betaBlob.x;
                    tyrosine.y = this.betaBlob.y;
                    tyrosine.myTweens.push(
                        game.add.tween(tyrosine).to({"rotation": (-Math.PI/2) + brokenRotationAdjustment, "x": this.alphaBlob.x , "y": this.alphaBlob.y}, quickness*3.1).start()
                    );
                }


                //rotate the blobs to face eachother
                game.add.tween(this.alphaBlob).to({"angle": -90}, quickness*3).start();
                var betaRotateTween1 = game.add.tween(this.betaBlob).to({"angle": -270}, quickness*3.1).start();

                //after they are done rotating to face eachother
                betaRotateTween1.onComplete.add(function(){

                    //rotate the blobs back to origin
                    game.add.tween(this.alphaBlob).to({"angle": 0}, quickness*1.5).start();
                    var betaRotateTween2 = game.add.tween(this.betaBlob).to({"angle":180}, quickness*3).start();

                    //constantly check to see if the tyrosine has started floating off again
                    if(tyrosine.isFloating === false){

                        //rotate the star
                        var firstTargetRot = (-this.tyrosines.length + .5) * this.tyrosineAngle - Math.PI;
                        var firstStarRotateTween = game.add.tween(this.semiformedStarGroup).to(
                            {"rotation": firstTargetRot}, quickness*5.5, Phaser.Easing.Linear.Out).delay(quickness*1).start();
                            
                        //hand the tyrosine from one blob to another
                        var rotTyroWithBeta = game.add.tween(tyrosine).to(
                            {"rotation": this.tyrosineAngle*.5 + brokenRotationAdjustment, "x": this.alphaBlob.x, "y": this.alphaBlob.y}, quickness*3).start();
                        tyrosine.myTweens.push(rotTyroWithBeta);
                        
                        rotTyroWithBeta.onComplete.add(() => {
                            
                            var rotTyroIntoDisc = game.add.tween(tyrosine).to({
                                "rotation": tyrosine.rotation + Math.PI - this.tyrosineAngle*.5,
                                "x": this.semiformedStarGroup.x,
                                "y": this.semiformedStarGroup.y
                            }, quickness*3).start();

                            tyrosine.myTweens.push(rotTyroIntoDisc);
                            
                            //after those animations complete...
                            rotTyroIntoDisc.onComplete.add(function() {
                                this.semiformedStarGroup.add(tyrosine);
    
                                if(tyrosine.isFloating === false){
                                    tyrosine.position.x = 0;
                                    tyrosine.position.y = 0;
                                    tyrosine.rotation = -firstTargetRot + Math.PI;
                                }
                           
                                var finish = function() {
                                    this.currentTyrosine = null;
                                    this.isProcessing = false;
                                    if(this.tyrosines.length >= this.capacity){
                                        this.releaseStar();
                                    }
                                    if(this.connecting_trp){
                                        this.connecting_trp.numUses ++;
                                    }
                                }

                                var targetRot = firstTargetRot - this.tyrosineAngle;
                                var starRotateTween = game.add.tween(this.semiformedStarGroup).to({"rotation": targetRot}, quickness*3).start();
                                starRotateTween.onComplete.add(finish, this);
                                
                            }, this);
                        });
                    }
                    
                }, this);

            }, this);

        }else{
            // then pull the tyrosine inside (not into a disc) 

            // tyrosine.rotation = this.rotation + this.betaBlob.rotation + brokenRotationAdjustment;

            tyrosine.isFloating = false;
            tyrosine.body.velocity.x = 0;
            tyrosine.body.velocity.y = 0;

            //move the tyrosine into position
            var targetTyrosineX = (this.betaBlob.world.x/this.parent.scale.x)  - (this.parent.x/this.parent.scale.x);
            var targetTyrosineY = (this.betaBlob.world.y/this.parent.scale.y)  - (this.parent.y/this.parent.scale.y);
            var targetTyrosineAngle = (this.angle + this.betaBlob.angle + 40);
            var shortestAngle = game.math.getShortestAngle(tyrosine.angle, targetTyrosineAngle);
            var tyroMoveTween = game.add.tween(tyrosine).to({"angle": shortestAngle + tyrosine.angle, "x": targetTyrosineX, "y": targetTyrosineY}, quickness*3).start()

            tyrosine.myTweens.push(tyroMoveTween);

            //once tyrosine is finished moving...
            tyroMoveTween.onComplete.add(function(){

                game.add.tween(this.alphaBlob).to({"angle": -90}, quickness*3).start();
                var betaRotateTween1 = game.add.tween(this.betaBlob).to({"angle": -270}, quickness*3).start();

                if(tyrosine.isFloating === false){

                    this.add(tyrosine);
                    tyrosine.angle = this.betaBlob.angle + 40;

                    tyrosine.x = this.betaBlob.x;
                    tyrosine.y = this.betaBlob.y;
                    tyrosine.myTweens.push(
                        game.add.tween(tyrosine).to({"angle": (-320) + brokenRotationAdjustment, "x": this.betaBlob.x, "y": this.betaBlob.y}, quickness*3).start()
                    );
                }


                betaRotateTween1.onComplete.add(function(){

                    game.add.tween(this.alphaBlob).to({"angle": 0}, quickness*3).start();
                    var betaRotateTween2 = game.add.tween(this.betaBlob).to({"angle": 180}, quickness*3).start();
                    this.currentTyrosine.stopAllTweens();
                    this.currentTyrosine.isFloating = true;
                    this.currentTyrosine.isInside = true;

                    var p = new Phaser.Point(this.currentTyrosine.x, this.currentTyrosine.y);
                    var rot_p = Phaser.Point.rotate(p, 0, 0, this.rotation);

                    this.parent.add(this.currentTyrosine);
                    this.currentTyrosine.x = this.x + rot_p.x;
                    this.currentTyrosine.y = this.y + rot_p.y;
                    this.currentTyrosine.angle += this.angle;
                    this.currentTyrosine.dieAfterTime();
                    this.currentTyrosine.body.velocity.x += game.rnd.frac*200;
                    this.currentTyrosine.body.velocity.y += game.rnd.frac*200;
                    this.currentTyrosine = null;

                    betaRotateTween2.onComplete.add(function(){

                        this.isProcessing = false;
                        if(this.connecting_trp){
                            this.connecting_trp.numUses ++;
                            // if(this.connecting_trp.isWorking === false){
                            //     this.connecting_trp.fallOffTyr();
                            // }
                        }
                    }, this);
                }, this);

            }, this);


        }






  }

  innerGrab(tyrosine){
    
        if(!tyrosine.isInside || this.isProcessing || this.isConnecting){
            return;
        }

        //global animation speed adjustment
        var quickness = 100/game.globalTimeScale;
        this.isProcessing = true; //set to 'busy'

        this.currentTyrosine = tyrosine;

        var brokenRotationAdjustment = 0; //currently not really used, used to change the resulting star shape
        // if(this.isWorking){
        //     brokenRotationAdjustment = 0;
        // }else{
        //     brokenRotationAdjustment = Math.PI/2;
        // }

        tyrosine.rotation = this.rotation + this.alphaBlob.rotation + brokenRotationAdjustment;

        tyrosine.isFloating = false;
        tyrosine.body.velocity.x = 0;
        tyrosine.body.velocity.y = 0;

        // tyrosine.tint = 0x999933;
        this.tyrosines.push(tyrosine);

        //move the tyrosine into position
        var targetTyrosineX = (this.alphaBlob.world.x/this.parent.scale.x)  - (this.parent.x/this.parent.scale.x);
        var targetTyrosineY = (this.alphaBlob.world.y/this.parent.scale.y)  - (this.parent.y/this.parent.scale.y);
        
        var tyroMoveTween = game.add.tween(tyrosine).to({"x": targetTyrosineX, "y": targetTyrosineY}, quickness*3).start();
        tyrosine.myTweens.push(tyroMoveTween);


        //once tyrosine is finished moving...
        tyroMoveTween.onComplete.add(function(){

            //rotate all the way around
            game.add.tween(this.alphaBlob).to({"angle": 360}, quickness*3).start();
            var betaRotateTween1 = game.add.tween(this.betaBlob).to({"angle": 180}, quickness*3).start();
            
            if(tyrosine.isFloating === false){
                tyrosine.rotation = this.alphaBlob.rotation + brokenRotationAdjustment;
                this.add(tyrosine);
                tyrosine.x = this.alphaBlob.x;
                tyrosine.y = this.alphaBlob.y;


                //rotate the star
                var firstTargetRot = (-this.tyrosines.length + .5) * this.tyrosineAngle - Math.PI;
                var firstStarRotateTween = game.add.tween(this.semiformedStarGroup).to(
                    {"rotation": firstTargetRot}, quickness*3, Phaser.Easing.Linear.Out).delay(quickness*2.5).start();
                    
                //rotate tyrosine with the beta blob
                var rotTyroWithBeta = game.add.tween(tyrosine).to({
                    "rotation": Math.PI * 2 + this.tyrosineAngle*.5 + brokenRotationAdjustment, "x": this.alphaBlob.x, "y": this.alphaBlob.y}, quickness*3).start()
                tyrosine.myTweens.push(rotTyroWithBeta);

                rotTyroWithBeta.onComplete.add(function(){
                    
                    //constantly check to see if the tyrosine has started floating off again
                    if(tyrosine.isFloating === false){

                        var rotTyroIntoDisc = game.add.tween(tyrosine).to({
                            "rotation": tyrosine.rotation + Math.PI - this.tyrosineAngle*.5,
                            "x": this.semiformedStarGroup.x,
                            "y": this.semiformedStarGroup.y
                        }, quickness*2).start();

                        tyrosine.myTweens.push(rotTyroIntoDisc);
                            

                        rotTyroIntoDisc.onComplete.add(() => {

                            this.semiformedStarGroup.add(tyrosine);
                            
                            if(tyrosine.isFloating === false){
                                tyrosine.x = 0;
                                tyrosine.y = 0;
                                tyrosine.rotation = -firstTargetRot + Math.PI;
                            }
                            
                            var finish = function() {
                                this.currentTyrosine = null;
                                this.isProcessing = false;

                                if(this.tyrosines.length >= this.capacity){
                                    //inner release star should last longer to make things easier!
                                    this.releaseStar(2);
                                }

                                if(this.connecting_trp){
                                    this.connecting_trp.numUses ++;
                                }
                            }
                        
                            //finish rotating the star
                            var targetRot = firstTargetRot - this.tyrosineAngle;
                            var starRotateTween = game.add.tween(this.semiformedStarGroup).to({"rotation": targetRot}, quickness*1.5).start();

                            starRotateTween.onComplete.add(finish, this);
                            
                        }, this);
                    }
                }, this);
            }


            betaRotateTween1.onComplete.add(function(){

                //rotate the blobs back to origin
                game.add.tween(this.alphaBlob).to({"angle": 0}, quickness*3).start();
                game.add.tween(this.betaBlob).to({"angle":-180}, quickness*3).start();
            }, this);

        }, this);
  }

  createPreformedStar(numTyros){
    for(var i=0; i<numTyros; i++){
        var tyro = new Tyrosine({
            game: game,
            x: this.semiformedStarGroup.x,
            y: this.semiformedStarGroup.y,
            melanosome: this.melanosome
        });
        tyro.rotation = (i+.5) * this.tyrosineAngle;

        this.tyrosines.push(tyro);
        this.semiformedStarGroup.add(tyro);
    }
    this.semiformedStarGroup.rotation = (this.tyrosines.length - .5) * this.tyrosineAngle - 3*Math.PI;
  }


  initPositionAndRotation(){

  }
  releaseTyrosine(){
    for(var i = 0;i<this.tyrosines.length;i++){
        var tyrosine = this.tyrosines[i];

        tyrosine.stopAllTweens();
        tyrosine.isFloating = true;
        tyrosine.isInside = true;



        if(tyrosine.parent == this){
            var p = new Phaser.Point(tyrosine.x, tyrosine.y);
            this.parent.add(tyrosine);
            tyrosine.x += this.x;
            tyrosine.y += this.y;
            var rot_p = Phaser.Point.rotate(p, 0, 0, this.rotation);
            tyrosine.x += rot_p.x;
            tyrosine.y += rot_p.y;
            tyrosine.rotation += this.rotation;
        }else if(tyrosine.parent == this.semiformedStarGroup){
            var p = new Phaser.Point(this.semiformedStarGroup.x, this.semiformedStarGroup.y);
            this.parent.add(tyrosine);
            tyrosine.x += this.x;
            tyrosine.y += this.y;
            var rot_p = Phaser.Point.rotate(p, 0, 0, this.rotation);
            tyrosine.x += rot_p.x;
            tyrosine.y += rot_p.y;
        }
        tyrosine.z = 0;
        tyrosine.parent.sendToBack(tyrosine);
        tyrosine.dieAfterTime();


    }



    // if(this.currentTyrosine!==null){
    //     this.currentTyrosine.isInside = true;
    //     this.parent.add(this.currentTyrosine);
    //     // this.currentTyrosine.x+=this.x;
    //     // this.currentTyrosine.y+=this.y;
    //     this.currentTyrosine.isFloating = true;
    // }

    this.tyrosines = [];
  }
  releaseStar(lifetimeModifier = 1){

    this.melanosome.numStars ++;
    var fullStar = game.add.group();
    this.add(fullStar);

    fullStar.x = this.semiformedStarGroup.x;
    fullStar.y = this.semiformedStarGroup.y;
    fullStar.rotation = this.semiformedStarGroup.rotation;


    //transfer tyrosines to new star group
    for(var i = 0;i<this.tyrosines.length;i++){
        var t = this.tyrosines[i];
        fullStar.add(t);
    }
    var initialStarLifetime = 85000;
    if(this.connecting_trp == null){
        initialStarLifetime = 25000;
    }
    var newTyrosineStar = new TyrosineDisc({
        game: game,
        x: (this.semiformedStarGroup.worldPosition.x/this.parent.scale.x) - (this.parent.x/this.parent.scale.x),
        y: (this.semiformedStarGroup.worldPosition.y/this.parent.scale.y) - (this.parent.y/this.parent.scale.y),
        targetGroup: this.parent,
        existingGroup: fullStar,
        rotation: fullStar.rotation,
        initialLifetime: initialStarLifetime * lifetimeModifier,
        melanosome: this.melanosome,
        working: true
    });

    //notify listeners that a new star was created
    if(this.onStarCreation){
        this.onStarCreation.dispatch(newTyrosineStar);
    }





    //reset
    this.tyrosines = [];
    this.semiformedStarGroup.angle = -Math.PI + this.tyrosineAngle * .5;
    if(this.connecting_trp == null){
        this.handleSeperation();
    }
  }

  handleClick(){
    if(!this.breakable) {
        return;
    }
    if(this.connecting_trp){
        this.onPlayerBreak.call();
        this.connecting_trp.fallOffTyr();
    }
    if(this.isSeparate!==true){
        this.handleSeperation();
    }

  }
  handleSeperation(){
    this.releaseTyrosine();
    this.isProcessing = false;
    this.isSeparate = true;

    if(this.onSeparate){
        this.onSeparate.call();
    }

    game.tweens.removeFrom(this, true);
    game.tweens.removeFrom(this.alphaBlob, true);
    game.tweens.removeFrom(this.betaBlob, true);
    game.tweens.removeFrom(this.semiformedStarGroup, true);
    if(this.currentTyrosine){
        this.currentTyrosine.isFloating = true;
        game.tweens.removeFrom(this.currentTyrosine);
        this.currentTyrosine = null;
    }




  }
  activate(){
    if(this.isActive !== true){
        game.tweens.removeFrom(this, true);

        for(var i = 0;i<this.activationTweens.length;i++){
            this.activationTweens[i].stop(true);
        }
        this.activationTweens = [];
        this.scale.set(0)
        this.isActive = true;
        this.activationTweens.push(game.add.tween(this).to({"alpha": 1}, 1000).start());
        this.activationTweens.push(game.add.tween(this.scale).to({"x": 1, "y": 1}, 500).start());
    }
  }
  deactivate(){
    if(this.isActive !== false){
        for(var i = 0;i<this.activationTweens.length;i++){
            this.activationTweens[i].stop(true);
        }
        this.activationTweens = [];
        

        this.isActive = false;
        this.aMask.clear();
        this.betaMask.clear();


        this.activationTweens.push(game.add.tween(this).to({"alpha": 0}, 500).start());
        // this.activationTweens.push(game.add.tween(this.scale).to({"x": 0, "y": 0}, 1000).start());

        if(this.connecting_trp){
            this.connecting_trp.fallOffTyr();
        }
    }
  }

  handleAlleleChange(){
    this.allele = game.cellModel.getCurrentAllele(this.chromosome_id, "tyr_mouth");
    this.isWorking = this.allele.value;
  }

}
