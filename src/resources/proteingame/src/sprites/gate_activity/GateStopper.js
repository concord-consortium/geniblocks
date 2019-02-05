import Phaser from 'phaser'
import { clamp } from '../../utils'
import { sqrMagnitude } from '../../utils'

export default class extends Phaser.Group {

    constructor ({ game, x, y, dir, isWorking, onInsert, onPopout }) {
        super(game)
        this.alpha = 1;
        this.wingLength = 42;
        this.thickness = 14;
        this.y_dir = dir;



        this.isWorking = isWorking;

        //todo: totally redo this!
        this.numLongMiddles = 1;
        if(this.isWorking){
            this.numLongMiddles = 2;
        }
        // this.totalMiddleLength = (this.numLongMiddles*100) + ((2-this.numLongMiddles) * 50);


        this.x = x;
        this.y = y;


        this.isFloating = true;


        this.currentGate = null;


        this.wings = game.add.group();
        this.add(this.wings);

        this.leftWing = game.add.sprite(0,0,"gate_stopper_wing");
        this.leftWing.anchor.set(0,.5);
        this.leftWing.angle = -45;
        this.leftWing.width = -this.leftWing.width;
        // this.leftWing.height = this.thickness;
        // this.leftWing.tint = 0xaa3333;
        // this.leftWing.x = -this.thickness/2;
        this.wings.add(this.leftWing);

        this.rightWing = game.add.sprite(0,0,"gate_stopper_wing");
        this.rightWing.angle = 45;
        this.rightWing.anchor.set(0,.5);
        // this.rightWing.width = this.wingLength;
        // this.rightWing.height = this.thickness;
        // this.rightWing.tint = 0x33aa33;
        // this.rightWing.x = this.thickness/2;
        this.wings.add(this.rightWing);
        this.wings.rotation += Math.PI/2;
        this.isWorking = false;


        this.onPopout = onPopout;
        this.onInsert = onInsert;



        var topHeight = 40;

        topHeight = 40;

        var bottomHeight = 0;
        if(this.numLongMiddles>=2){
            // bottomHeight = 17;
            this.isWorking = true;
        }




        this.middleBodyWorking = game.add.sprite(0,0,"gate_stopper_body_working");
        this.middleBodyWorking.anchor.set(1,.5);
        this.add(this.middleBodyWorking);
        this.initWidth = this.middleBodyWorking.width;


        this.middleBodyBroken = game.add.sprite(0,0,"gate_stopper_body_broken");
        this.middleBodyBroken.anchor.set(1,.5);
        this.add(this.middleBodyBroken);
        // this.middleBodyBroken.alpha = 0;



        // this.middleBody.width = this.thickness;
        // this.middleBody.height = topHeight;
        // this.middleBody.tint = 0xaa9933;

        

        this.hitArea = game.add.sprite(x,y,"square");
        this.hitArea.anchor.set(1, .5);
        this.hitArea.alpha = 0;
        this.hitArea.width = this.wingLength;
        this.hitArea.height = 50;
        this.hitArea.y += this.hitArea.height/2;

        this.parent.add(this.hitArea);
        game.physics.enable(this.hitArea);
        this.enableBody = true;

        // this.hitArea.body.gravity.y = 0;
        // this.hitArea.body.gravity.y = 199;
        this.hitArea.body.drag.x = 30;
        this.hitArea.body.drag.y = 30;
        this.flapForever();


        this.alpha = 0;
        this.game.add.tween(this).to({"alpha": 1}, 1000).start();
        this.scale.set(.5);
        this.redraw();

    }


