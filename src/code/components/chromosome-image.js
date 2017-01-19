import React, {PropTypes} from 'react';

const defaults = {
  normal: {
    width: 23,
    height: 120,
    split: 45
  },
  small: {
    width: 19,
    height: 90,
    split: 34
  }
};

const defaultsY = {
  normal: {
    width: 23,
    height: 75,
    split: 38
  },
  small: {
    width: 19,
    height: 62,
    split: 32
  }
};

const ChromosomeImageView = ({width, height, split=45, color='#FF9999', small=false, bold=false, empty=false, yChromosome=false, animationStyling}) => {
  if (!width || !height) {
    let defaultDims = yChromosome ? defaultsY : defaults;
    ({width, height, split} = small ? defaultDims.small : defaultDims.normal);
  }

  const radius = width/2,
        imageWidth = width+4,
        halfImageWidth = imageWidth/2,
        imageHeight = height+4;

  let strokeWidth = width < 10 ? 1 : 2;

  if (bold) {
    color = '#FF6666';
    strokeWidth = 3;
  }
  if (empty) {
    color = '#FFF';
    strokeWidth = 1;
  }
  let positionStyling = {};
  if (animationStyling){
    positionStyling = {
      position: 'fixed', left: animationStyling.x, top: animationStyling.y, opacity: animationStyling.opacity
    };
  }
  return (
    <div className="chromosome-image" style={positionStyling}>
      <svg width={imageWidth} height={imageHeight} xmlns="http://www.w3.org/2000/svg">
        <g>
          <circle r={radius} cy={radius+2} cx={halfImageWidth} strokeWidth={strokeWidth} stroke="#000000" fill={color}/>
          <circle r={radius} cy={split-radius} cx={halfImageWidth} strokeWidth={strokeWidth} stroke="#000000" fill={color}/>
          <circle r={radius} cy={split+radius} cx={halfImageWidth} strokeWidth={strokeWidth} stroke="#000000" fill={color}/>
          <circle r={radius} cy={height-radius} cx={halfImageWidth} strokeWidth={strokeWidth} stroke="#000000" fill={color}/>
          <rect height={Math.max(0, (split-radius)-(radius+2))} width={width} y={radius+2} x="2" strokeWidth="0" stroke="#000000" fill={color}/>
          <rect height={Math.max(0, (height-radius)-(split+radius))} width={width} y={split+radius} x="2" strokeWidth="0" stroke="#000000" fill={color}/>
          <line y1={radius+2}     x1="2"       y2={split-radius+2}  x2="2"       strokeLinecap="null" strokeLinejoin="null" strokeWidth={strokeWidth} stroke="#000000" fill="none"/>
          <line y1={radius+2}     x1={width+2} y2={split-radius+2}  x2={width+2} strokeLinecap="null" strokeLinejoin="null" strokeWidth={strokeWidth} stroke="#000000" fill="none"/>
          <line y1={split+radius} x1="2"       y2={height-radius}   x2="2"       strokeLinecap="null" strokeLinejoin="null" strokeWidth={strokeWidth} stroke="#000000" fill="none"/>
          <line y1={split+radius} x1={width+2} y2={height-radius}   x2={width+2} strokeLinecap="null" strokeLinejoin="null" strokeWidth={strokeWidth} stroke="#000000" fill="none"/>
        </g>
      </svg>
    </div>
  );
};

ChromosomeImageView.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  split: PropTypes.number,
  color: PropTypes.string,
  small: PropTypes.bool,
  bold: PropTypes.bool,
  empty: PropTypes.bool,
  yChromosome: PropTypes.bool,
  animationStyling: PropTypes.shape({
                      x: PropTypes.number,
                      y: PropTypes.number,
                      opacity: PropTypes.number
                    })
};

export default ChromosomeImageView;
