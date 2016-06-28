import React, {PropTypes} from 'react';
import AlleleView from './allele';

const GeneLabelView = ({species, allele, editable=false, onAlleleChange, draggable}) => {
  let alleleIcon = null;

  if (draggable){
    alleleIcon = <AlleleView allele={allele} />;
  }
  if (!editable) {
    const alleleName = species.alleleLabelMap[allele];
    return (
      <div className="geniblocks gene-label allele noneditable">
      { alleleIcon }
        <span>
          { alleleName }
        </span>
      </div>
    );
  } else {
    const alleles = BioLogica.Genetics.getGeneOfAllele(species, allele).alleles,
          alleleNames = alleles.map(a => species.alleleLabelMap[a]),
          alleleOptions = alleleNames.map((name, i) => (
                            <option key={name} value={alleles[i]}>{name}</option>)
                          );
    return (
      <div className="geniblocks gene-label allele editable">
        <select value={ allele } onChange={ onAlleleChange }>
          { alleleOptions }
        </select>
      </div>
    );
  }
};

GeneLabelView.propTypes = {
  species: PropTypes.object.isRequired,
  allele: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  onAlleleChange: PropTypes.func,
  draggable: PropTypes.bool
};

export default GeneLabelView;
