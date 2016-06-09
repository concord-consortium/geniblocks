/**
 * Case 3 Challenges
 *
 * The code in this module was written to support a recreation of the challenges
 * from Case 3 in Geniverse. The challenges are:
 *  Challenge 1: Modify mother drake so as to breed a particular target drake
 *  Challenge 2: Modify father drake so as to breed a pair of target drakes
 */
import Case3Challenge from './challenge';

class Case3 extends React.Component {

  static propTypes = {
    challengeSpecs: React.PropTypes.arrayOf(React.PropTypes.object),
    glowColor: React.PropTypes.string,
    dropGlowColor: React.PropTypes.string,
    correctGlowColor: React.PropTypes.string,
    incorrectGlowColor: React.PropTypes.string,
    targetDrakeSize: React.PropTypes.number,
    clutchSize: React.PropTypes.number,
    onCompleteCase: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    glowColor: '#FFFFAA',
    dropGlowColor: '#FFFF00',
    correctGlowColor: '#88FF88',
    incorrectGlowColor: '#FF8888',
    targetDrakeSize: 150,
    clutchSize: 20
  }

  constructor() {
    super();

    this.state = {
      currChallenge: 0
    };
  }

  handleNextChallenge = () => {
    const maxChallenge = this.props.challengeSpecs.length - 1;
    if (this.state.currChallenge < maxChallenge) {
      // advance to next challenge
      this.setState({ currChallenge: this.state.currChallenge + 1 });
    }
    else {
      // back to case log
      this.props.onCompleteCase();
    }
  }

  render() {
    const { challengeSpecs, glowColor, dropGlowColor, correctGlowColor,
            incorrectGlowColor, targetDrakeSize, clutchSize } = this.props,
          { currChallenge } = this.state,
          challengeSpec = challengeSpecs[currChallenge],
          maxChallenge = challengeSpecs.length - 1;
    return (
      <div id='case-backdrop'>
        <div id='case-3'>
          <Case3Challenge currChallenge={currChallenge} maxChallenge={maxChallenge}
                          challengeSpec={challengeSpec}
                          targetDrakeSize={targetDrakeSize} clutchSize={clutchSize}
                          glowColor={glowColor} dropGlowColor={dropGlowColor}
                          correctGlowColor={correctGlowColor} incorrectGlowColor={incorrectGlowColor}
                          onNextChallenge={this.handleNextChallenge}/>
        </div>
      </div>
    );
  }
}

export default Case3;
