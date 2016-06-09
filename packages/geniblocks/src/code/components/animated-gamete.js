import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';
import GameteView from './gamete';

/**
 * Stateless functional React component for displaying a Biologica gamete that animates
 *
 * @param {Object} gamete - Biologica gamete (map of chromosome names to chromosomes)
 * @param {number} id - the unique id of this gamete
 * @param {string[]} hiddenAlleles - individual alleles of genes for which all alleles should be hidden
 * @param {Object} [initialDisplay] - initial display parameters used to represent the gamete
 * @param {number} [initialDisplay.x] - initial location (left) of the gamete
 * @param {number} [initialDisplay.y] - initial location (top) of the gamete
 * @param {number} [initialDisplay.size=30] - initial size (width & height) of the gamete
 * @param {number} [initialDisplay.rotation=0] - initial rotation of the gamete
 * @param {number} [initialDisplay.opacity=1] - initial opacity of the gamete
 * @param {Object} display - final display parameters used to represent the gamete
 * @param {number} display.x - final location (left) of the gamete
 * @param {number} display.y - final location (top) of the gamete
 * @param {number} [display.size=30] - final size (width & height) of the gamete
 * @param {number} [display.rotation=0] - final rotation of the gamete
 * @param {number} [display.opacity=1] - final opacity of the gamete
 * @param {number} [animStiffness=100] - spring stiffness used to control animation speed
 * @param {boolean} [isSelected=false] - whether the gamete should have the 'selected' class applied
 * @param {boolean} [isDisabled=false] - whether the gamete should have the 'disabled' class applied
 * @param {function} [onClick(evt, id, rect)] - callback function to be called when the gamete is clicked
 * @param {function} [onRect()] - callback function to be called when the animation is at rest
 *
 * Note: As things stand currently, there is _no_ particular representation of the gamete defined
 * by this view. The client can style the representation of the gamete by styling the
 * '.geniblocks.gamete' class in CSS, e.g. by assigning a background-image.
 */
const AnimatedGameteView = ({id, initialDisplay, display, animStiffness=100, onRest, ...others}) => {

  const group = id % 4,
        rotationForGroup = group * 90,
        initial = initialDisplay || display,
        initialSize = initial.size || 30,
        initialRotation = initial.rotation != null ? initial.rotation : rotationForGroup,
        initialOpacity = initial.opacity != null ? initial.opacity : 1.0,
        finalSize = display.size || 30,
        finalRotation = display.rotation != null ? display.rotation : rotationForGroup,
        finalOpacity = display.opacity != null ? display.opacity : 1.0,
        springConfig = { stiffness: animStiffness };
  return (
    <Motion className='geniblocks animated-gamete'
          defaultStyle={{
            x: initial.x, y: initial.y, size: initialSize,
            rotation: initialRotation, opacity: initialOpacity
          }}
          style={{
            x: spring(display.x, springConfig),
            y: spring(display.y, springConfig),
            size: spring(finalSize, springConfig),
            rotation: spring(finalRotation, springConfig),
            opacity: spring(finalOpacity, springConfig)
          }}
          onRest={onRest} >
      {
        interpolatedStyle =>
          <GameteView id={id} display={interpolatedStyle} {...others} />
      }
    </Motion>
  );
};

AnimatedGameteView.propTypes = {
  gamete: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  hiddenAlleles: PropTypes.arrayOf(PropTypes.string),
  initialDisplay: PropTypes.shape({ // initial display properties
    x: PropTypes.number.isRequired, // location (left) of gamete image
    y: PropTypes.number.isRequired, // location (top) of gamete image
    size: PropTypes.number,         // size of gamete image (default: 30)
    rotation: PropTypes.number,     // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: PropTypes.number       // opacity of gamete image (default: 1.0)
  }),
  display: PropTypes.shape({        // final display properties
    x: PropTypes.number.isRequired, // location (left) of gamete image
    y: PropTypes.number.isRequired, // location (top) of gamete image
    size: PropTypes.number,         // size of gamete image (default: 30)
    rotation: PropTypes.number,     // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: PropTypes.number       // opacity of gamete image (default: 1.0)
  }).isRequired,
  animStiffness: PropTypes.number,  // stiffness of spring for animation (default: 100)
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  onRest: PropTypes.func
};

export default AnimatedGameteView;
