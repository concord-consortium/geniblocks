import React, {PropTypes} from 'react';
import ChromosomeView from './chromosome';

/**
 * View of the set of chromosomes of an organism, ordered as matched pairs.
 *
 * Usually defined by passing in a Biologica Organism, but may also be defined by
 * passing in a map of Biologica Chromosomes and a Biologica Species.
 */
const GenomeView = ({org, className="", chromosomeImageClass, chromosomes, species, userChangeableGenes=[], visibleGenes=[], hiddenAlleles=[], editable=true, showLabels=true, showAlleles=false, selectedChromosomes={}, small=false, orgName, displayStyle, onAlleleChange, onChromosomeSelected}) => {
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
          chromosomeImageClass={chromosomeImageClass}
          chromosome={chromosome}
          key={pairs.length + 1}
          userChangeableGenes={userChangeableGenes}
          visibleGenes={visibleGenes}
          hiddenAlleles={hiddenAlleles}
          labelsOnRight={pairs.length>0 || side==="b"}
          editable={editable}
          selected={selectedChromosomes[chromosomeName] === side}
          showLabels={showLabels}
          showAlleles={showAlleles}
          small={small}
          orgName={orgName}
          displayStyle={displayStyle}
          onAlleleChange={function(prevAllele, newAllele) {
            onAlleleChange(chromosomeName, side, prevAllele, newAllele);
          }}
          onChromosomeSelected={function(el){
            if (onChromosomeSelected)
              onChromosomeSelected(org, chromosomeName, side, el);
          }}/>
      );
    }
    pairWrappers.push(
      <div className="geniblocks chromosome-pair" key={pairWrappers.length + 1}>
        { pairs }
      </div>
    );
  }
  const classes = "geniblocks genome" + (className ? " " + className : "");
  return (
    <div className={classes}>
      { pairWrappers }
    </div>
  );
};

GenomeView.propTypes = {
  org: PropTypes.object,
  className: PropTypes.string,
  chromosomeImageClass: PropTypes.string,
  chromosomes: PropTypes.object,
  species: PropTypes.object,
  userChangeableGenes: PropTypes.array,
  visibleGenes: PropTypes.array,
  hiddenAlleles: PropTypes.array,
  onAlleleChange: PropTypes.func,
  editable: PropTypes.bool,
  showLabels: PropTypes.bool,
  showAlleles: PropTypes.bool,
  selectedChromosomes: PropTypes.object,
  small: PropTypes.bool,
  displayStyle: PropTypes.object,
  onChromosomeSelected: PropTypes.func,
  orgName: PropTypes.string
};

export default GenomeView;
