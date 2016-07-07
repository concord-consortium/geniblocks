import React, {PropTypes} from 'react';
import ChromosomeView from './chromosome';

/**
 * View of the set of chromosomes of an organism, ordered as matched pairs.
 *
 * Usually defined by passing in a Biologica Organism, but may also be defined by
 * passing in a map of Biologica Chromosomes and a Biologica Species.
 */
const GenomeView = ({org, chromosomes, species, hiddenAlleles = [], editable=true, showLabels=true, showAlleles=false, selectedChromosomes={}, small=false, onAlleleChange, onChromosomeSelected}) => {
  let pairWrappers = [];
  if (org) {
    chromosomes = org.genetics.genotype.chromosomes;
    species = org.species;
  }

  for (let chromosomeName of species.chromosomeNames) {
    let chrom = chromosomes[chromosomeName],
        pairs = [];
    for (let side in chrom) {
      let chromosome = chrom[side];
      pairs.push(
        <ChromosomeView
          chromosome={chromosome}
          key={pairs.length + 1}
          hiddenAlleles={hiddenAlleles}
          labelsOnRight={pairs.length>0 || side==="b"}
          editable={editable}
          selected={selectedChromosomes[chromosomeName] === side}
          showLabels={showLabels}
          showAlleles={showAlleles}
          small={small}
          onAlleleChange={function(prevAllele, newAllele) {
            onAlleleChange(chromosomeName, side, prevAllele, newAllele);
          }}
          onChromosomeSelected={function(){
            if (onChromosomeSelected)
              onChromosomeSelected(org, chromosomeName, side);
          }}/>
      );
    }
    pairWrappers.push(
      <div className="geniblocks chromosome-pair" key={pairWrappers.length + 1}>
        { pairs }
      </div>
    );
  }
  return (
    <div className="geniblocks genome">
      { pairWrappers }
    </div>
  );
};

GenomeView.propTypes = {
  org: PropTypes.object,
  chromosomes: PropTypes.object,
  species: PropTypes.object,
  hiddenAlleles: PropTypes.array,
  onAlleleChange: PropTypes.func.isRequired,
  editable: PropTypes.bool,
  onChromosomeSelected: PropTypes.func
};

export default GenomeView;
