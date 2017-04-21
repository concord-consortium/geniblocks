import React, {PropTypes} from 'react';

const FVGeneLabelView = ({allele, species}) => {
    return (
      <div className={"geniblocks fv-gene-label allele noneditable " + allele.toLowerCase()} key={allele}>
        <div className="line"></div>
        {species.alleleLabelMap[allele]}
      </div>
    );
};

FVGeneLabelView.propTypes = {
  species: PropTypes.object.isRequired,
  allele: PropTypes.string.isRequired
};

export default FVGeneLabelView;
