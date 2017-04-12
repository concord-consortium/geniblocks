import React, {PropTypes} from 'react';
import classNames from 'classnames';

/**
 * Returns a descriptive, but not necessarily unique, name of a given chromosome. Returns
 * null if no chromosome is given.
 * @param {object} chromosome - The chromosome which the returned name will describe
 */
export function getChromosomeName(chromosome) {
  return chromosome ? chromosome.chromosome + chromosome.side : null;
}

const FVChromosomeImageView = ({small=false, bold=false, empty=false, chromosomeName, animationStyling}) => {
  function chromosomeNameToClass(chromosomeName) {
    if (!chromosomeName) {
      return null;
    } else if (chromosomeName.endsWith('XYy')) {
      return 'chromosome-y';
    } else if (chromosomeName.indexOf('x') > -1) {
      return 'chromosome-x';
    } else if (chromosomeName.indexOf('1') > -1) {
      return 'chromosome-1';
    } else if (chromosomeName.indexOf('2') > -1) {
      return 'chromosome-2';
    }
    // Default case, no name for empty chromosomes
    return null;
  }

  let positionStyling = {};
  if (animationStyling){
    positionStyling = {
      position: 'fixed', left: animationStyling.x, top: animationStyling.y, opacity: animationStyling.opacity
    };
  }
  return (
    <div className={classNames('fv-chromosome-image', chromosomeNameToClass(chromosomeName), { 'empty': empty, 'bold': bold,'small': small})} style={positionStyling}>
    </div>
  );
};

FVChromosomeImageView.propTypes = {
  chromosomeName: PropTypes.string,
  small: PropTypes.bool,
  bold: PropTypes.bool,
  empty: PropTypes.bool,
  animationStyling: PropTypes.shape({
                      x: PropTypes.number,
                      y: PropTypes.number,
                      opacity: PropTypes.number
                    })
};

export default FVChromosomeImageView;
