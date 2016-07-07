import React, {PropTypes} from 'react';
import OrganismView from './organism';

/**
 * @param {number} rows - Option number of rows. If defined, it will be fixed at that. Otherwise, it
 *                        will default to 1 when there are no orgs, and grows as more rows are needed.
 */
const PenView = ({orgs, idPrefix='organism-', width=400, columns=5, rows, SelectedOrganismView=OrganismView, selectedIndex, onClick}) => {

  function handleClick(id, org) {
    const prefixIndex = id.indexOf(idPrefix),
          index = Number(id.substr(prefixIndex + idPrefix.length));
    if (onClick) onClick(index, id, org);
  }

  let orgWidth = width/columns,
      orgViews = orgs.map((org, index) => {
        return index === selectedIndex
                ? <SelectedOrganismView org={org} id={idPrefix + index} index={index} key={index}
                                    color="#FFFFAA" size={orgWidth} onClick={handleClick}/>
                : <OrganismView org={org} id={idPrefix + index} index={index} key={index}
                                width={orgWidth} onClick={handleClick}/>;
      });

  rows = rows || Math.ceil(orgViews.length / columns) || 1;
  let height = orgWidth * rows,
      style = { width, height };

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
  SelectedOrganismView: PropTypes.func,
  selectedIndex: PropTypes.number,
  onClick: PropTypes.func
};

export default PenView;
