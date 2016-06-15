/* global ReactDnD, ReactDnDHTML5Backend, AlleleContainer, PunnettContainer */
var DragDropContext = ReactDnD.DragDropContext,
    Backend = ReactDnDHTML5Backend,
    layoutAsLabels = false,

    dragons = [null, null],
    allelePools = [["W", "w", "W", "w", "w", "W", "W"], ["W", "T", "t", "W", "w", "W", "w", "Tk", "t", "t"]],
    alleleTargets = [["circle", "circle"],["circle", "circle", "square", "square"]],

    punnettAlleles = [null, null, null, null],
    punnettOrgs = [null, null, null, null],

    createDragon = function(alleles, orgArray, orgNumber, initialAlleleString) {
      for (var i = 0, ii = alleles.length; i < ii; i++) {
        if (!alleles[i] || alleles[i] === "circle" || alleles[i] === "square") return;
      }
      var alleleString = initialAlleleString;
      for (i = 0, ii = alleles.length; i < ii; i++) {
        var side = i % 2 ? "b:" : "a:";
        alleleString += side + alleles[i] + (i === ii - 1 ? "" : ",");
      }
      orgArray[orgNumber] = BioLogica.Organism.createLiveOrganism(BioLogica.Species.Drake, alleleString, 1);
    },

    moveAllele = function(sourceIndex, sourceOrg, targetIndex, targetOrg) {
      var initialAllele = alleleTargets[targetOrg][targetIndex];
      if ((initialAllele === "circle" || initialAllele === "square")) initialAllele = null;
      alleleTargets[targetOrg][targetIndex] = allelePools[sourceOrg][sourceIndex];
      allelePools[sourceOrg][sourceIndex] = initialAllele;
      createDragon(alleleTargets[targetOrg], dragons, targetOrg, "");
      render();
    },

    createPunnettDragons = function() {
      var index = 0;
      for (var i = 0; i < 2; i++) {
        for (var j = 2; j < 4; j++) {
          var alleles = [punnettAlleles[i], punnettAlleles[j]];
          createDragon(alleles, punnettOrgs, index++, "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:b,b:b,a:D,b:D,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog");
        }
      }
    },

    placeAlleleInPunnettSquare = function(sourceIndex, sourceOrg, targetIndex) {
      var initialAllele = punnettAlleles[targetIndex];
      punnettAlleles[targetIndex] = allelePools[sourceOrg][sourceIndex];
      allelePools[sourceOrg][sourceIndex] = initialAllele;
      createPunnettDragons();
      render();
    };

function renderDragon(dragon) {
  if (dragon) {
    return React.createElement(GeniBlocks.OrganismView, {org: dragon});
  } else {
    return React.createElement('div', {className: "unknown"}, "?");
  }
}

function render() {
  var genomes = dragons.map(function(dragon, i){
    return React.createElement('div', {key: i},
      React.createElement('div', {className: "org"},
        renderDragon(dragon)
      ),
      React.createElement('div', {className: "chromosomes labelable"},
        React.createElement(GeniBlocks.ChromosomeImageView),
        React.createElement(GeniBlocks.ChromosomeImageView)
      ),
      React.createElement('div', {className: "alleles"},
        React.createElement(AlleleContainer,
          {
            org: i,
            pool: allelePools[i],
            targets: alleleTargets[i],
            moveAllele: moveAllele
          }
        )
      )
    );
  });

  var game = React.createClass({
    render: function() {
      return React.createElement('div', {},
        React.createElement('div', {className: "genomes"},
          genomes
        ),
        React.createElement('div', {},
          React.createElement(PunnettContainer, {alleles: punnettAlleles, orgs: punnettOrgs, moveAllele: placeAlleleInPunnettSquare})
        )
      );
    }
  });

  var draggableGame = DragDropContext(Backend)(game);

  ReactDOM.render(
    React.createElement(draggableGame),
    document.getElementById('game')
  );

  layoutLabels();
}

render();

function layoutLabels() {
  var els = document.getElementsByClassName("labelable");
  for (var i=0, ii=els.length; i < ii; i++) {
    if (layoutAsLabels) {
      els[i].classList.add("wide");
    } else {
      els[i].classList.remove("wide");
    }
  }
}
document.getElementById("spaces").onclick = function() {
  if (document.getElementById("spaces").checked) {
    layoutAsLabels = false;
    layoutLabels();
  }
};
document.getElementById("labels").onclick = function() {
  if (document.getElementById("labels").checked) {
    layoutAsLabels = true;
    layoutLabels();
  }
};
