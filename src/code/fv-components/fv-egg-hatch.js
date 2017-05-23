import React, {PropTypes} from 'react';
import AnimatedSprite from '../components/animated-sprite';
import OrganismView from '../components/organism';

class FVEggHatchView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      finished: false
    };
  }

  static propTypes = {
    id: PropTypes.string,
    egg: PropTypes.object,
    organism: PropTypes.object,
    displayStyle: PropTypes.object,
    eggStyle: PropTypes.object,
    onClick: PropTypes.func,
    duration: PropTypes.number
  };

  handleEnd = () => {
    this.setState({finished: true});
  };

  render() {
    const { id, organism, displayStyle, onClick, duration } = this.props,
          { size: width } = displayStyle,
          newID = 'egg-hatch' + (id ? '-' + id : ''),
          eggStyle = { transform: "scale(.6)", position: 'absolute', size: width, ...displayStyle, top: displayStyle.top - width, ...this.props.eggStyle },
          drakeStyle = { position: 'absolute',
                          marginLeft: "400px", marginTop: "125px", ...displayStyle },
          orgView = <OrganismView onClick={onClick} id={id} org={organism} width={width} style={drakeStyle} />,
          displayedView = this.state.finished ? orgView : <AnimatedSprite onEnd={this.handleEnd} classNames={"animated-egg-image"} frames={16} frameWidth={1052} duration={duration || 1333} style={eggStyle} />;

    return (
      <div id={newID} className='geniblocks egg-hatch' style={{ position: "absolute", width }}>
        {displayedView}
      </div>
    );
  }
}

export default FVEggHatchView;
