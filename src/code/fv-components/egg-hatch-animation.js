import React, {PropTypes} from 'react';
import classNames from 'classnames';

class EggHatchAnimation extends React.Component {

  static propTypes = {
    type: PropTypes.string,
    frameWidth: PropTypes.number,
    frameRate: PropTypes.number
  }

  state = {
    frame: 0,
    frameCount: 22,
    direction: 1,
    timeoutID: null,
    requestID: null
  }

  animateFrame = () => {
    let state = this.state;

    if ((this.props.type === 'once') && (state.frame >= state.frameCount - 1))
      return;

    state.timeoutID = setTimeout(function() {
      state.requestID = requestAnimationFrame(this.animateFrame);
      ++ state.frame;
      this.setState(state);
    }, 1000 / this.props.frameRate);
  }

  componentDidMount() {
    this.animateFrame();
  }

  render() {
    const style = { backgroundPosition: `${this.state.frame * this.props.frameWidth}px 0p`};
    return (
      <div className='geniblocks egg-hatch-animation' style={style}></div>
    );
  }
}

export default EggHatchAnimation;
