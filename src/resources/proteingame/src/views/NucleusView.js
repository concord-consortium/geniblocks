import { _ } from 'underscore';
import $ from 'jquery';
import { View } from 'backbone';
import ChromosomeView from './ChromosomeView'

const mainTemplate = require('html-loader?root=../..!../templates/nucleusTemplate.html')
const resultsTemplate = require('html-loader?root=../..!../templates/nucleusResultsTemplate.html')


class NucleusView extends View {
	constructor ({ el, model, game }){
		super({
			el: el,
			events: {
				'click .close': 'close', // deliver proteins
				'click .compile': 'compile',
				'click .back': 'back',
				'click .chromosome-selectors button': 'switchVisibleChromosome'
			},
			model: model,
			game: game
		});
		this.template = _.template(mainTemplate);
		this.resultsTemplate = _.template(resultsTemplate);
		this.render();

        this.compileSfx = game.add.audio("compile");
        this.clickSfx = game.add.audio("click_hit");

  		this.game = game;
	}

	initialize(){




	}
	render(){
		var html = this.template({
			"cellModel": this.model
		})
		this.$el.html(html);
		
		var curPairIndex = this.model.get("current_pair_index");
		var chromA = this.model.get("Chromosome" + curPairIndex + "A");
		var chromB = this.model.get("Chromosome" + curPairIndex + "B");
		

		// if more than one gene is relevant, average the starting location
		var genesA = chromA.get("genes");
		var relevantGenes = 0, locSum = 0, initLoc=0;

		genesA.forEach((gene) => {
			if(gene.isRelevant) {
				relevantGenes++;
				locSum += gene.location;
			}
		});
		if(relevantGenes > 1){
			initLoc = locSum / relevantGenes;
		} else {
			initLoc = genesA[0].location;
		}


		this.chromosomeAView = new ChromosomeView({
			el: ".chromosome-a", 
			model: chromA,
			initial_chromosome_location: initLoc 
		});
		this.chromosomeBView = new ChromosomeView({
			el: ".chromosome-b", 
			model: chromB,
			initial_chromosome_location: initLoc
		});


		this.chromosomeAView.jumpToLocation(initLoc);
		this.chromosomeBView.jumpToLocation(initLoc);
	}

	renderResults(){
		var html = this.resultsTemplate({
			"cellModel": this.model
		})
		this.$el.find("#nucleus-results").html(html);
	}

	switchVisibleChromosome(e){
		this.clickSfx.play();
		var current_index = this.model.get("current_pair_index");
		var val = parseInt($(e.currentTarget).val());
		if(e!=current_index){
			this.model.set("current_pair_index", val);
			this.render();
		}
	}

	close(){

		this.clickSfx.play();

		$("#nucleus").removeClass("viewing-chromosome");
		$("#nucleus").removeClass("viewing-results");
		$("#nucleus").addClass("out");
		$("#nucleus").removeClass("in");

		game.useBossMove();
		game.hudView.viewType = "protein";
		game.handleReturnFromNucleus();

		if(game.nucleusOnly){
	        game.phone.post("activityExit", {
	          "activity": "nucleus",
	          "resultingGeneticColor": this.model.getGeneticColorName(),
	          "geneticShortcode": this.model.getGeneticShortcode(),
	          "cellModel": this.model.toJSON()
	        });
		}

	}
	back(){
		$("#nucleus").addClass("viewing-chromosome");
		$("#nucleus").removeClass("viewing-results");

		//reset hasChanged
		this.model.resetChangedness();
	}
	compile(){
		this.renderResults();
		
		game.hudView.viewType = "results";
		game.hudView.loadTutorial();
		this.compileSfx.play();
		$("#nucleus").removeClass("viewing-chromosome");
		$("#nucleus").addClass("viewing-results");

		//reset hasChanged
		this.model.resetChangedness();
		
	}
}

export default NucleusView;

