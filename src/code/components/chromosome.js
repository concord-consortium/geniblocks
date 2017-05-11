import React, {PropTypes} from 'react';
import ChromosomeImageView from './chromosome-image';
import GeneLabelView from './gene-label';
import FVGeneLabelView from '../fv-components/fv-gene-label';
import GeneticsUtils from '../utilities/genetics-utils';
import {getChromosomeDescriptor} from '../fv-components/fv-chromosome-image';

/**
 * View of a single chromosome, with optional labels and pulldowns.
 *
 * @param {Object} chromosome - the chromosome to be represented. If null, the chromosome will be empty
 * @param {Object} chromosomeDescriptor - if no chromosome is provided, a descriptor can be passed to create an empty, unlabeled chromosome
 * @param {Object} ChromosomeImageClass - the class to use for representing the actual chromosome, as opposed to its labels
 * @param {string[]} userChangeableGenes - the genes that can be changed using a drop down menu by the user
 * @param {string[]} visibleGenes - genes which can be viewed by the user, but not changed
 * @param {string[]} hiddenAlleles - individual alleles within a gene which cannot be viewed by the user
 * @param {boolean} small - determines whether a gamete chromosome is represented, or a full-sized chromosome in a genome
 * @param {boolean} editable - true if genes in the chromosome can be changed by a drop-down
 * @param {boolean} selected - true if the chromosome has been selected by the user
 * @param {function} onAlleleChange - this callback is invoked if the user changes an allele using a dropdown 
 * @param {function} onChromosomeSelected - this callback is invoked if the user selects this chromosome
 * @param {boolean} showLabels - false if the labels on a non-empty chromosome should be hidden
 * @param {boolean} labelsOnRight - true if the labels should be on the right of the chromosome; otherwise, they are placed on the left
 * @param {string} orgName - the unique name of the organism which the chromosome is a part of (e.g. "targetMother")
 * @param {number} height - the height in pixels of the rendered chromosome
 * @param {object} displayStyle - this style will be applied to the actual chromosome, as opposed to its labels
 */
const ChromosomeView = ({chromosome, chromosomeDescriptor, ChromosomeImageClass=ChromosomeImageView, userChangeableGenes = [], visibleGenes = [], hiddenAlleles = [], small = false, editable = true, selected = false, onAlleleChange, onChromosomeSelected, showLabels = true, labelsOnRight = true, orgName, height, displayStyle = {}}) => {
  chromosomeDescriptor = chromosomeDescriptor || getChromosomeDescriptor(chromosome);

  var containerClass = "items",
      empty = false,
      labels;

  if (!labelsOnRight) {
    containerClass += " rtl";
  } else {
    containerClass += " ltl";
  }

  let chromId = null;
  if (orgName && chromosomeDescriptor.name && chromosomeDescriptor.side) {
    chromId = orgName + "-" + chromosomeDescriptor.name + "-" + chromosomeDescriptor.side;
  }

  if (chromosome) {
    let alleles = chromosome.alleles,
        visibleAlleles = GeneticsUtils.filterVisibleAlleles(alleles, userChangeableGenes, visibleGenes, chromosome.species);

    if (showLabels) {
      labels = visibleAlleles.map(a => {
        if (ChromosomeImageClass === ChromosomeImageView) {
          return (
            <GeneLabelView key={a.allele} species={chromosome.species} allele={a.allele} editable={editable && a.editable}
            hiddenAlleles={ hiddenAlleles }
            onAlleleChange={function(event) {
              onAlleleChange(a.allele, event.value);
            }}/>
          );
        } else {
          return (
            <FVGeneLabelView editable={editable && a.editable} chromosomeDescriptor={chromosomeDescriptor} 
                             chromosomeHeight={height} allele={a.allele} species={chromosome.species} hiddenAlleles={ hiddenAlleles }
                             onAlleleChange={function(event) {
                               onAlleleChange(a.allele, event.value);
                             }
            }/>
          );
        }
      });
    }
  } else {
    empty = true;
  }
  const handleSelect = function(evt) {
    if (onChromosomeSelected) {
      onChromosomeSelected(evt.currentTarget);
    }
  };

  let labelStyle = {};
  if (displayStyle.display === "none") {
    labelStyle = {display: "none"};
  }

  return (
    <div className="geniblocks chromosome-container" onClick={ handleSelect } >
      <div className={ containerClass }>
        <div className="chromosome-allele-container" id={chromId} style={displayStyle}>
          <ChromosomeImageClass small={small} empty={empty} bold={selected} chromosomeDescriptor={chromosomeDescriptor}/>
        </div>
        <div className="labels" style={labelStyle}>
          { labels }
        </div>
      </div>
    </div>
  );
};

ChromosomeView.propTypes = {
  ChromosomeImageClass: PropTypes.func,
  chromosome: PropTypes.object,
  chromosomeDescriptor: PropTypes.shape({
    name: PropTypes.string,
    side: PropTypes.string
  }),
  userChangeableGenes: PropTypes.array,
  visibleGenes: PropTypes.array,
  hiddenAlleles: PropTypes.array,
  small: PropTypes.bool,
  editable: PropTypes.bool,
  selected: PropTypes.bool,
  showLabels: PropTypes.bool,
  labelsOnRight: PropTypes.bool,
  displayStyle: PropTypes.object,
  onAlleleChange: PropTypes.func,
  onChromosomeSelected: PropTypes.func,
  orgName: PropTypes.string,
  height: PropTypes.number
};

export default ChromosomeView;
