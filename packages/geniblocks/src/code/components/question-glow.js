import React, {PropTypes} from 'react';
import CircularGlowView from './circular-glow';

const QuestionGlowView = ({glowColor, size=200}) => {
  const containerStyle = {position: 'relative', width: size, height: size},
        glowStyle = {position: 'absolute'};

  return (
    <div className="geniblocks question-glow" style={containerStyle}>
      <CircularGlowView color={glowColor} size={size} style={glowStyle}/>
      <div className="geniblocks question-glow question-mark"
            style={{position: "absolute", width: size, height: size}}>
      </div>
    </div>
  );
  // HTML text node
  //<div style={tStyle}>{text}</div>

  // SVG text node
  //<svg width={size+2} height={size+2} xmlns="http://www.w3.org/2000/svg">
  //  <text x='50' y='175' fill='#0D0D8C' style={tStyle}>
  //    {text}
  //  </text>
  //</svg>
};

QuestionGlowView.propTypes = {
  glowColor: PropTypes.string.isRequired,
  size: PropTypes.number
};

export default QuestionGlowView;
