import React, {PropTypes} from 'react';
import CircularGlowView from './circular-glow';
import OrganismView from './organism';

/**
 * Represents a BioLogica organism as an image on top of a circular gradient "glow" background.
 * Implemented as a React stateless functional component.
 *
 * @param {BioLogica.Organism} org - the organism to be represented
 * @param {string} color - the color of the circular gradient "glow" background view.
 * @param {number} size
 */
const OrganismGlowView = ({id, className, color, size, style={}, ...other}) => {
  const containerStyle = {position: 'relative', width: size, height: size},
        glowStyle = { position: 'absolute' },
        orgStyle = { position: 'absolute', ...style };

  return (
    <div id={id} className={`geniblocks organism-glow ${className}`} style={containerStyle}>
      <CircularGlowView id={`${id}-glow`} color={color} size={size} style={glowStyle}/>
      <OrganismView id={`${id}-organism`} width={size} style={orgStyle} {...other} />
    </div>
  );
};

OrganismGlowView.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  style: PropTypes.object
};

export default OrganismGlowView;
