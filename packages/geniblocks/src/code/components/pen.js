import {PropTypes} from 'react';
import OrganismView from './organism';

const PenView = ({orgs, idPrefix='organism-', width=400, columns=5, SelectedOrganismView=OrganismView, selectedIndex, onClick}) => {

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

  return (
    <div className="geniblocks pen">
      { orgViews }
    </div>
  );
};

PenView.propTypes = {
  orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string,
  width: PropTypes.number,
  columns: PropTypes.number,
  SelectedOrganismView: PropTypes.func,
  selectedIndex: PropTypes.number,
  onClick: PropTypes.func
};

export default PenView;
