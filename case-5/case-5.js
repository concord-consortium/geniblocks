var mother = new BioLogica.Organism(BioLogica.Species.Drake, "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog", 1),
    father = new BioLogica.Organism(BioLogica.Species.Drake, "a:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,a:D,a:W,a:fl,b:fl,a:Hl,a:t,b:T,a:rh,a:Bog,b:Bog", 0),
    offspring = [],
    clutch = [],
    clutchSize = 20,
    testSelection = {},
    showingTest = false;

function render() {
  // Mother org
  ReactDOM.render(
    React.createElement(GeniBlocks.OrganismView, {org: mother}),
    document.getElementById('mother')
  );
  // Father org
  ReactDOM.render(
    React.createElement(GeniBlocks.OrganismView, {org: father}),
    document.getElementById('father')
  );

  // Mother genome
  ReactDOM.render(
    React.createElement(GeniBlocks.GenomeView, {
      org: mother,
      hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
      alleleChanged: function(chrom, side, prevAllele, newAllele) {
        mother.genetics.genotype.chromosomes[chrom][side].alleles.replaceFirst(prevAllele, newAllele);
        mother = new BioLogica.Organism(BioLogica.Species.Drake, mother.getAlleleString(), 1);
        clutch = [];
        offspring = [];
        render();
      }
    }),
    document.getElementById('mother-genome')
  );

  // Breeding pen
  /* global ReactSimpleTabs */
  var rce = React.createElement,
      Tabs = ReactSimpleTabs;
  ReactDOM.render(
    rce(Tabs, null, [
      rce(Tabs.Panel, { title: "Breeding Pen", key: "Breeding Pen" },
        rce(GeniBlocks.PenView, {orgs: clutch})),
      rce(Tabs.Panel, { title: "Stats", key: "Stats" },
        rce(GeniBlocks.StatsView, {orgs: offspring, lastClutchSize: clutchSize}))
    ]),
    document.getElementById('breeding-pen')
  );

  // Father genome test (in overlay)
  ReactDOM.render(
    React.createElement(GeniBlocks.GenomeTestView, {
      org: father,
      hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
      selection: testSelection,
        selectionChanged: function(gene, newValue) {
          testSelection[gene.name] = newValue;
          render();
      }}),
    document.getElementById('father-genome-test')
  );
}

function breed() {
  var times = clutchSize;
  clutch = [];
  while (times--) {
    var child = BioLogica.breed(mother, father);
    clutch.push(child);
    offspring.push(child);
  }
  render();
}

function toggleTest() {
  showingTest = !showingTest;
  var display = showingTest ? "block" : "none";
  document.getElementById("overlay").style.display = display;
  document.getElementById("test-wrapper").style.display = display;
}

function checkAnswer() {
  var allSelectedAlleles = [],
      alleleString = father.getAlleleString(),
      alleleStringLength = alleleString.length,
      success = true;

  // hard-coded check to see if user has made all four choices
  if (Object.keys(testSelection).length !== 4) {
    alert("First make a selection for all four genes!");
    return;
  }

  for (geneName in testSelection) {
    var alleles = father.species.geneList[geneName].alleles,
        selectedAlleles = testSelection[geneName].split(" ").map(function(num) {
          return alleles[num];
        });
    allSelectedAlleles = allSelectedAlleles.concat(selectedAlleles);
  }
  while (success && (testAllele = allSelectedAlleles.pop())) {
    alleleString = alleleString.replace(":"+testAllele, "");
    if (alleleString.length == alleleStringLength) {
      success = false;
    }
    alleleStringLength = alleleString.length;
  }
  var message = success ? "That's right!" : "Sorry, that's not right";
  alert(message);
}

document.getElementById("breed-button").onclick = breed;
document.getElementsByClassName("toggle-test-button")[0].onclick = toggleTest;
document.getElementsByClassName("toggle-test-button")[1].onclick = toggleTest;
document.getElementById("submit-button").onclick = checkAnswer;


render();
