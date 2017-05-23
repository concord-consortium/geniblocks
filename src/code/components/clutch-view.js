import React, {PropTypes} from 'react';
import FVStableCounter from '../fv-components/stable-counter';
import FVEggHatchView from '../fv-components/fv-egg-hatch';
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
  let displayStyle = {size: height*(5/8), top: -153, marginLeft: -12},
      stableDrakeViews = orgs.map((org, index) => {
        return (
          <div className="stable-drake-overlay" style={{width: 116}}>
            <FVEggHatchView organism = {org} id={idPrefix + index} onClick={handleClick} eggStyle={{left: -477, top: -424}} displayStyle={displayStyle}/>
          </div>
        );
      });
  const classes = classNames('geniblocks fv-stable', className);

  return (
    <div className={classes}>
      <FVStableCounter count={orgs.length} maxCount={5}/>
      <div className="stable-drakes clutch-drakes">
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
