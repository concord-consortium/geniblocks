import { _ } from 'underscore';
import { Model, View } from 'backbone';
class ChromosomeModel extends Model {
	constructor(options){
		super(options);
		this.set("fullCode", this.getFullCodeArray());
	}

	initialize(){
		// this.listenTo(1this, "change", this.updateValues);
	}
	updateValues(){


	}
	updateTRP(){
		// var mom = this.get("TRPFromMom");
		// var dad = this.get("TRPFromDad");

		// var total = 0;

		// if(mom == "working"){
		// 	total+=.5;
		// }if(dad == "working"){
		// 	total+=.5;
		// }

		// this.set("TRPPercentWorking", total);

	}



	getFullCodeArray(){
		var fullCode = [];

		var onechunk = "";
		var atcg = ["A","T", "C", "G"];
		for(var i = 0;i<1000;i++){
			onechunk+= atcg[i%4];
		}


		onechunk = "ACTGCCGATGCATGCTAGCTATCGTACGTAGCTAGCTAGCTGCTAGCTAGCTGATCGATGCTAGCTAGCTGATCGATGCTAGCTAGCTGATCGATCGATGCTAGTGCTAGCTAGCTAGCTGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTACGTAGCTGCATGCTAGCTAGCTAGCTAGCTAGCTAGCTGACTGTGACTCAACTACGATCGCAGTTCATGCGACTCGACGACGTCGCGGCGACGCATCGCATGCTCGATCGTACCGTCGATCTAGCTGACTGATCGTCGTACGTACGCTAGCTGCTAGCTGCTAGCTAGCTAGTCGACTGCTAGCTGACTGCTGCATACTGCTAGCTCGATCGTACGTCGCTGATCGTACG"

		for(var i = 0;i<100;i++){
			fullCode.push(onechunk);
		}


		// var genes = this.get("genes");
		// for(var i = 0;i<genes.length;i++){
		// 	var gene = genes[i];
		// 	var allele = gene.alleles[gene.selected_allele];
		// 	if(gene.location && allele.code){
		// 		fullCode[gene.location] = "<span class=\"changeable\">" + allele.code + "</span>";
		// 	}
		// }

		return fullCode;
	}
	getSelectedAlleleByGeneID(gene_id){
		var genes = this.get("genes");
		for(var i = 0;i<genes.length;i++){
			if(genes[i].id == gene_id){
				var gene = genes[i];
				var allele = gene.alleles[gene.selected_allele];
				return allele;
			}
		}
	}
	getSelectedAlleleByGeneIndex(index){
		var genes = this.get("genes");
		var gene = genes[index];
		if(gene){
			var allele = gene.alleles[gene.selected_allele];
			return allele;
			
		}
	}
}
export default ChromosomeModel;
