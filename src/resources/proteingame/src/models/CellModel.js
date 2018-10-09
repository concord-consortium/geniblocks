import { _ } from 'underscore';
import { clamp } from '../utils';
import { Model, View, Collection } from 'backbone';
import ChromosomeModel from './ChromosomeModel'

class CellModel extends Model {
	constructor(options){
		
		//hacky? :/
		//create an easily accessible array of all chromosomes
		options.allChromosomes = [];
		var pairs = options.chromosomePairs;
		for(var i = 0;i<pairs.length;i++){
		    var chromosomeAModel = new ChromosomeModel(
		        pairs[i].chromosomeA
		    );
		    var chromosomeBModel = new ChromosomeModel(
		        pairs[i].chromosomeB
		    );
		    options["Chromosome" + i + "A"] = chromosomeAModel;
		    options["Chromosome" + i + "B"] = chromosomeBModel;
		    options.allChromosomes.push(chromosomeAModel);
		    options.allChromosomes.push(chromosomeBModel);
		}


		options.maxStars = 23;
		options.maxSlotted = 15;
		options.maxEscaped = 20;

		options.current_pair_index = options.cellData.current_pair_index;
		options.initial_chromosome_location = options.cellData.initial_chromosome_location;

		super(options);
		this.target_state = this.colorToState(options.target_color);

	}



	colorToState(color){
		var state = {};
		state.numStars = 0;
		state.numSlotted = 0;
		state.numEscaped = 0;

		//default comparisons are all ==
		state.numStarComparison = '=='
		state.numSlottedComparison = '==';
		state.numEscapedComparison = '==';

		switch(color){
			//gates work
			///full of stars
			////fully slotted
			case "charcoal":
				state.numStars = this.get("maxStars");
				state.numSlotted = this.get("maxSlotted");
				state.numEscaped = this.get("maxEscaped");
				state.numStarsComparison = '>=';
				state.numSlottedComparison = '>=';
				state.numEscapedComparison = '>=';
				break;
			////empty slotted
			case "ash":
				state.numStars = this.get("maxStars");
				state.numSlotted = 0;
				state.numEscaped = this.get("maxEscaped");
				state.numStarsComparison = '>=';
				state.numSlottedComparison = '<=';
				state.numEscapedComparison = '>=';
				break;

			///half full stars
			////fully slotted
			case "lava":
				state.numStars = Math.round(this.get("maxStars")/2);
				state.numSlotted = this.get("maxSlotted");
				state.numEscaped = this.get("maxEscaped");

				state.numStarsComparison = '=='; //can this be <= ???
				state.numSlottedComparison = '>=';
				state.numEscapedComparison = '>=';
				break;
			////empty slotted
			case "sand":
				state.numStars = Math.round(this.get("maxStars")/2);
				state.numSlotted = 0;
				state.numEscaped = this.get("maxEscaped");

				state.numStarsComparison = '=='; //can this be <= ???
				state.numSlottedComparison = '<=';
				state.numEscapedComparison = '>=';
				break;





			//gates don't work
			///full of stars
			////fully slotted
			case "steel":
				state.numStars = this.get("maxStars");
				state.numSlotted = this.get("maxSlotted");
				state.numEscaped = 0;

				state.numStarsComparison = '>='; 
				state.numSlottedComparison = '>=';
				state.numEscapedComparison = '<=';
				break;
			////empty slotted
			case "silver":
				state.numStars = this.get("maxStars");
				state.numSlotted = 0;
				state.numEscaped = 0;

				state.numStarsComparison = '>='; 
				state.numSlottedComparison = '<=';
				state.numEscapedComparison = '<=';
				break;

			///half full stars
			////fully slotted
			case "copper":
				state.numStars = Math.round(this.get("maxStars")/2);
				state.numSlotted = this.get("maxSlotted");
				state.numEscaped = 0;

				state.numStarsComparison = '=='; //can this be <= ???
				state.numSlottedComparison = '>=';
				state.numEscapedComparison = '<=';
				break;
			////empty slotted
			case "gold":
				state.numStars = Math.round(this.get("maxStars")/2);
				state.numSlotted = 0;
				state.numEscaped = 0;

				state.numStarsComparison = '=='; //can this be <= ???
				state.numSlottedComparison = '<=';
				state.numEscapedComparison = '<=';
				break;



			case "frost":
				state.numStars = 0;
				//these next two are totally irrelevant, melanosomes never get here.
				state.numSlotted = 0;
				state.numEscaped = 0;

				state.numStarsComparison = '<='; 
				state.numSlottedComparison = '<=';
				state.numEscapedComparison = '<=';

				break;
		}


		return state;

	}



