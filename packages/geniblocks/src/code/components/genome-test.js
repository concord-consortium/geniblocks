import React, {PropTypes} from 'react';
import ChromosomeImageView from './chromosome-image';
import GeneticsUtils from '../utilities/genetics-utils';

let TestPulldownView = ({species, gene, selection, onSelectionChange}) => {
      let alleles = gene.alleles,
          alleleNames = alleles.map(a => species.alleleLabelMap[a]),
          numAlleles = alleleNames.length,
          possibleCombos = [],
          currentSelection = selection || "placeholder",
          i, j;

      possibleCombos.push(<option key="placeholder" value="placeholder" disabled="disabled">Select a Genotype</option>);

      for (i = 0; i < numAlleles; i++) {
        for (j = i; j < numAlleles; j++) {
          let key = i + " " + j,
              string = alleleNames[i] + " / " + alleleNames[j];
          possibleCombos.push(<option key={key} value={key}>{string}</option>);
        }
      }

      return (
        <div className="select-wrapper">
          <select value={ currentSelection } onChange={ onSelectionChange }>
            { possibleCombos }
          </select>
        </div>
      );
    };

const GenomeTestView = ({org, hiddenAlleles=[], selection={}, onSelectionChange}) => {
  let pairWrappers = [];
  for (let chromosomeName of org.species.chromosomeNames) {
    let chrom = org.genetics.genotype.chromosomes[chromosomeName],
        alleles = chrom[Object.keys(chrom)[0]].alleles,
        visibleAlleles = GeneticsUtils.filterAlleles(alleles, hiddenAlleles, org.species),
        genes = visibleAlleles.map(a => BioLogica.Genetics.getGeneOfAllele(org.species, a)),
        pulldowns = genes.map(g => {
          return (
            <TestPulldownView
              key       = { g.name }
              species   = { org.species }
              gene      = { g }
              selection = { selection[g.name] }
              onSelectionChange = { function(event) {
                onSelectionChange(g, event.target.value);
              } }
            />
          );
        });

    pairWrappers.push(
      <div className="items" key={chromosomeName}>
        <ChromosomeImageView />
        <ChromosomeImageView />
        <div className="genome-test-options">
          { pulldowns }
        </div>
      </div>
    );
  }
  return (
    <div className="geniblocks genome-test">
      { pairWrappers }
    </div>
  );
};

TestPulldownView.propTypes = {
  species: PropTypes.object.isRequired,
  gene: PropTypes.object.isRequired,
  selection: PropTypes.string,
  onSelectionChange: PropTypes.func.isRequired
};

GenomeTestView.propTypes = {
  org: PropTypes.object.isRequired,
  hiddenAlleles: PropTypes.array,
  selection: PropTypes.object,
  onSelectionChange: PropTypes.func.isRequired
};

export default GenomeTestView;
