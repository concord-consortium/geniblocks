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
    onClick: PropTypes.func,
    duration: PropTypes.number
  };

  handleClick = (evt) => {
    const { onClick } = this.props;
    if (onClick) onClick(evt);
  };

  handleEnd = () => {
    this.setState({finished: true});
  };

  render() {
    const { id, organism, displayStyle, onClick, duration } = this.props,
          { size: width } = displayStyle,
          newID = 'egg-hatch' + (id ? '-' + id : ''),
          eggStyle = { transform: "scale(.6)", position: 'absolute', size: width, ...displayStyle, top: displayStyle.top - width },
          drakeStyle = { position: 'absolute',
                          marginLeft: "400px", marginTop: "125px", ...displayStyle },
          orgView = <OrganismView id='egg-hatch-org' org={organism} width={width} style={drakeStyle} />,
          displayedView = this.state.finished ? orgView : <AnimatedSprite onEnd={this.handleEnd} classNames={"animated-egg-image"} frames={16} frameWidth={1052} duration={duration || 1333} style={eggStyle} />;

    return (
      <div id={newID} className='geniblocks egg-hatch' style={{ position: "absolute", width }}
            onClick={onClick ? this.handleClick : null} >
        {displayedView}
      </div>
    );
  }
}

export default FVEggHatchView;