	initialize(){

		// this.set("current_pair_index", 0);


		// this.listenTo(this, "change", this.updateValues);
		var chroms = this.get("allChromosomes");
		for(var i = 0;i<chroms.length;i++){
			var chrom = chroms[i];
			chrom.on("change", function(){
				this.trigger("change");
			}, this);
		}

		// this.getGeneticColor();
	}


	//this is used to get the 'base' case
	getGeneticColor(currentActivity, value){
		// var color = new Phaser.Color();
		var h, s, v, shininess = 0;

		h = 20/256; //orange

		var hex_string = "#ffffff";

	    var tyr_allele_a = this.getCurrentAllele("Chromosome1A", "tyr_mouth");
	    var tyr_allele_b = this.getCurrentAllele("Chromosome1B", "tyr_mouth");

	    var trp_allele_a = this.getCurrentAllele("Chromosome1A", "trp_flower_01");
	    var trp_allele_b = this.getCurrentAllele("Chromosome1B", "trp_flower_01");
        
        var motor_allele_a =  this.getCurrentAllele("Chromosome2A", "myocin_grabber");
        var motor_allele_b = this.getCurrentAllele("Chromosome2B", "myocin_grabber");

        var gate_allele_a =  this.getCurrentAllele("Chromosome0A", "gate_stopper_button");
        var gate_allele_b = this.getCurrentAllele("Chromosome0B", "gate_stopper_button");


        // console.log(tyr_allele_a.value, tyr_allele_b.value, 
        // 			trp_allele_a.value, trp_allele_b.value, 
        // 			motor_allele_a.value, motor_allele_b.value);


        if(tyr_allele_a.value === true || tyr_allele_b.value === true){
        	
        	if(trp_allele_a.value === true || trp_allele_b.value === true){
        		//grayscale
        		s = 0;
        		v = 0;

        		if(motor_allele_a.value === true || motor_allele_b.value === true){
        			//charcoal/steel
        			// console.log("charcoal/steel");
        			v += 0;

        		}else{
        			//ash/silver
        			// console.log("ash/silver");
        			v += .5;
        		}


        	}else{
        		s = 1;
        		v = .5;

        		//orange
        		if(motor_allele_a.value === true || motor_allele_b.value === true){
        			//lava/copper
        			// console.log("lava/copper");
        			v += 0;

        		}else{
        			//sand/gold
        			// console.log("sand/gold");
        			v += .5;
        		}
        	}



        	//shininess
	        if(gate_allele_a.value == false || gate_allele_b.value == false){
	        	shininess = 1;
	        }else{
	        	shininess = 0;
	        }



        }else{
        	//white/albino
        	s = 0;
        	v = 1;
        	shininess = 1;
        }



		//Modify HSV based on current activity
		switch(currentActivity){
			case "size":
			case "SizeActivity":
				if(value>=.5){

        			if(motor_allele_a.value === true || motor_allele_b.value === true){
        				//value = .5 ... 1
						//.5 = lava, 1 = charcoal 
						s = 1 - ((value-.5)*2); //1 ... 0
						v = 1 - value; //.5 ... 0
        			}else{
        				//value = .5 ... 1
						//.5 = sand, 1 = ash 
						s = 1 - ((value-.5)*2); //1 ... 0
						v = 1 - (value-.5); //1 ... .5
        			}

				}else{


        			if(motor_allele_a.value === true || motor_allele_b.value === true){
						//0 ... .5
						//0 = frost, .5 = lava
						//s == 1 ... 0
						s = ((value)*2); //0 ... 1
						v = 1-value;//1-(value); //1 ... .5

        			}else{
						//0 = frost, .5 = sand, 
						s = ((value)*2); //0 ... 1
						v = 1-(value); //1 ... .5



        			}

					shininess = (.5-value)*2;
				}
				break;

			case "motor":
			case "MotorActivity":
				//value 0 .. 1 = lightness 1 .. 0
		        if(tyr_allele_a.value === true || tyr_allele_b.value === true){
		        	if(trp_allele_a.value === true || trp_allele_b.value === true){
		        		v = .5 - (value/2);
		        	}else{
		        		v = 1 - (value/2);
		        	}
		        }
		        else{
		        	value = 1;
		        }

				break;

			case "gate":
			case "GateActivity":
				shininess = 1-value;
				break;

		}







		h += v*.07;
		v = this.convertV(v);
		s = this.convertS(s);






		var color = Phaser.Color.HSVtoRGB(h,s,v);
		color.a = shininess;

		return color;


	}



