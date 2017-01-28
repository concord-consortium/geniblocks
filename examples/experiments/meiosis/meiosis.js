var mother = new BioLogica.Organism(BioLogica.Species.Drake, "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog", 1),
    father = new BioLogica.Organism(BioLogica.Species.Drake, "a:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,a:D,a:W,a:fl,b:fl,a:Hl,a:t,b:T,a:rh,a:Bog,b:Bog", 0),
    visibleGenes = ['tail', 'wings', 'forelimbs', 'hindlimbs'],
    motherDisabledAlleles = [],
    fatherDisabledAlleles = [],
    showFilters = false,
    gameteCount = 72,
    animStiffness = 100,
    gametePoolWidth = 300,
    gametePoolHeight = 350,
    filteredGameteCount = 35,
    filteredGametePoolHeight = 200,
    motherGametes,
    fatherGametes,
    prevSelectedMotherGameteId,
    selectedMotherGameteId,
    selectedMotherGamete,
    selectedMotherGameteSrcRect,
    prevSelectedFatherGameteId,
    selectedFatherGameteId,
    selectedFatherGamete,
    selectedFatherGameteSrcRect,
    fertilizationState = 'none',  // 'none' -> 'fertilizing' -> 'fertilized' -> 'complete' -> 'none'
    offspring;

function parseQueryString(queryString) {
    var params = {}, queries, temp, i, l;

    // Split into key/value pairs
    queries = queryString.split('&');

    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    return params;
}

var urlParams = parseQueryString((window.location.search).substring(1));
if (urlParams.filter && ((urlParams.filter.toLowerCase() === "true") ||
                        Boolean(Number(urlParams.filter)))) {
  showFilters = true;
  gametePoolHeight = filteredGametePoolHeight;
  gameteCount = filteredGameteCount;
}
if (urlParams.count > 0)
  gameteCount = Number(urlParams.count);
if (urlParams.speed > 0)
  animStiffness = Number(urlParams.speed);

motherGametes = mother.createGametes(gameteCount);
fatherGametes = father.createGametes(gameteCount);

function isGameteDisabled(gamete, disabledAlleles) {
  for (var ch in gamete) {
    var chromosome = gamete[ch];
    for (var i = 0; i < chromosome.alleles.length; ++i) {
      var allele = chromosome.alleles[i];
      // if any allele is disabled, the gamete is disabled
      if (disabledAlleles.indexOf(allele) >= 0)
        return true;
    }
  }
  // if no alleles are disabled, the gamete is enabled
  return false;
}

function isMotherGameteDisabled(gamete) {
  return isGameteDisabled(gamete, motherDisabledAlleles);
}

