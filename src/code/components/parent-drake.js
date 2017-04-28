import React, {PropTypes} from 'react';
import OrganismView from './organism';

const ParentDrakeView = ({org}) => {
  let sexName = org.sex ? "FEMALE" : "MALE",
      drakeView = <OrganismView org={org} flipped={org.sex}/>,
      textView = <div className={"parentTitle"}> {sexName} </div>;

  return (
    <div className={"geniblocks parentDrake " + sexName.toLowerCase()}>
        {org.sex ? textView : drakeView}
        {org.sex ? drakeView : textView}
    </div>
  );
};

ParentDrakeView.propTypes = {
  org: PropTypes.object.isRequired
};

export default ParentDrakeView;