    update () {
        var w = this.parent.scale.x * 512;
        var h = this.parent.scale.y * 512;
        this.hitArea.body.setSize(w, h, (512-w)/2, (512-h)/2);




        if(this.isFloating){

            var lookDir = new Phaser.Point();
            lookDir.x = Math.cos(this.rotation-(Math.PI/2));
            lookDir.y = Math.sin(this.rotation-(Math.PI/2));

            var dot = lookDir.dot(this.hitArea.body.velocity);

            var desiredWingAngle = -dot * Math.sqrt(sqrMagnitude(this.hitArea.body.velocity)) * .002;//.y*50;


            this.leftWing.angle += (clamp(desiredWingAngle, -89, 89) - this.leftWing.angle)*.02;
            this.rightWing.angle += (-clamp(desiredWingAngle, -89, 89) - this.rightWing.angle) *.02;


            //rotate body based on velocity
            // var rot = (-this.x_dir * (Math.PI/6)) + this.hitArea.body.velocity.x * .01;//Math.atan2(-(this.hitArea.body.velocity.y*.1), this.hitArea.body.velocity.x);// + (Math.PI/2);
            var rot = Math.atan2(this.hitArea.body.velocity.y, this.hitArea.body.velocity.x);// - (Math.PI/2);
            this.rotation += (rot - this.rotation)*.01;


            var distFromVerticalCenter = ((game.height/2) - this.hitArea.body.y);
            var minVert = -400 * this.parent.scale.y;
            var maxVert = 460 * this.parent.scale.y;

            var distFromHorizontalCenter = (game.width/2) - this.hitArea.body.x;
            // account for approx curve of cell wall
            distFromHorizontalCenter -= Math.abs(distFromVerticalCenter)/8;
            var minHori = -400 * this.parent.scale.x;
            var maxHori = -50 * this.parent.scale.x;


            if(distFromVerticalCenter>maxVert && this.hitArea.body.velocity.y<0){
                this.hitArea.body.velocity.y+=20;
            }else if(distFromVerticalCenter<minVert && this.hitArea.body.velocity.y>0){
                this.hitArea.body.velocity.y-=20;
            }else{
                this.hitArea.body.velocity.y += (game.rnd.frac()-.5) * 50 ;
            }

            if(distFromHorizontalCenter<minHori && this.hitArea.body.velocity.x>0){
                this.hitArea.body.velocity.x -= 20;
            }else if(distFromHorizontalCenter>maxHori && this.hitArea.body.velocity.x<0){
                this.hitArea.body.velocity.x *= -1;
            }else{
                this.hitArea.body.velocity.x += (game.rnd.frac()-.5) * 50;
            }



             // this.hitArea.body.velocity.x = game.math.clamp( this.hitArea.body.velocity.x, -200, 200);
             // this.hitArea.body.velocity.y = game.math.clamp( this.hitArea.body.velocity.y, -200, 200);

            this.x = (this.hitArea.x);// + this.parent.x;// - (this.hitArea.width/2);
            this.y = (this.hitArea.y);// + this.parent.y;// - (this.hitArea.height/2);




            // this.body.velocity.y += (this.melanosome.y - this.y);

        }
        else{
            // this.hitArea.position = this.position;
            this.hitArea.x = this.x;
            this.hitArea.y = this.y;
        }

    }

    flapForever(){
        // if(this.isFloating){


        //     game.add.tween(this.hitArea.body.velocity).to({"y": -180, "x": this.x_dir * 80}, 200).start();
        //     // this.hitArea.body.velocity.y = -100;


        //     this.flapEvent = game.time.events.add(2000, function(){
        //         this.flapForever();
        //     }, this)

        // }
    }


    connectToGate(gate){
        if(this.currentGate == null && gate.currentStopper == null){
            if(this.flapEvent){
                game.time.events.remove(this.flapEvent);
            }

            gate.acceptStopper(this);

            if(this.onInsert){
                this.onInsert.call();
            }
            
            // gate.hitArea.body.enable = false;

            this.isFloating = false;
            this.currentGate = gate;




            if(this.hitArea && this.hitArea.body){
                // this.hitArea.body.enable = false;
                this.hitArea.body.velocity.y = 0;
                this.hitArea.body.velocity.x = 0;
            }

            game.add.tween(this).to({ "angle": Math.PI/2, "x": gate.x +32, "y": gate.y}, 300).start();
            game.add.tween(this.leftWing).to({ "angle": -45}, 300).start();
            game.add.tween(this.rightWing).to({ "angle": 45}, 300).start();

        }

    }

    fallOff(){
        if(this.onPopout){
            this.onPopout.call();
        }

        this.currentGate.wallBlocker.body.enable = false;
        this.currentGate.currentStopper = null;
        this.hitArea.body.velocity.x = 0;
        this.hitArea.body.velocity.y = 0;
        this.hitArea.x = this.x;
        this.hitArea.y = this.y;
        this.hitArea.body.enable = true;
        this.isFloating = true;
        this.hitArea.body.velocity.x = 200 * game.globalTimeScale;



        // game.add.tween(this).to({"alpha": 0}, 500).start();

        // this.middleBodyWorking.height = 0;

        game.add.tween(this.middleBodyWorking).to({"width": 0}, 200/game.globalTimeScale).start();




        game.time.events.add(300/game.globalTimeScale, function(){
            this.currentGate = null;
            if(this.isWorking){
                game.add.tween(this.middleBodyWorking).to({"width": this.initWidth}, 400/game.globalTimeScale).start();
            }
            // this.destroy();
        }, this);


    }
    redraw(){
        if(this.isWorking){
            if(this.currentGate && this.currentGate.wallBlocker && this.currentGate.wallBlocker.body){
                this.currentGate.wallBlocker.body.enable = false;
            }
            // this.middleBottom.height = 17;
            this.middleBodyWorking.alpha = 1;
            this.middleBodyBroken.alpha = 1;
        }else{
            if(this.currentGate && this.currentGate.wallBlocker && this.currentGate.wallBlocker.body){
                this.currentGate.wallBlocker.body.enable = true;
            }
            // this.middleBottom.height = 0;
            this.middleBodyWorking.alpha = 0;
            this.middleBodyBroken.alpha = 1;
        }
    }
}
