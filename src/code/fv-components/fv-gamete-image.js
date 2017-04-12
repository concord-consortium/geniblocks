import React, {PropTypes} from 'react';

import FVChromosomeImageView, {getChromosomeName} from './fv-chromosome-image';

const FVGameteImageView = ({chromosomes=[], id, className, style, displayStyle}) => {

  const isOvum = className.indexOf('ovum') >= 0,
        // defaultImageWidth = 150,
        // defaultImageHeight = 90,
        scale = displayStyle && (displayStyle.size != null) ? displayStyle.size : 1.0;
        // imageWidth = defaultImageWidth * scale,
        // imageHeight = defaultImageHeight * scale;

  const containerStyle = {
    position: "relative",
    // width: imageWidth + "px",
    // height: imageHeight + "px"
  };

  if (displayStyle != null){
    containerStyle.display = displayStyle.display;
  }

  let chromosomeImages = [];

  for(var i = 0; i < chromosomes.length; i++){
    let chromosome = chromosomes[i],
        chromosomeName = getChromosomeName(chromosome);
    chromosomeImages.push(
      <FVChromosomeImageView
        key={i}
        empty={!chromosome}
        chromosomeName={chromosomeName}
      />
    );
  }

  let chromosomeStyle = {
    position: "absolute",
    top:  55 * scale,
    left: (isOvum ? 50 : 40) * scale + 15,
    display: "flex"
  };

  return (
    <div id={id} className={className} style={style}>
      <div className="gamete-container" style={containerStyle}>
        <div className="gamete-chromosomes" style={chromosomeStyle}>
          { chromosomeImages }
        </div>
      </div>
    </div>
  );
};

FVGameteImageView.propTypes = {
  isEgg: PropTypes.bool.isRequired,
  chromosomes: PropTypes.array,
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  displayStyle: PropTypes.shape({
    display: PropTypes.string,
    size: PropTypes.number,
    fillColor: PropTypes.string
  }),
  onClick: PropTypes.func
};

export default FVGameteImageView;
