import {PropTypes} from 'react';

const AlleleView = ({allele, width=21, target, color, shape, hovering}) => {
  let radius = width/2,
      stroke = target ? "#000000" : "none",
      fill = allele ? color : "white",
      strokeWidth = hovering ? 3 : 1,
      strokeDasharray= allele ? "0" : "1",
      svgShape = null;

  if (shape === "circle") {
    svgShape = <circle r={radius} cy={radius+1} cx={radius+1} strokeWidth={strokeWidth} stroke={stroke} strokeDasharray={strokeDasharray} fill={fill}/>;
  } else {
    svgShape = <rect width={(radius*2)} height={(radius*2)} x="1" y="1" strokeWidth={strokeWidth} stroke={stroke} strokeDasharray={strokeDasharray} fill={fill}/>;
  }


  return (
    <svg width={width+2} height={width+2} xmlns="http://www.w3.org/2000/svg">
      <g>
        { svgShape }
        <text x={radius+1} y={radius+7} textAnchor="middle" fill="white">{allele}</text>
      </g>
    </svg>
  );
};

AlleleView.propTypes = {
  allele: PropTypes.string,
  width: PropTypes.number,
  target: PropTypes.bool,
  color: PropTypes.string,
  shape: PropTypes.string,
  hovering: PropTypes.bool
};

export default AlleleView;
