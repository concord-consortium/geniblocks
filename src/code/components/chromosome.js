import React, {PropTypes} from 'react';
import ChromosomeImageView from './chromosome-image';
import GeneLabelView from './gene-label';
import AlleleView from './allele';
import GeneticsUtils from '../utilities/genetics-utils';

/**
 * View of a single chromosome, with optional labels, pulldowns, and embedded alleles.
 *
 * Defined EITHER using a Biologica Chromosome object, OR with a Biologica organism,
 * chromosome name and side.
 */
const ChromosomeView = ({chromosome, org, chromosomeName, side, hiddenAlleles=[], small=false, editable=true, selected=false, onAlleleChange, onChromosomeSelected, showLabels=true, showAlleles=false, labelsOnRight=true}) => {
  var containerClass = "items",
      empty = false,
      labelsContainer, allelesContainer;

  if (org && chromosomeName && side) {
    chromosome = org.getGenotype().chromosomes[chromosomeName][side];
  }

  if (chromosome) {
    let alleles = chromosome.alleles,
        visibleAlleles = GeneticsUtils.filterAlleles(alleles, hiddenAlleles, chromosome.species);

    if (showLabels) {
      let labels = visibleAlleles.map(a => {
        return (
          <GeneLabelView key={a} species={chromosome.species} allele={a} editable={editable}
          onAlleleChange={function(event) {
            onAlleleChange(a, event.target.value);
          }}/>
        );
      });

      labelsContainer = (
        <div className="labels">
          { labels }
        </div>
      );

      if (!labelsOnRight) {
        containerClass += " rtl";
      }
    }

    if (showAlleles) {
      let alleleSymbols = visibleAlleles.map(a => {
        return (
          <AlleleView key={a} allele={a} />
        );
      });

      allelesContainer = (
        <div className="alleles">
          { alleleSymbols }
        </div>
      );
    }
  } else {
    empty = true;
  }

  const handleSelect = function() {
    if (onChromosomeSelected) {
      onChromosomeSelected();
    }
  };

  return (
    <div className="geniblocks chromosome-container" onClick={ handleSelect } >
      <div className={ containerClass }>
        <div className="chromosome-allele-container">
          <ChromosomeImageView small={small} empty={empty} bold={selected} />
          { allelesContainer }
        </div>
        { labelsContainer }
      </div>
    </div>
  );
};

ChromosomeView.propTypes = {
  org: PropTypes.object,
  chromosomeName: PropTypes.string,
  side: PropTypes.string,
  chromosome: PropTypes.object,
  hiddenAlleles: PropTypes.array,
  editable: PropTypes.bool,
  showLabels: PropTypes.bool,
  showAlleles: PropTypes.bool,
  labelsOnRight: PropTypes.bool,
  onAlleleChange: PropTypes.func,
  onChromosomeSelected: PropTypes.func
};

export default ChromosomeView;
