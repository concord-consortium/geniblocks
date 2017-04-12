import React, {PropTypes} from 'react';
import ChromosomeImageView from './chromosome-image';
import GeneLabelView from './gene-label';
import AlleleView from './allele';
import GeneticsUtils from '../utilities/genetics-utils';
import {getChromosomeName} from '../fv-components/fv-chromosome-image';
/**
 * View of a single chromosome, with optional labels, pulldowns, and embedded alleles.
 *
 * Defined EITHER using a Biologica Chromosome object, OR with a Biologica organism,
 * chromosome name and side.
 */

const ChromosomeView = ({chromosome, org, ChromosomeImageClass=ChromosomeImageView, chromosomeName, side, userChangeableGenes = [], visibleGenes = [], hiddenAlleles = [], small = false, editable = true, selected = false, onAlleleChange, onChromosomeSelected, showLabels = true, showAlleles = false, labelsOnRight = true, orgName, displayStyle = {}}) => {

  var containerClass = "items",
      empty = false,
      labelsContainer, allelesContainer;

  if (org && chromosomeName && side) {
    chromosome = org.getGenotype().chromosomes[chromosomeName][side];
  }

  let chromId = null;
  if (orgName && chromosome) {
    chromId = orgName + getChromosomeName(chromosome);
  }

  if (chromosome) {
    let alleles = chromosome.alleles,
        visibleAlleles = GeneticsUtils.filterVisibleAlleles(alleles, userChangeableGenes, visibleGenes, chromosome.species);

    if (showLabels) {
      let labels = visibleAlleles.map(a => {
        if (ChromosomeImageClass === ChromosomeImageView) {
          return (
          <GeneLabelView key={a.allele} species={chromosome.species} allele={a.allele} editable={editable && a.editable}
          hiddenAlleles={ hiddenAlleles }
          onAlleleChange={function(event) {
            onAlleleChange(a.allele, event.target.value);
          }}/>);
        } else {
          return (
            <div className="geniblocks fv-gene-label allele noneditable" key={a.allele}>
              {chromosome.species.alleleLabelMap[a.allele]}
            </div>
          );
        }
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
          <AlleleView key={a.allele} allele={a.allele} />
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
  const handleSelect = function(evt) {
    if (onChromosomeSelected) {
      onChromosomeSelected(evt.currentTarget);
    }
  };

  return (
    <div className="geniblocks chromosome-container" onClick={ handleSelect } >
      <div className={ containerClass }>
        <div className="chromosome-allele-container" id={chromId} style={displayStyle}>
          <ChromosomeImageClass small={small} empty={empty} bold={selected} chromosomeName={getChromosomeName(chromosome)}/>
          { allelesContainer }
        </div>
        { labelsContainer }
      </div>
    </div>
  );
};

ChromosomeView.propTypes = {
  ChromosomeImageClass: PropTypes.func,
  org: PropTypes.object,
  chromosomeName: PropTypes.string,
  side: PropTypes.string,
  chromosome: PropTypes.object,
  userChangeableGenes: PropTypes.array,
  visibleGenes: PropTypes.array,
  hiddenAlleles: PropTypes.array,
  small: PropTypes.bool,
  editable: PropTypes.bool,
  selected: PropTypes.bool,
  showLabels: PropTypes.bool,
  showAlleles: PropTypes.bool,
  labelsOnRight: PropTypes.bool,
  displayStyle: PropTypes.object,
  onAlleleChange: PropTypes.func,
  onChromosomeSelected: PropTypes.func,
  orgName: PropTypes.string
};

export default ChromosomeView;
