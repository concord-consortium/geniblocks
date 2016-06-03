import {PropTypes} from 'react';

/**
 * Uses an SVG circular gradient to implement a fading glow background.
 * Implemented as a stateless functional React component.
 *
 * @param {string} color - the color of the circular gradient "glow"
 * @param {number} size - the diameter of the circular gradient
 * @param {object} style - styles applied to the outer div
 */
const CircularGlowView = ({id, color, size, style}) => {
  let radius = size/2,
      colorNoHash = color.replace('#', ''),
      gradientID = `CircularGlowView_${id || colorNoHash}`,
      gradientIDUrl = `url(#${gradientID})`;

  return (
    <div className="geniblocks circular-glow" style={style}>
      <svg width={size+2} height={size+2} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={gradientID}>
            <stop offset="0%" stopColor={color} stopOpacity="1.0"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.0"/>
          </radialGradient>
        </defs>
        <circle fill={gradientIDUrl} cx={radius} cy={radius} r={radius} />
      </svg>
    </div>
  );
};

CircularGlowView.propTypes = {
  id: PropTypes.string,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  style: PropTypes.object
};

export default CircularGlowView;
