import React, { Component, PropTypes } from 'react';
import iframePhone from 'iframe-phone';
var phone;

export default class ZoomChallenge extends Component {

  static backgroundClasses = 'fv-layout fv-layout-zoom'

  constructor(props) {
    super(props);
    this.state = {
      hasTutorial: false
    };
  }

  componentDidMount() {
    var iframeElement = document.getElementById("iframe");
    phone = new iframePhone.ParentEndpoint(iframeElement);
    phone.addListener('challengeWin', this.props.onWinZoomChallenge);
    phone.addListener('activityLoaded', (activityData) => {
      if (activityData && activityData.hasTutorial) {
        this.setState({ hasTutorial: activityData.hasTutorial });
      }
    });
  }

  componentWillUnmount() {
    phone.disconnect();
  }

  render() {
    let url = this.props.zoomUrl;

    if (window.location.href.indexOf('/branch/staging') > -1 ) url = this.props.zoomUrl + "&staging=true";
    function togglePopups() {
      console.log('toggle');
      phone.post('togglePopups');
    }
    return (
      <div id="zoom-challenge-container">
        <iframe id="iframe" src={url} />
        {
          this.state.hasTutorial &&
          <div className="toggle-popups" onClick={togglePopups}>
            <div className="toggle-popups-icon" />
          </div>
        }
      </div>
    );
  }

  static authoredDrakesToDrakeArray = function() {
    return [];
  }

  static propTypes = {
    onWinZoomChallenge: PropTypes.func.isRequired,
    zoomUrl: PropTypes.string.isRequired
  }

}