	getGeneticHSLA(currentActivity, value){
		// var color = new Phaser.Color();
		var h, s, v, shininess = 0;

		h = .035; //orange

		var hex_string = "#ffffff";

	    var tyr_allele_a = this.getCurrentAllele("Chromosome1A", "tyr_mouth");
	    var tyr_allele_b = this.getCurrentAllele("Chromosome1B", "tyr_mouth");

	    var trp_allele_a = this.getCurrentAllele("Chromosome1A", "trp_flower_01");
	    var trp_allele_b = this.getCurrentAllele("Chromosome1B", "trp_flower_01");
        
        var motor_allele_a =  this.getCurrentAllele("Chromosome2A", "myocin_grabber");
        var motor_allele_b = this.getCurrentAllele("Chromosome2B", "myocin_grabber");

        var gate_allele_a =  this.getCurrentAllele("Chromosome0A", "gate_stopper_button");
        var gate_allele_b = this.getCurrentAllele("Chromosome0B", "gate_stopper_button");


        // console.log(tyr_allele_a.value, tyr_allele_b.value, 
        // 			trp_allele_a.value, trp_allele_b.value, 
        // 			motor_allele_a.value, motor_allele_b.value);


        if(tyr_allele_a.value === true || tyr_allele_b.value === true){
        	
        	if(trp_allele_a.value === true || trp_allele_b.value === true){
        		//grayscale
        		s = 0;
        		v = 0;

        		if(motor_allele_a.value === true || motor_allele_b.value === true){
        			//charcoal/steel
        			// console.log("charcoal/steel");
        			v += 0;

        		}else{
        			//ash/silver
        			// console.log("ash/silver");
        			v += .5;
        		}


        	}else{
        		s = 1;
        		v = .5;

        		//orange
        		if(motor_allele_a.value === true || motor_allele_b.value === true){
        			//lava/copper
        			// console.log("lava/copper");
					v += 0;
					h = .01;

        		}else{
        			//sand/gold
        			// console.log("sand/gold");
					v += .5;
					h = .03;
        		}
        	}



        	//shininess
	        if(gate_allele_a.value == false || gate_allele_b.value == false){
	        	shininess = 1;
	        }else{
	        	shininess = 0;
	        }



        }else{
        	//white/albino
        	s = -.75;
        	v = 1.25;
        	shininess = 1;
        }



		//Modify HSV based on current activity
		switch(currentActivity){
			case "size":
			case "SizeActivity":
				if(value>=.5){

        			if(motor_allele_a.value === true || motor_allele_b.value === true){
        				//value = .5 ... 1
						//.5 = lava, 1 = charcoal 
						s = 1 - ((value-.5)*2); //1 ... 0
						v = 1 - value; //.5 ... 0
        			}else{
        				//value = .5 ... 1
						//.5 = sand, 1 = ash 
						s = 1 - ((value-.5)*2); //1 ... 0
						v = 1 - (value-.5); //1 ... .5
        			}

				}else{


        			if(motor_allele_a.value === true || motor_allele_b.value === true){
						//0 ... .5
						//0 = frost, .5 = lava
						//s == 1 ... 0
						s = ((value)*2); //0 ... 1
						v = 1-value;//1-(value); //1 ... .5

        			}else{
						//0 = frost, .5 = sand, 
						s = ((value)*2); //0 ... 1
						v = 1-(value); //1 ... .5



        			}

					shininess = (.5-value)*2;
				}
				break;

			case "motor":
			case "MotorActivity":
				//value 0 .. 1 = lightness 1 .. 0
		        if(tyr_allele_a.value === true || tyr_allele_b.value === true){
		        	if(trp_allele_a.value === true || trp_allele_b.value === true){
		        		v = .5 - (value/2);
		        	}else{
		        		v = 1 - (value/2);
		        	}
		        }
		        else{
		        	value = 1;
		        }

				break;

			case "gate":
			case "GateActivity":
				shininess = 1-value;
				break;

		}


		s = clamp(s, 0, 1);
		v = clamp(v, 0, 1);



		//h += v*.025;
		s = ((s - 1) * .68) - .24;
		v = ((v * 2) - .9) * .25;

		var hsla = {};
		hsla.h = h;
		hsla.s = s;
		hsla.l = v;
		hsla.a = Math.max(0, shininess * .75);
		return hsla;

		// var color = Phaser.Color.HSVtoRGB(h,s,v);
		// color.a = shininess;

		// return color;


	}



