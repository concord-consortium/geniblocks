import React from 'react';

const loadingText = [
  "Loading Images",
  "Warming Up Chromoscope",
  "Hatching Drake Eggs",
  "Mucking Stables",
  "Freshening Breeding Rooms",
  "Digitizing Drake DNA",
  "Pipetting",
  "Scrubbing Drake Scales",
  "Trimming Drake Toenails",
  "Turning on Underground Base Muzak",
  "Warming Cafeteria Food",
  "Polishing Microscopes",
  "Rereading Safety Manuals",
  "Washing Lab Coats",
  "Applying for Grants"
];

let timer;

class LoadingView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      textN: 0
    };
  }

  componentDidMount() {
    const self = this;
    timer = setInterval(function() {
      const nextText = (self.state.textN + 1) % loadingText.length;
      self.setState({textN: nextText});
    }, 900);
  }

  componentWillUnmount() {
    clearInterval(timer);
  }

  render() {
    return( <div className="loading-images">{loadingText[this.state.textN] + "..."}</div> );
  }

}

export default LoadingView;
