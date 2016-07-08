import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';
import ChromosomeImageView from './chromosome-image';
import AlleleView from './allele';
import GeneticsUtils from '../utilities/genetics-utils';

const AnimatedChromosomeView = ({org, chromosomeName, side, hiddenAlleles=[], style={}, onRest, selected, small, startPositionId, targetPositionId }) => {
  if (!selected) return(null);
  let allelesContainer = {}, empty= false;
  if (org && chromosomeName && side) {  

    let alleles = org.getGenotype().chromosomes[chromosomeName][side].alleles,
        visibleAlleles = GeneticsUtils.filterAlleles(alleles, hiddenAlleles, org.species);
    let alleleSymbols = visibleAlleles.map(a => {
      return (
        <AlleleView key={a} allele={a} />
      );
    });

    allelesContainer = (
      <div className="alleles">
        { alleleSymbols }
      </div>
    );
  } else {
    empty = true;
  }
  
  let sourceRects = {}, targetRects = {};
  
  let source = document.getElementById(startPositionId);
  if (!source) source = document.getElementById("target" + targetPositionId + chromosomeName);
  
  if (source){
    sourceRects = source.getClientRects()[0];
  } else {
    console.log("no rects!", source, startPositionId);
    return (null);
  }

  let target = document.getElementById("target" + targetPositionId);
  if (!target) target = document.getElementById("target" + targetPositionId + chromosomeName);
  
  if (target){
    targetRects = target.getClientRects()[0];
  } else {
    console.log("no rects!", target, "target" + targetPositionId);
    return (null);
  }
  
  let startStyle = {}, endStyle = {};
  startStyle.x = sourceRects.left;
  startStyle.y = sourceRects.top;
  startStyle.opacity = 1;
  
  endStyle.x = targetRects.left;
  endStyle.y = sourceRects.top; // can't yet get to the exact chromosome target
  endStyle.opacity = 0;


  const 
    springConfig = { stiffness: 100, damping: 30 };

  const onAnimationFinished = () => {
    onRest();
  };

  return (
    <Motion className='geniblocks animated-chromosome-view'
            defaultStyle={{
            x: startStyle.x, y: startStyle.y,
            opacity: startStyle.opacity
          }}
          style={{
            x: spring(endStyle.x, springConfig),
            y: spring(endStyle.y, springConfig),
            opacity: spring(endStyle.opacity, springConfig)
          }}
          onRest={onAnimationFinished} >
      {
        interpolatedStyle => {
          return (
            <ChromosomeImageView empty={empty} small={small} className="animated-chromosome-allele-container" display={interpolatedStyle} />
          );
        }
      }
    </Motion>
  );
};

AnimatedChromosomeView.propTypes = {
  org: PropTypes.object,
  id: PropTypes.string,
  width: PropTypes.number,
  style: PropTypes.object,
  stiffness: PropTypes.number,
  onRest: PropTypes.func,
  selected: PropTypes.bool,
  chromosomeName: PropTypes.string,
  side: PropTypes.string,
  startPositionId: PropTypes.string,
  targetPositionId: PropTypes.string,
  hiddenAlleles: PropTypes.array
};

export default AnimatedChromosomeView;
