import {PropTypes} from 'react';

const AlleleFiltersView = ({species, hiddenAlleles=[], disabledAlleles = [], onFilterChange}) => {
  let hiddenGenes = new Set,
      geneInputs = [];

  for (const allele of hiddenAlleles) {
    const gene = BioLogica.Genetics.getGeneOfAllele(species, allele);
    if (gene)
      hiddenGenes.add(gene.name);
  }

  for (const gene in species.geneList) {
    if (!hiddenGenes.has(gene)) {
      const alleles = species.geneList[gene].alleles,
            alleleItems = alleles.map(allele => {
              const name = species.alleleLabelMap[allele],
                    checked = !(disabledAlleles.indexOf(allele) >= 0);
              return (
                <label key={name}>
                  <input type="checkbox" key={name} value={allele}
                          style={{ "marginLeft": "8px" }}
                          defaultChecked={checked} onChange={handleChange}/>
                  {name}
                </label>
              );
            });
      geneInputs.push(
        <div className="gene-allele-list" key={gene}>{alleleItems}</div>
      );
    }
  }
 
  function handleChange(evt) {
    const elt = evt.target,
          allele = elt && elt.value,
          isChecked = elt && elt.checked;
    if (onFilterChange && allele)
      onFilterChange(evt, allele, isChecked);
  }

  return (
    <div className="geniblocks allele-filters"
          style={{ "marginTop": "5px", "marginBottom": "5px" }}>
      { geneInputs }
    </div>
  );
};

AlleleFiltersView.propTypes = {
  species: PropTypes.object.isRequired,
  hiddenAlleles: PropTypes.arrayOf(PropTypes.string),
  disabledAlleles: PropTypes.arrayOf(PropTypes.string),
  onFilterChange: PropTypes.func.isRequired
};

export default AlleleFiltersView;
