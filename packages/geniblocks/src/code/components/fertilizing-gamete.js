import React, {PropTypes} from 'react';
import AnimatedGameteView from './animated-gamete';

const INITIAL_GAMETE_SIZE = 30,
      FINAL_GAMETE_SIZE = 140,
      RESTING_MOTHER_GAMETE_X = 0,
      RESTING_FATHER_GAMETE_X = 150,
      FERTILIZING_MOTHER_GAMETE_X = 70,
      FERTILIZING_FATHER_GAMETE_X = 80,
      FINAL_ZYGOTE_Y = -150;

export const GAMETE_TYPE = { MOTHER: 'mother', FATHER: 'father' };

export default class FertilizingGameteView extends React.Component {

  static propTypes = {
    type: PropTypes.oneOf([ GAMETE_TYPE.MOTHER, GAMETE_TYPE.FATHER ]).isRequired,
    gamete: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    fertilizationState: PropTypes.oneOf(['none', 'fertilizing', 'fertilized', 'complete']).isRequired,
    hiddenAlleles: PropTypes.arrayOf(PropTypes.string),
    srcRect: PropTypes.shape({
      left: PropTypes.number.isRequired,
      top: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }),
    dstRect: PropTypes.shape({
      left: PropTypes.number.isRequired,
      top: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }),
    animStiffness: PropTypes.number,  // stiffness of spring for animation (default: 100)
    onRest: PropTypes.func
  }

  static defaultProps = {
    hiddenAlleles: [],
    animStiffness: 100
  }

  constructor(props) {
    super(props);
  }

  render = () => {
    let {gamete, id, hiddenAlleles, animStiffness, onRest} = this.props,
        xOffset = this.props.srcRect ? this.props.srcRect.left - this.props.dstRect.left : 0,
        yOffset = this.props.srcRect ? this.props.srcRect.top - this.props.dstRect.top : 0,
        xResting = this.props.type === GAMETE_TYPE.FATHER ? RESTING_FATHER_GAMETE_X
                                                          : RESTING_MOTHER_GAMETE_X,
        xFertilizing = this.props.type === GAMETE_TYPE.FATHER ? FERTILIZING_FATHER_GAMETE_X
                                                              : FERTILIZING_MOTHER_GAMETE_X,
        initial, tFinal;

    if (!gamete || (id == null)) return;

    if (this.props.fertilizationState === 'none') {
      if (this.props.type === GAMETE_TYPE.FATHER)
        xOffset += RESTING_FATHER_GAMETE_X;
      initial = { x: xOffset, y: yOffset, size: INITIAL_GAMETE_SIZE };
      tFinal = { x: xResting, y: 0, size: FINAL_GAMETE_SIZE };
    }
    else if (this.props.fertilizationState === 'fertilizing') {
      initial = { x: xResting, y: 0, size: FINAL_GAMETE_SIZE, opacity: 1.0 };
      tFinal = { x: xFertilizing, y: 0, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 1.0 };
    }
    else {
      initial = { x: xFertilizing, y: 0, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 1.0 };
      tFinal = { x: xFertilizing, y: FINAL_ZYGOTE_Y, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 0.0 };
    }

    return (
      <AnimatedGameteView gamete={gamete} id={id} hiddenAlleles={hiddenAlleles}
                          initialDisplay={initial} display={tFinal}
                          animStiffness={animStiffness} onRest={onRest} />
    );
  }
}
