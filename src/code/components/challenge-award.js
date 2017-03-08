import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';

class ChallengeAwardView extends React.Component {

  static propTypes = {
    challengeAwards: PropTypes.object,
    size: PropTypes.number,
    coinParts: PropTypes.number
  };

  static defaultProps = {
     challengeAwards: {routeSpec: {"level": 0, "mission":0, "challenge":0}, "challengeCount":0, "progress":[]},
     size: 256,
     coinParts: 3
  };

  addAwardImage = (progressImages, pieces, pieceNum, score, pieceStyle) => {
    let awardLevel = this.getAwardStyle(score);
    if (score > -1){
      let pieceName = `coin piece pieces${pieces} piece${pieceNum} ${pieceStyle} ${awardLevel}`;
      progressImages.push(<div key={pieceNum} className={pieceName} />);
    }
    return progressImages;
  };

  getAwardStyle = (score) => {
    let awardLevel = "gold";
    if (score === 1) awardLevel = "silver";
    if (score >= 2) awardLevel = "bronze";
    return awardLevel;
  };

  render() {
    let level = 0, mission = 0, challenge = 0, challengeCount = 0, progress = [], challengeBackgroundImage, progressImages = [];

    if (this.props.challengeAwards.routeSpec != null) {
      level = this.props.challengeAwards.routeSpec.level,
      mission = this.props.challengeAwards.routeSpec.mission,
      challenge = this.props.challengeAwards.routeSpec.challenge,
      challengeCount = this.props.challengeAwards.challengeCount;
      progress = this.props.challengeAwards.progress;
      challengeBackgroundImage = <div className="coin background" />;
    } else return null;

    if (!progress || progress === [])
      return null;

    let size = this.props.size || 256;
    let sizeStyle = {
      width: size + "px",
      height: size + "px"
    };

    let pieceKey = level + ":" + mission + ":";
    let challengeScore = {};

    for (let i = 0; i < challengeCount; i++){
      for (var key in progress){
        if (key.startsWith(pieceKey + i)){
          const score = progress[key];
          if (challengeScore[i] == null) {
             challengeScore[i] = score;
          } else {
            challengeScore[i] += score;
          }
        }
      }
    }
    let pieceNum = challenge + 1;
    let currentPieceStyle = `coin piece pieces${challengeCount} piece${pieceNum} single ${this.getAwardStyle(challengeScore[challenge])}`;

    for (var challengeNum in challengeScore){
      pieceNum = parseInt(challengeNum) + 1;
      progressImages = this.addAwardImage(progressImages, challengeCount, pieceNum, challengeScore[challengeNum], "whole");
    }

    let singlePieceOpacityStart = 1, singlePieceOpacityEnd = 0, style = {}, onRest;
    singlePieceOpacityEnd = spring(singlePieceOpacityEnd, { stiffness: 30, damping:20 });

    return (
      <div className="geniblocks challenge-award" style={sizeStyle} >
        {challengeBackgroundImage}
        {progressImages}
        <Motion className='geniblocks animated-coin-view'
            defaultStyle={{opacity: singlePieceOpacityStart}} style={{opacity: singlePieceOpacityEnd}} onRest={onRest} >
            {
              interpolatedStyle => {
                const tStyle = { ...style, ...interpolatedStyle };
                return (
                  <div key={pieceNum} style={tStyle} className={currentPieceStyle} />
                );
              }
            }
        </Motion>
      </div>
    );
  }
}

export default ChallengeAwardView;
