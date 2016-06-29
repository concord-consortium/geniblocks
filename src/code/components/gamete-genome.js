import React, {PropTypes} from 'react';
import ChromosomeView from './chromosome';

const GameteGenomeView = ({chromosomes = [], hiddenAlleles = []}) => {
  let chromosomeViews = [];
  for (let chromosome of chromosomes) {
    var org = null;
    if (chromosome.orgAlleles) {
      org = new BioLogica.Organism(BioLogica.Species.Drake, chromosome.orgAlleles, chromosome.orgSex);
    }
    chromosomeViews.push(
      <ChromosomeView
        org={org}
        key={chromosomeViews.length + 1}
        chromosomeName={chromosome.name}
        side={chromosome.side}
        hiddenAlleles={hiddenAlleles}
        editable={false}
        showLabels={false}
        showAlleles={true}
      />
    );
  }
  return (
    <div className="geniblocks gamete-genome">
      { chromosomeViews }
    </div>
  );
};

GameteGenomeView.propTypes = {
  chromosomes: PropTypes.array,
  hiddenAlleles: PropTypes.array
};

export default GameteGenomeView;
