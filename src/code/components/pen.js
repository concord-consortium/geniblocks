import React, {PropTypes} from 'react';
import OrganismView from './organism';

/**
 * @param {number} rows - Option number of rows. If defined, it will be fixed at that. Otherwise, it
 *                        will default to 1 when there are no orgs, and grows as more rows are needed.
 * @param {number} tightenRows - If given, will shrink the vertical height of the pen by this amount
 *                        per row, crowding the org images as needed.
 */
const PenView = ({orgs, idPrefix='organism-', width=400, columns=5, rows, tightenRows=0, tightenColumns=0, SelectedOrganismView=OrganismView, selectedIndex, onClick}) => {

  function handleClick(id, org) {
    const prefixIndex = id.indexOf(idPrefix),
          index = Number(id.substr(prefixIndex + idPrefix.length));
    if (onClick) onClick(index, id, org);
  }

  let orgStyle = {
    margin: `${-tightenRows/2}px ${-tightenColumns/2}px`
  };

  let orgWidth = width/columns,
      orgViews = orgs.map((org, index) => {
        return index === selectedIndex
                ? <SelectedOrganismView org={org} id={idPrefix + index} index={index} key={index}
                                    color="#FFFFAA" size={orgWidth} style={orgStyle} onClick={handleClick}/>
                : <OrganismView org={org} id={idPrefix + index} index={index} key={index}
                                width={orgWidth} style={orgStyle} onClick={handleClick} />;
      });

  rows = rows || Math.ceil(orgViews.length / columns) || 1;

  let height = orgWidth * rows;

  width  = width  - (tightenColumns * columns);
  height = height - (tightenRows * rows);

  let style = { width, height };

  return (
    <div className="geniblocks pen" style={style}>
      { orgViews }
    </div>
  );
};

PenView.propTypes = {
  orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string,
  width: PropTypes.number,
  columns: PropTypes.number,
  rows: PropTypes.number,
  tightenColumns: PropTypes.number,
  tightenRows: PropTypes.number,
  SelectedOrganismView: PropTypes.func,
  selectedIndex: PropTypes.number,
  onClick: PropTypes.func
};

export default PenView;
