import React, { Component, PropTypes } from 'react';
import iframePhone from 'iframe-phone';
import urlParams from '../utilities/url-params';
const zoomRelPath = "/models/geniventure-cell";
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
    phone.addListener('challengeFail', () => {
      this.props.onWinZoomChallenge({score: 5});
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

    // replace base of zoomUrl if `zoomBase` url parameter is passed
    if (urlParams.zoomBase) {
      // rather than searching/replacing the volatile part of the path
      // (e.g. https://organelle.concord.org/branch/geniventure), we find
      // the stable part of the path and replace everything before it.
      const relIndex = url.indexOf(zoomRelPath);
      const relUrl = url.substr(relIndex);
      url = urlParams.zoomBase + relUrl;
    }
    // forward `gameBase` url parameter if it is passed
    if (urlParams.gameBase) {
      url += "&gameBase=" + urlParams.gameBase;
    }
    // add `staging` url parameter if no `gameBase` and launched from staging (legacy)
    else if (window.location.href.indexOf('/branch/staging') > -1 ) url += "&staging=true";

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
