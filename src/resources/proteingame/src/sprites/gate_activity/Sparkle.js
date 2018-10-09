import Phaser from 'phaser'

const MIN_SIZE = .3, MAX_SIZE = 1;

export default class extends Phaser.Group {

    constructor ({ game, x, y, width, height, density, targetGroup }) {
        super(game);
        this.game = game;
        this.x = x;
        this.y = y;
        this.zoneWidth = width;
        this.zoneHeight = height;
        this.maxStars = (width * height) * density * .0008;
        this.stars = [];
        
        for(var i=0; i<this.maxStars; i++) {
            this.createStar();
        }

        targetGroup.add(this);
    }

    createStar() {
        var rndX = game.rnd.between(0, this.zoneWidth);
        var rndY = game.rnd.between(0, this.zoneHeight);
        var sparkle = game.add.sprite(rndX, rndY, "sparkle");
        sparkle.anchor.set(.5, .5);
        sparkle.alpha = 0;
        this.add(sparkle);
        this.stars.push(sparkle);
        sparkle.scale.setTo(MIN_SIZE, MIN_SIZE);

        // offset tweens so the stars aren't synchronized
        var rndLength = game.rnd.between(400,800);
        game.add.tween(sparkle).to({ "angle":359 }, 6000, Phaser.Easing.Linear.None, true).loop(true);

        var rndStart = game.rnd.between(0,1000);
        var rndLength = game.rnd.between(800,1000);
        game.add.tween(sparkle.scale).to({ "x":MAX_SIZE, "y":MAX_SIZE }, rndLength, Phaser.Easing.Linear.Out, true, rndStart, rndLength/2, true);
        game.add.tween(sparkle).to({ "alpha":1 }, rndLength, Phaser.Easing.Linear.Out, true, rndStart, rndLength/2, true);
    }

    setDensity(value) {
        this.maxStars = Math.floor((this.zoneWidth * this.zoneHeight) * value * .0008);

        while(this.stars.length > this.maxStars) {
            var star = this.stars.pop();
            if(star !== undefined) {
                game.tweens.removeFrom(star);
                star.destroy();
            }
        }

        while(this.stars.length < this.maxStars) {
            this.createStar();
        }
    }
}