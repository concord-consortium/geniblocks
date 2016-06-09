import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';
import OrganismView from './organism';

const AnimatedOrganismView = ({org, id, width=200, style={}, initialOpacity=1.0, opacity=1.0, stiffness=60, onRest, onClick }) => {
  const opacityStart = initialOpacity !== undefined
                        ? initialOpacity
                        : (opacity !== undefined ? opacity : 1.0);
  let   opacityEnd = opacity !== undefined ? opacity : opacityStart;

  if (opacityEnd !== opacityStart)
    opacityEnd = spring(opacityEnd, { stiffness: stiffness });

  return (
    <Motion className='geniblocks animated-organism-view'
            defaultStyle={{opacity: opacityStart}} style={{opacity: opacityEnd}} onRest={onRest} >
      {
        interpolatedStyle => {
          const tStyle = { ...style, ...interpolatedStyle };
          return (
            <OrganismView org={org} id={id} width={width} style={tStyle} onClick={onClick} />
          );
        }
      }
    </Motion>
  );
};

AnimatedOrganismView.propTypes = {
  org: PropTypes.object.isRequired,
  id: PropTypes.string,
  width: PropTypes.number,
  style: PropTypes.object,
  initialOpacity: PropTypes.number,
  opacity: PropTypes.number,
  stiffness: PropTypes.number,
  onRest: PropTypes.func,
  onClick: PropTypes.func
};

export default AnimatedOrganismView;
