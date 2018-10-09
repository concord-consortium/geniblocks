import _ from 'underscore'
import Phaser from 'phaser'

export default class ActionTracker {

    constructor(game){
        
        this.game = game;

        this._stats = {};
        this.onAction = new Phaser.Signal();
        this.onTrack = new Phaser.Signal();
    }

    track(actions) {
        actions.forEach(action => {
            this._stats[action] = 0;
        })

        this.onTrack.dispatch({
            "types": actions
        });
    }

    record(action) {
        this._stats[action] = ++this._stats[action];

        this.onAction.dispatch({
            "type": action,
            "count": this._stats[action]
        });
    }

    get stats(){
        return _.clone(this._stats);
    }

}