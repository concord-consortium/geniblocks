import React, { PropTypes } from 'react';
const tweenState = require('react-tween-state');

const FVEggView = React.createClass({

  mixins: [tweenState.Mixin],

  propTypes: {
    eggClasses: PropTypes.string
  },

  getInitialState() {
    return {"backgroundPositionX": 0};
  },

  componentWillMount() {
    this.tweenState("backgroundPositionX", {
      easing: tweenState.easingTypes.linear,
      duration: 2000,
      endValue: 25
    });
  },

  render() {
    let style = {"backgroundPositionX": Math.floor(this.getTweeningValue("backgroundPositionX")) * -1476 + "px"};
    return (
      <div className={this.props.eggClasses} style={style} key={1}/>
    );
  }
});

export default FVEggView;
