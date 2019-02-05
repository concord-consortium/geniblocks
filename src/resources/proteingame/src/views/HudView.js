import { _ } from 'underscore';
import $ from 'jquery';
import { View } from 'backbone';
import SizeTutorialView from '../views/SizeTutorialView';

const mainTemplate = require('html-loader!../templates/hudTemplate.html')


class HudView extends View {
	constructor ({ el, model, game }){
		super({
			el: el,
			events: {
				'click #show-nucleus': 'showNucleus',
				'click #game-win': 'win',
				'click #exit': 'confirmExit',
				'click #fast-exit': 'fastExit',
				'click .stay': 'stay',
				'click .leave': 'exit'
			},
			model: model
		});
		this.template = mainTemplate;
        this.clickSfx = game.add.audio("click_hit");

		this.render();

		this.viewType = "protein";
	}
	
	initialize(){
		this.listenTo(this.model, "change", this.render);
	}

	render(){
		var appTemplate = _.template(this.template);
		var html = appTemplate({
			model: this.model.attributes
		})
		this.$el.html(html);

        //if this is a nucleus activity, show the 'show nucleus' button
        if(game.isNucleus){
        	this.$el.find(".nucleus-only").show();
		}
	}

	loadTutorial() {
		if(game.isBossLevel || !game.tutorialData || !game.tutorialData[this.viewType] 
			|| !($(".tutorial-wrapper").hasClass("hidden"))) {
			return;
		}

		$(".tutorial-wrapper").empty();

		this.tutorialView = new SizeTutorialView({
			model: game.tutorialData[this.viewType],
			game: game,
			state: game.state.getCurrentState(),
			closeCallback: ()=>{this.hideTutorial();}
		});
		$(".tutorial-wrapper").append(this.tutorialView.$el);

		if(this.viewType === "results") {
			$(".tutorial-wrapper").addClass("results");
		} else {
			$(".tutorial-wrapper").removeClass("results");
		}

		this.showTutorial();
	}
	showTutorial(){
		if(!game.tutorialData || !game.tutorialData[this.viewType]){
			return;
		}
		$(".tutorial-wrapper").removeClass("hidden");
		this.tutorialView.setAction(true);
	}
	hideTutorial() {
		$(".tutorial-wrapper").addClass("hidden");
	}

	showMessage(msg){
		$(".nucleus-explanation").removeClass("hidden").html($('<p/>').text(msg));
	}
	hideMessage(){
		$(".nucleus-explanation").addClass("hidden")
	}

	showStats(){
		$("#stats").removeClass("hidden");
		
		this.updateStats();   
		game.actions.onAction.add(this.updateStats, this);
		game.actions.onTrack.add(this.updateStats, this);
	}

	updateStats(){
		var statsObj = game.actions.stats;
		var stats = "";
		for(var key in statsObj){
			stats += key + ": " + statsObj[key] + "<br>";
		}
		$("#stats").html(stats);
	}

	hideStats(){
		$("#stats").addClass("hidden");
	}

	setBlockInput(on) {
		if(on) {
			$("#input-blocker").removeClass("disabled");
		}
		else {
			$("#input-blocker").addClass("disabled");
		}
	}

	showNucleus(immediately){
		var $nuc = $("#nucleus");

		$nuc.removeClass("out");
		$nuc.removeClass("notransition");

		$nuc.addClass("notransition");
		$nuc[0].offsetHeight; // trigger reflow, flush css changes

		if(immediately!==true){
			$nuc.removeClass("notransition");
		}

		$nuc.addClass("in");
		$nuc.addClass("viewing-chromosome");

		this.viewType = "nucleus";
		this.loadTutorial();

		game.paused = true;
		this.clickSfx.play();

	}

	setHighlight(target, on) {
		var $el = $(target);

		// match the highlight div to the target's position and size
		var offset = $el.offset();
		var $div = $("#highlight")
			.height($el.innerHeight()+12)
			.width($el.innerWidth()+12)
			.offset({left: offset.left - 12, top: offset.top - 12});

		// toggle visibility
		if(on) {
			$div.removeClass("hidden");
		}
		else {
			$div.addClass("hidden");
		}
	}
	win(){
		game.win();
	}
	confirmExit(){
		this.clickSfx.play();
		game.paused = true;
		$(".exit-confirmation").removeClass("hidden");
	}
	exit(){
		game.paused = false;
		game.exit();

	}
	stay(){
		game.paused = false;
		$(".exit-confirmation").addClass("hidden");
	}
	fastExit(){
		game.fastExit();
	}
	hideEverything(hideMessage){
		if(hideMessage) {
			this.$el.children().not("#stats").addClass("hidden");
		} else {
			this.$el.children().not(".nucleus-explanation").not("#stats").addClass("hidden");
		}
	}
}

export default HudView;

