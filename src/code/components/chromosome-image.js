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

const ChromosomeImageView = ({width, height, split, color='#FF9999', small=false, bold=false, empty=false}) => {
  if (!width || !height || !split) {
    ({width, height, split} = small ? defaults.small : defaults.normal);
  }

  const radius = width/2,
        imageWidth = width+4,
        halfImageWidth = imageWidth/2,
        imageHeight = height+4;

  let strokeWidth = 2;

  if (bold) {
    color = '#FF6666';
    strokeWidth = 3;
  }
  if (empty) {
    color = '#FFF';
    strokeWidth = 1;
  }

  return (
    <svg width={imageWidth} height={imageHeight} xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle r={radius} cy={radius+2} cx={halfImageWidth} strokeWidth={strokeWidth} stroke="#000000" fill={color}/>
        <circle r={radius} cy={split-radius} cx={halfImageWidth} strokeWidth={strokeWidth} stroke="#000000" fill={color}/>
        <circle r={radius} cy={split+radius} cx={halfImageWidth} strokeWidth={strokeWidth} stroke="#000000" fill={color}/>
        <circle r={radius} cy={height-radius} cx={halfImageWidth} strokeWidth={strokeWidth} stroke="#000000" fill={color}/>
        <rect height={(split-radius)-(radius+2)} width={width} y={radius+2} x="2" strokeWidth="0" stroke="#000000" fill={color}/>
        <rect height={(height-radius)-(split+radius)} width={width} y={split+radius} x="2" strokeWidth="0" stroke="#000000" fill={color}/>
        <line y1={radius+2}     x1="2"       y2={split-radius+2}  x2="2"       strokeLinecap="null" strokeLinejoin="null" strokeWidth={strokeWidth} stroke="#000000" fill="none"/>
        <line y1={radius+2}     x1={width+2} y2={split-radius+2}  x2={width+2} strokeLinecap="null" strokeLinejoin="null" strokeWidth={strokeWidth} stroke="#000000" fill="none"/>
        <line y1={split+radius} x1="2"       y2={height-radius}   x2="2"       strokeLinecap="null" strokeLinejoin="null" strokeWidth={strokeWidth} stroke="#000000" fill="none"/>
        <line y1={split+radius} x1={width+2} y2={height-radius}   x2={width+2} strokeLinecap="null" strokeLinejoin="null" strokeWidth={strokeWidth} stroke="#000000" fill="none"/>
      </g>
    </svg>
  );
};

ChromosomeImageView.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  empty: PropTypes.bool
};

export default ChromosomeImageView;