	getTargetHSLA(){
		var h,s,v, shininess = 0;
		h = .01; //orange

		switch(this.get("target_color")){

			case "charcoal":
	    		s = 0;
	    		v = 0;
	    		shininess = 0;
				break;

			case "steel":
	    		s = 0;
	    		v = 0;
	    		shininess = 1;
				break;

			case "ash":
	    		s = 0;
	    		v = .5;
	    		shininess = 0;
				break;

			case "silver":
	    		s = 0;
	    		v = .5;
	    		shininess = 1;
				break;

			case "lava":
	    		s = 1;
	    		v = .5;
	    		shininess = 0;
				break;

			case "copper":
	    		s = 1;
	    		v = .5;
	    		shininess = 1;
				break;

			case "sand":
	    		s = 1;
	    		v = 1;
	    		shininess = 0;
				break;

			case "gold":
	    		s = 1;
	    		v = 1;
	    		shininess = 1;
				break;



			case "frost":
			case "albino":
	    		s = -.75;
	    		v = 1.25;
	    		shininess = 1;
				break;
		}


		s = clamp(s, 0, 1);
		v = clamp(v, 0, 1);

		h += v*.05;
		s = ((s - 1) * .68) - .24;
		v = ((v * 2) - .67) * .25;

		var hsla = {};
		hsla.h = h;
		hsla.s = s;
		hsla.l = v;
		hsla.a = shininess * .75;

		return hsla;


	}




	getTargetColor(){
		var h,s,v, shininess = 0;
		h = .035; //orange

		switch(this.get("target_color")){

			case "charcoal":
	    		s = 0;
	    		v = 0;
	    		shininess = 0;
				break;

			case "steel":
	    		s = 0;
	    		v = 0;
	    		shininess = 1;
				break;

			case "ash":
	    		s = 0;
	    		v = .5;
	    		shininess = 0;
				break;

			case "silver":
	    		s = 0;
	    		v = .5;
	    		shininess = 1;
				break;

			case "lava":
	    		s = 1;
	    		v = .5;
	    		shininess = 0;
				break;

			case "copper":
	    		s = 1;
	    		v = .5;
	    		shininess = 1;
				break;

			case "sand":
	    		s = 1;
	    		v = 1;
	    		shininess = 0;
				break;

			case "gold":
	    		s = 1;
	    		v = 1;
	    		shininess = 1;
				break;



			case "frost":
			case "albino":
	    		s = 0;
	    		v = 1;
	    		shininess = 1;
				break;
		}


		h += v*.05;
		v = this.convertV(v);
		s = this.convertS(s);

		var color = Phaser.Color.HSVtoRGB(h,s,v);
		color.a = shininess;
		return color;


	}

