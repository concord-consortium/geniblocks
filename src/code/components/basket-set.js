import React, {PropTypes} from 'react';

/**
 * @param {number} rows - Option number of rows. If defined, it will be fixed at that. Otherwise, it
 *                        will default to 1 when there are no orgs, and grows as more rows are needed.
 * @param {number} tightenRows - If given, will shrink the vertical height of the pen by this amount
 *                        per row, crowding the org images as needed.
 */
class BasketView extends React.Component {

  static propTypes = {
    basket: PropTypes.shape({
      label: PropTypes.string,
      alleles: PropTypes.arrayOf(PropTypes.string),
      sex: PropTypes.number
    }),
    id: PropTypes.string,
    index: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func
  };

  handleClick = (evt) => {
    const { basket, id, index, onClick } = this.props;
    if (onClick)
      onClick(id, index, basket);
    evt.stopPropagation();
  }

  render() {
    const { basket, id, width, isSelected } = this.props,
          classes = 'basket' + (isSelected ? ' selected' : '');
    return (
      <div className={classes} width={width} key={id} onClick={this.handleClick}>
        <div className='basket-image'></div>
        <div className='basket-label'>{basket.label}</div>
      </div>
    );
  }
}

const BasketSetView = ({baskets, idPrefix='basket-', selectedIndex, onClick}) => {

  let basketViews = baskets.map((basket, index) => {
        const id = `${idPrefix}${index}`;
        return <BasketView basket={basket} id={id} key={id} index={index}
                        isSelected={index === selectedIndex} onClick={onClick} />;
      });

  return (
    <div className="geniblocks basket-set">
      { basketViews }
    </div>
  );
};

BasketSetView.propTypes = {
  baskets: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string,
  width: PropTypes.number,
  columns: PropTypes.number,
  rows: PropTypes.number,
  selectedIndex: PropTypes.number,
  onClick: PropTypes.func
};

export default BasketSetView;
