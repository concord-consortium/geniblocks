import {PropTypes} from 'react';

/**
 * Stateless functional React component for displaying a Biologica gamete
 *
 * @param {Object} gamete - Biologica gamete (map of chromosome names to chromosomes)
 * @param {number} id - the unique id of this gamete
 * @param {string[]} hiddenAlleles - individual alleles of genes for which all alleles should be hidden
 * @param {Object} display - display parameters used to represent the gamete
 * @param {number} display.x - location (left) of the gamete
 * @param {number} display.y - location (top) of the gamete
 * @param {number} [display.size=30] - size (width & height) of the gamete
 * @param {number} [display.rotation=0] - rotation of the gamete
 * @param {number} [display.opacity=1] - opacity of the gamete
 * @param {boolean} [isSelected=false] - whether the gamete should have the 'selected' class applied
 * @param {boolean} [isDisabled=false] - whether the gamete should have the 'disabled' class applied
 * @param {function} [onClick(evt, id, rect)] - callback function to be called when the gamete is clicked
 *
 * Note: As things stand currently, there is _no_ particular representation of the gamete defined
 * by this view. The client can style the representation of the gamete by styling the
 * '.geniblocks.gamete' class in CSS, e.g. by assigning a background-image.
 */
const GameteView = ({gamete, id, hiddenAlleles=[], display, isSelected=false, isDisabled=false, onClick}) => {

  function handleClick(evt) {
    const elt = evt.target,
          rect = elt.getBoundingClientRect();
    if (!isDisabled && onClick) {
      onClick(evt, id, rect);
    }
  }

  function buildTooltipForGamete(gamete) {
    let tooltip = "",
        allHiddenAlleles;
    // Note: it would be more efficient for the caller to pass in the
    // allHiddenAlleles array rather than computing it each time here.
    // But if we moved it out right now we'd have to eliminate the ES6 splat.
    function concatHiddenAlleles(iSpecies, iHiddenAlleles) {
      allHiddenAlleles = [];
      for (const allele of iHiddenAlleles) {
        const gene = BioLogica.Genetics.getGeneOfAllele(iSpecies, allele);
        allHiddenAlleles.push(...gene.alleles);
      }
    }
    for (const ch in gamete) {
      var chromosome = gamete[ch];
      if (allHiddenAlleles == null)
        concatHiddenAlleles(chromosome.species, hiddenAlleles);
      for (const allele of chromosome.alleles) {
        if (allHiddenAlleles.indexOf(allele) < 0) {
          const label = chromosome.species.alleleLabelMap[allele];
          tooltip += (tooltip ? '\n' : '') + ch + ': ' + label;
        }
      }
      if (ch === 'XY') {
        const value = chromosome.side === 'y' ? 'y' : 'x';
        tooltip += (tooltip ? '\n' : '') + ch + ': ' + value;
      }
    }
    return tooltip;
  }

  const selectedClass = isSelected && !isDisabled ? "selected" : "",
        disabledClass = isDisabled ? "disabled" : "",
        group = id % 4,
        rotationForGroup = group * 90,
        classes = `geniblocks gamete ${selectedClass} ${disabledClass} group${group}`,
        size = display.size || 30,
        rotation = display.rotation != null ? display.rotation : rotationForGroup,
        transform = rotation ? `rotate(${rotation}deg)` : '',
        opacity = display.opacity != null ? display.opacity : 1.0,
        tooltip = buildTooltipForGamete(gamete);
  return (
    <div className={classes} title={tooltip}
          style={{
            left: display.x, top: display.y,
            width: size, height: size,
            transform, opacity
          }}
          onClick={handleClick}>
    </div>
  );
};

GameteView.propTypes = {
  gamete: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  hiddenAlleles: PropTypes.arrayOf(PropTypes.string),
  display: PropTypes.shape({        // display properties
    x: PropTypes.number.isRequired, // location (left) of gamete image
    y: PropTypes.number.isRequired, // location (top) of gamete image
    size: PropTypes.number,         // size of gamete image (default: 30)
    rotation: PropTypes.number,     // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: PropTypes.number       // opacity of gamete image (default: 1.0)
  }).isRequired,
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func
};

export default GameteView;