	convertV(v){
		var rtn = Math.log((v+1)*(v+1));
		rtn = clamp(rtn, 0, 1);
		return rtn;
	}

	convertS(s){
		var rtn = s * .7;
		rtn = clamp(rtn, 0, 1);
		return rtn;
	}



	getCurrentAllele(chromosome_name, gene_id){
		var genes = this.get(chromosome_name).get("genes");
		var gene = _.find(genes, function(g){
			return g.id == gene_id;
		});
		var allele = gene.alleles[gene.selected_allele];
		return allele;
	}

	getGene(chromosome_name, gene_id){
		var genes = this.get(chromosome_name).get("genes");
		var gene = _.find(genes, function(g){
			return g.id == gene_id;
		});
		return gene;
	}

	resetChangedness(){
		var allChroms = this.get("allChromosomes");

		for(var i = 0;i<allChroms.length;i++){
			var genes = allChroms[i].get("genes");
			for(var j = 0;j<genes.length;j++){
				genes[j].has_changed = false;
			}
		}
	}

	//check alleles to see if they will generate the input color name (charcoal/lava, etc)
	getGeneticColorName(){

	    var tyr_allele_a = this.getCurrentAllele("Chromosome1A", "tyr_mouth").value;
	    var tyr_allele_b = this.getCurrentAllele("Chromosome1B", "tyr_mouth").value;

	    var trp_allele_a = this.getCurrentAllele("Chromosome1A", "trp_flower_01").value;
	    var trp_allele_b = this.getCurrentAllele("Chromosome1B", "trp_flower_01").value;
        
        var motor_allele_a =  this.getCurrentAllele("Chromosome2A", "myocin_grabber").value;
        var motor_allele_b = this.getCurrentAllele("Chromosome2B", "myocin_grabber").value;

        var gate_allele_a =  this.getCurrentAllele("Chromosome0A", "gate_stopper_button").value;
        var gate_allele_b = this.getCurrentAllele("Chromosome0B", "gate_stopper_button").value;

        //not albino
		if(tyr_allele_a == true || tyr_allele_b == true){
			//shiny
	        if(gate_allele_a === false || gate_allele_b === false){
				//deep	        	
	        	if(motor_allele_a || motor_allele_b){
	        		//grey
	        		if(trp_allele_a || trp_allele_b){
	        			return "steel";
	        		}
	        		//orange/yellow
	        		else{
	        			return "copper";
	        		}
	        	}
	        	//faded
	        	else{
	        		//grey
	        		if(trp_allele_a || trp_allele_b){
	        			return "silver";
	        		}
	        		//orange/yellow
	        		else{
	        			return "gold";
	        		}
	        	}
	        }
	        //not shiny
	        else{
				//deep	        	
	        	if(motor_allele_a || motor_allele_b){
	        		//grey
	        		if(trp_allele_a || trp_allele_b){
	        			return "charcoal";
	        		}
	        		//orange/yellow
	        		else{
	        			return "lava";
	        		}
	        	}
	        	//faded
	        	else{
	        		//grey
	        		if(trp_allele_a || trp_allele_b){
	        			return "ash";
	        		}
	        		//orange/yellow
	        		else{
	        			return "sand";
	        		}
	        	}
	        }
		}

		//albino
		else{
			return "frost";
		}


		return "[no color found]";

	}



	getGeneticShortcode(){

		var shortcode = "";
		
		shortcode += this.get("Chromosome1A").get("genes")[0].selected_allele;
		shortcode += this.get("Chromosome1B").get("genes")[0].selected_allele;

		shortcode += this.get("Chromosome1A").get("genes")[1].selected_allele;
		shortcode += this.get("Chromosome1B").get("genes")[1].selected_allele;

		shortcode += this.get("Chromosome2A").get("genes")[0].selected_allele;
		shortcode += this.get("Chromosome2B").get("genes")[0].selected_allele;

		shortcode += this.get("Chromosome0A").get("genes")[0].selected_allele;
		shortcode += this.get("Chromosome0B").get("genes")[0].selected_allele;

		return shortcode;

	}

}
export default CellModel;
