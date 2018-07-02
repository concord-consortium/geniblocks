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
    phone.addListener('challengeWin', (activityData) => {
      let stats = {
        score: 0
      };
      const positiveMetrics = this.props.zoomScoringMetrics;

      // check we have a list of positive metrics and score to calculate
      if (activityData && activityData.actionStats && positiveMetrics) {
        stats = activityData.actionStats;

        if (positiveMetrics && stats) {
          let total = 0, positiveTotal = 0;
          for (let m in stats) {
            if (positiveMetrics.indexOf(m) > -1) {
              positiveTotal += stats[m];
            }
            total += stats[m];
          }
          // TODO: Calculate actual tolerance for success metric - currently works as:
          // 90% or higher = blue, 80-90% = yellow, 70-80% = red, etc.
          const score = positiveTotal / total * 10;
          const gemScore = 10 - Math.ceil(score);
          stats.score = gemScore;
          console.log(stats, score);
        }
      }
      this.props.onWinZoomChallenge(stats);
    });
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
    zoomScoringMetrics: PropTypes.array,
    zoomUrl: PropTypes.string.isRequired
  }

}
