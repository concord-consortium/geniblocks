import {PropTypes} from 'react';
import ChromosomeView from './chromosome';

const GenomeView = ({org, hiddenAlleles = [], editable=true, onAlleleChange}) => {
  let pairWrappers = [];
  for (let chromosomeName of org.species.chromosomeNames) {
    let chrom = org.genetics.genotype.chromosomes[chromosomeName],
        pairs = [];
    for (let side in chrom) {
      pairs.push(
        <ChromosomeView
          org={org}
          key={pairs.length + 1}
          chromosomeName={chromosomeName}
          side={side}
          hiddenAlleles={hiddenAlleles}
          labelsOnRight={pairs.length>0}
          editable={editable}
          onAlleleChange={function(prevAllele, newAllele) {
            onAlleleChange(chromosomeName, side, prevAllele, newAllele);
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
  org: PropTypes.object.isRequired,
  hiddenAlleles: PropTypes.array,
  onAlleleChange: PropTypes.func,
  editable: PropTypes.bool
};

export default GenomeView;