function isFatherGameteDisabled(gamete) {
  return isGameteDisabled(gamete, fatherDisabledAlleles);
}

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

  // Mother gamete filters
  if (showFilters) {
    ReactDOM.render(
      React.createElement(GeniBlocks.AlleleFiltersView, {
        species: mother.species,
        visibleGenes: visibleGenes,
        disabledAlleles: motherDisabledAlleles,
        onFilterChange: function(evt, allele, isChecked) {
          evt;
          var alleleIndex = motherDisabledAlleles.indexOf(allele),
              wasChecked = alleleIndex < 0;
          if (isChecked !== wasChecked) {
            if (isChecked)
              motherDisabledAlleles.splice(alleleIndex, 1);
            else {
              motherDisabledAlleles.push(allele);
              if (selectedMotherGamete && isMotherGameteDisabled(selectedMotherGamete)) {
                selectedMotherGameteId = null;
                selectedMotherGamete = null;
              }
            }
          }
          render();
        }
      }),
      document.getElementById('mother-allele-filters')
    );
  }
  else {
    ReactDOM.unmountComponentAtNode(document.getElementById('mother-allele-filters'));
    document.getElementById('mother-allele-filters').style.display = 'none';
  }

  // Father gamete filters
  if (showFilters) {
    ReactDOM.render(
      React.createElement(GeniBlocks.AlleleFiltersView, {
        species: father.species,
        visibleGenes: visibleGenes,
        disabledAlleles: fatherDisabledAlleles,
        onFilterChange: function(evt, allele, isChecked) {
          evt;
          var alleleIndex = fatherDisabledAlleles.indexOf(allele),
              wasChecked = alleleIndex < 0;
          if (isChecked !== wasChecked) {
            if (isChecked)
              fatherDisabledAlleles.splice(alleleIndex, 1);
            else {
              fatherDisabledAlleles.push(allele);
              if (selectedFatherGamete && isFatherGameteDisabled(selectedFatherGamete)) {
                selectedFatherGameteId = null;
                selectedFatherGamete = null;
              }
            }
          }
          render();
        }
      }),
      document.getElementById('father-allele-filters')
    );
  }
  else {
    ReactDOM.unmountComponentAtNode(document.getElementById('father-allele-filters'));
    document.getElementById('father-allele-filters').style.display = 'none';
  }

  // Mother gametes
  ReactDOM.render(
    React.createElement(GeniBlocks.GametePoolView, {
      gametes: motherGametes,
      visibleGenes: visibleGenes,
      width: gametePoolWidth,
      height: gametePoolHeight,
      animStiffness: animStiffness,
      selectedId: selectedMotherGameteId,
      isGameteDisabled: isMotherGameteDisabled,
      onGameteSelected: function(evt, id, gameteViewportRect) {
        if (selectedMotherGameteId !== id) {
          prevSelectedMotherGameteId = selectedMotherGameteId;
          selectedMotherGameteId = id;
          selectedMotherGamete = motherGametes[selectedMotherGameteId - 1];
          selectedMotherGameteSrcRect = gameteViewportRect;
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
      visibleGenes: visibleGenes,
      width: gametePoolWidth,
      height: gametePoolHeight,
      animStiffness: animStiffness,
      selectedId: selectedFatherGameteId,
      isGameteDisabled: isFatherGameteDisabled,
      onGameteSelected: function(evt, id, gameteViewportRect) {
        if (selectedFatherGameteId !== id) {
          prevSelectedFatherGameteId = selectedFatherGameteId;
          selectedFatherGameteId = id;
          selectedFatherGamete = fatherGametes[selectedFatherGameteId - 1];
          selectedFatherGameteSrcRect = gameteViewportRect;
          offspring = null;
          render();
        }
      }
    }),
    document.getElementById('father-gametes')
  );

  // Offspring org
  function renderOffspring() {
    var offspringOpacity = (fertilizationState === 'fertilized' ? 1.0 : 0.0);
    if (offspring) {
      ReactDOM.render(
        React.createElement(GeniBlocks.AnimatedOrganismView, {
            org: offspring,
            initialOpacity: 0.0,
            opacity: offspringOpacity,
            onRest: function() {
              selectedMotherGamete = selectedMotherGameteId = null;
              selectedFatherGamete = selectedFatherGameteId = null;
              fertilizationState = 'none';
              render();
            }
          }),
        document.getElementById('offspring')
      );
    }
    else {
      ReactDOM.unmountComponentAtNode(document.getElementById('offspring'));
    }
  }
  renderOffspring();

  // Mother selected gamete
  function renderSelectedMotherGamete() {
    if (!selectedMotherGameteId || (selectedMotherGameteId !== prevSelectedMotherGameteId)) {
      ReactDOM.unmountComponentAtNode(document.getElementById('mother-selected-gamete'));
    }
    if (selectedMotherGameteId) {
      var motherSelectedGameteViewportRect = document.getElementById('mother-selected-gamete')
                                                      .getBoundingClientRect();
      ReactDOM.render(
        React.createElement(GeniBlocks.FertilizingGameteView, {
          type: 'mother',
          gamete: selectedMotherGamete, id: selectedMotherGameteId,
          fertilizationState: fertilizationState,
          visibleGenes: visibleGenes,
          srcRect: selectedMotherGameteSrcRect,
          dstRect: motherSelectedGameteViewportRect,
          animStiffness: animStiffness,
          onRest: function() {
            if (fertilizationState === 'fertilizing') {
              fertilizationState = 'fertilized';
              // currently we must unmount to trigger the next animation stage
              ReactDOM.unmountComponentAtNode(document.getElementById('mother-selected-gamete'));
              ReactDOM.unmountComponentAtNode(document.getElementById('father-selected-gamete'));
              renderSelectedMotherGamete();
              renderSelectedFatherGamete();
              renderOffspring();
            }
          }
        }),
        document.getElementById('mother-selected-gamete')
      );
      prevSelectedMotherGameteId = selectedMotherGameteId;
    }
  }
  renderSelectedMotherGamete();

  // Father selected gamete
  function renderSelectedFatherGamete() {
    if (!selectedFatherGameteId || (selectedFatherGameteId !== prevSelectedFatherGameteId)) {
      ReactDOM.unmountComponentAtNode(document.getElementById('father-selected-gamete'));
    }
    if (selectedFatherGameteId) {
      var fatherSelectedGameteViewportRect = document.getElementById('father-selected-gamete')
                                                      .getBoundingClientRect();
      ReactDOM.render(
        React.createElement(GeniBlocks.FertilizingGameteView, {
          type: 'father',
          gamete: selectedFatherGamete, id: selectedFatherGameteId,
          fertilizationState: fertilizationState,
          visibleGenes: visibleGenes,
          srcRect: selectedFatherGameteSrcRect,
          dstRect: fatherSelectedGameteViewportRect,
          animStiffness: animStiffness
        }),
        document.getElementById('father-selected-gamete')
      );
      prevSelectedFatherGameteId = selectedFatherGameteId;
    }
  }
  renderSelectedFatherGamete();
} // render()

function breed() {
  if (selectedMotherGamete && selectedFatherGamete) {
    fertilizationState = 'fertilizing';
    offspring = BioLogica.Organism.createFromGametes(mother.species, selectedMotherGamete, selectedFatherGamete);
    render();
  }
}

document.getElementById("breed-button").onclick = breed;

render();
