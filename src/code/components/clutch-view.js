import React, {PropTypes} from 'react';
import FVStableCounter from '../fv-components/stable-counter';
import OrganismView from './organism';
import classNames from 'classnames';

/**
 * @param {number} rows - Option number of rows. If defined, it will be fixed at that. Otherwise, it
 *                        will default to 1 when there are no orgs, and grows as more rows are needed.
 * @param {number} tightenRows - If given, will shrink the vertical height of the stable by this amount
 *                        per row, crowding the org images as needed.
 */
const ClutchView = ({className, orgs, idPrefix='organism-', height=218, onClick}) => {

  function handleClick(id, org) {
    const prefixIndex = id.indexOf(idPrefix),
          index = Number(id.substr(prefixIndex + idPrefix.length));
    if (onClick) onClick(index, id, org);
  }

  orgs.reverse(); // So that drakes don't move once placed
  let stableDrakeWidth = height * (5/8),
      stableDrakeViews = orgs.map((org, index) => {
        return (
          <div className="stable-drake-overlay">
            <OrganismView org = {org} id = {idPrefix + index} width = {stableDrakeWidth} onClick = {handleClick} />
          </div>
        );
      });
  const classes = classNames('geniblocks fv-stable', className);

  return (
    <div className={classes}>
      <FVStableCounter count={orgs.length} maxCount={5}/>
      <div className="stable-drakes">
        { stableDrakeViews }
      </div>
    </div>
  );
};

ClutchView.propTypes = {
  className: PropTypes.string,
  orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string,
  height: PropTypes.number,
  rows: PropTypes.number,
  tightenColumns: PropTypes.number,
  tightenRows: PropTypes.number,
  SelectedOrganismView: PropTypes.func,
  selectedIndex: PropTypes.number,
  onClick: PropTypes.func
};

export default ClutchView;
