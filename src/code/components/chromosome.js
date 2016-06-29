import React, {PropTypes} from 'react';
import ChromosomeImageView from './chromosome-image';
import GeneLabelView from './gene-label';
import AlleleView from './allele';
import GeneticsUtils from '../utilities/genetics-utils';

const ChromosomeView = ({org, chromosomeName, side, hiddenAlleles=[], editable=true, onAlleleChange, onChromosomeSelected, showLabels=true, showAlleles=false, labelsOnRight=true, draggable=false}) => {
  let alleles = org.getGenotype().chromosomes[chromosomeName][side].alleles,
      visibleAlleles = GeneticsUtils.filterAlleles(alleles, hiddenAlleles, org.species),
      containerClass = "items",
      labelsContainer = null,
      allelesContainer = null;

  if (showLabels) {
    let labels = visibleAlleles.map(a => {
      return (
        <GeneLabelView key={a} species={org.species} allele={a} editable={editable} draggable={draggable}
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

  const handleSelect = function() {
    if (onChromosomeSelected) {
      onChromosomeSelected(org, org.getGenotype().chromosomes[chromosomeName]);
    }
  };

  return (
    <div className="geniblocks chromosome-container" onClick={ handleSelect } >
      <div className={ containerClass }>
        <div className="chromosome-allele-container">
          <ChromosomeImageView />
          { allelesContainer }
        </div>
        { labelsContainer }
      </div>
    </div>
  );
};

ChromosomeView.propTypes = {
  org: PropTypes.object.isRequired,
  chromosomeName: PropTypes.string.isRequired,
  side: PropTypes.string.isRequired,
  hiddenAlleles: PropTypes.array,
  editable: PropTypes.bool,
  showLabels: PropTypes.bool,
  showAlleles: PropTypes.bool,
  labelsOnRight: PropTypes.bool,
  draggable: PropTypes.bool,
  onAlleleChange: PropTypes.func,
  onChromosomeSelected: PropTypes.func
};

export default ChromosomeView;
