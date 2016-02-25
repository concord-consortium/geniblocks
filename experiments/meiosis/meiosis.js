var mother = new BioLogica.Organism(BioLogica.Species.Drake, "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog", 1),
    father = new BioLogica.Organism(BioLogica.Species.Drake, "a:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,a:D,a:W,a:fl,b:fl,a:Hl,a:t,b:T,a:rh,a:Bog,b:Bog", 0),
    gameteCount = 49,
    motherGametes = mother.createGametes(gameteCount),
    fatherGametes = father.createGametes(gameteCount),
    selectedMotherGameteId,
    selectedMotherGamete,
    selectedFatherGameteId,
    selectedFatherGamete,
    offspring;

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

  // Mother gametes
  ReactDOM.render(
    React.createElement(GeniBlocks.GametePoolView, {
      gametes: motherGametes,
      hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
      selectedId: selectedMotherGameteId,
      onGameteSelected: function(evt, id) {
        if (selectedMotherGameteId !== id) {
          selectedMotherGameteId = id;
          selectedMotherGamete = motherGametes[selectedMotherGameteId - 1];
          offspring = null;
          render();
        }
      }
    }),
    document.getElementById('mother-gametes')
  );

  // Father gametes
  ReactDOM.render(
    React.createElement(GeniBlocks.GametePoolView, {
      gametes: fatherGametes,
      hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
      selectedId: selectedFatherGameteId,
      onGameteSelected: function(evt, id) {
        if (selectedFatherGameteId !== id) {
          selectedFatherGameteId = id;
          selectedFatherGamete = fatherGametes[selectedFatherGameteId - 1];
          offspring = null;
          render();
        }
      }
    }),
    document.getElementById('father-gametes')
  );

  // Offspring org
  if (offspring) {
    ReactDOM.render(
      React.createElement(GeniBlocks.OrganismView, {org: offspring}),
      document.getElementById('offspring')
    );
  }
  else {
    ReactDOM.unmountComponentAtNode(document.getElementById('offspring'));
  }

  // Mother selected gamete
  if (selectedMotherGameteId) {
    ReactDOM.render(
      React.createElement(GeniBlocks.GameteView, { gamete: selectedMotherGamete, id: selectedMotherGameteId }),
      document.getElementById('mother-selected-gamete')
    );
  }

  // Mother selected gamete
  if (selectedFatherGameteId) {
    ReactDOM.render(
      React.createElement(GeniBlocks.GameteView, { gamete: selectedFatherGamete, id: selectedFatherGameteId }),
      document.getElementById('father-selected-gamete')
    );
  }
}

function breed() {
  if (selectedMotherGamete && selectedFatherGamete) {
    offspring = BioLogica.Organism.createFromGametes(mother.species, selectedMotherGamete, selectedFatherGamete);
    render();
  }
}

document.getElementById("breed-button").onclick = breed;

render();
