import React, {PropTypes} from 'react';

/**
 * @param {number} rows - Option number of rows. If defined, it will be fixed at that. Otherwise, it
 *                        will default to 1 when there are no orgs, and grows as more rows are needed.
 * @param {number} tightenRows - If given, will shrink the vertical height of the pen by this amount
 *                        per row, crowding the org images as needed.
 */
class EggView extends React.Component {

  static propTypes = {
    egg: PropTypes.object,
    id: PropTypes.string,
    index: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func
  };

  handleClick = (evt) => {
    const { egg, id, index, onClick } = this.props;
    if (onClick)
      onClick(id, index, egg);
    evt.stopPropagation();
  }

  render() {
    const { id, width, isSelected } = this.props,
          classes = 'clutch-egg' + (isSelected ? ' selected' : '');
    return (
      <div className={classes} width={width} key={id} onClick={this.handleClick} />
    );
  }
}

const EggClutchView = ({eggs, idPrefix='egg-', selectedIndex, onClick}) => {

  let orgViews = eggs.map((egg, index) => {
        const id = `${idPrefix}${index}`;
        return <EggView egg={egg} id={id} key={id} index={index}
                        isSelected={index === selectedIndex} onClick={onClick} />;
      });

  return (
    <div className="geniblocks egg-clutch">
      { orgViews }
    </div>
  );
};

EggClutchView.propTypes = {
  eggs: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string,
  selectedIndex: PropTypes.number,
  onClick: PropTypes.func
};

export default EggClutchView;
