import React, {PropTypes} from 'react';
import { EggView, EGG_IMAGE_WIDTH } from './egg-clutch';

const EGG_IMAGE_WIDTH_SMALL = EGG_IMAGE_WIDTH / 3;

class BasketView extends React.Component {

  static propTypes = {
    basket: PropTypes.shape({
      label: PropTypes.string,
      alleles: PropTypes.arrayOf(PropTypes.string),
      sex: PropTypes.number
    }),
    id: PropTypes.string,
    index: PropTypes.number,
    eggs: PropTypes.arrayOf(PropTypes.object),
    isSelected: PropTypes.bool,
    onUpdateBounds: PropTypes.func,
    onClick: PropTypes.func
  };

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const { basket, index, onUpdateBounds } = this.props,
          { domNode } = this.refs;
    if (domNode && onUpdateBounds)
      onUpdateBounds(basket, index, domNode.getBoundingClientRect());
  }

  handleClick = (evt) => {
    const { basket, id, index, onClick } = this.props;
    if (onClick)
      onClick(id, index, basket);
    evt.stopPropagation();
  }

  render() {
    const { basket, id, eggs, isSelected } = this.props,
          classes = 'basket' + (isSelected ? ' selected' : '');

    function eggsDiv() {
      if (!eggs || !eggs.length) return null;
      let eggViews = eggs.map(function(egg, index) {
        return (
          <EggView egg={egg} key={`basket-egg-${index}`} isSelected={true}
                            displayStyle={{size: EGG_IMAGE_WIDTH_SMALL}} />
        );
      });
      return (
        <div className='basket-eggs' style={{ position: 'absolute', display: 'flex',
                                              justifyContent: 'center',
                                              left: 30, top: 10, width: 70 }}>
          {eggViews}
        </div>
      );
    }

    return (
      <div className={classes} key={id} style={{ position: 'relative' }} onClick={this.handleClick}>
        <div className='basket-image' ref='domNode'></div>
        {eggsDiv()}
        <div className='basket-label'>{basket.label}</div>
      </div>
    );
  }
}

const BasketSetView = ({baskets, idPrefix='basket-', selectedIndices=[], eggs, animatingEggIndex, onUpdateBounds, onClick}) => {

  let basketViews = baskets.map((basket, index) => {
        const id = `${idPrefix}${index}`,
              isSelected = selectedIndices.indexOf(index) >= 0;
        let eggIndices = (basket && basket.eggs) || [],
            displayEggs = [];
            eggIndices.forEach((eggIndex) => {
              if (eggIndex === animatingEggIndex) return;
              if (eggs && eggs[eggIndex])
                displayEggs.push(eggs[eggIndex]);
            });
        return <BasketView basket={basket} id={id} key={id} index={index} eggs={displayEggs}
                        isSelected={isSelected} onUpdateBounds={onUpdateBounds} onClick={onClick} />;
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
  selectedIndices: PropTypes.arrayOf(PropTypes.number),
  eggs: PropTypes.arrayOf(PropTypes.object),
  animatingEggIndex: PropTypes.number,
  onUpdateBounds: PropTypes.func,
  onClick: PropTypes.func
};

export default BasketSetView;
