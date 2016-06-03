/**
 * Case 1
 *
 * The code in this module was written to support a recreation of the challenges
 * from Case 1 in Geniverse. The challenges are:
 *  Challenge 0: Match the phenotype of a visible test drake to that of a target drake
 *               (This challenge is not in Geniverse but it was deemed a useful addition.)
 *  Challenge 1: Match the phenotype of a hidden test drake to that of a target drake
 *  Challenge 2: Match the phenotype of three hidden test drakes to target drakes
 */
import Case1Challenge from './challenge.js';
import Case1Playground from './playground.js';

class Case1 extends React.Component {

  static propTypes = {
    sexLabels: React.PropTypes.arrayOf(React.PropTypes.string),
    caseSpec: React.PropTypes.shape({
                title: React.PropTypes.string.isRequired,
                path: React.PropTypes.string.isRequired
              }).isRequired,
    challengeSpecs: React.PropTypes.arrayOf(
                      React.PropTypes.shape({
                        label: React.PropTypes.string.isRequired,
                        Component: React.PropTypes.func.isRequired,
                        isDrakeHidden: React.PropTypes.bool.isRequired,
                        trialCount: React.PropTypes.number.isRequired,
                        drakeAlleles: React.PropTypes.string.isRequired,
                        hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
                      })).isRequired,
    onCompleteCase: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.state = {
      currChallenge: 0
    };
  }

  getChallengeCount() {
    return this.props.challengeSpecs.length;
  }

  getLastChallengeIndex() {
    return this.props.challengeSpecs.length - 1;
  }

  handleAdvanceChallenge = () => {
    const lastChallenge = this.getLastChallengeIndex();
    let { currChallenge } = this.state;
    if (currChallenge < lastChallenge)
      this.setState({ currChallenge: ++currChallenge });
    else
      this.props.onCompleteCase();
  }

  render() {
    const { sexLabels, caseSpec } = this.props,
          challengeSpec = this.props.challengeSpecs[this.state.currChallenge],
          { currChallenge } = this.state,
          lastChallenge = this.getLastChallengeIndex();
    return (
      <div id='case-backdrop'>
        <div id='case-1'>
          {(() => {
            if (challengeSpec.Component === Case1Playground) {
              return (
                <Case1Playground
                    sexLabels={sexLabels}
                    caseSpec={caseSpec}
                    challengeSpec={challengeSpec}
                    currChallenge={currChallenge}
                    lastChallenge={lastChallenge}
                    onAdvanceChallenge={this.handleAdvanceChallenge}/>
              );
            }
            else {
              return (
                <Case1Challenge
                    sexLabels={sexLabels}
                    caseSpec={caseSpec}
                    challengeSpec={challengeSpec}
                    currChallenge={currChallenge}
                    lastChallenge={lastChallenge}
                    onAdvanceChallenge={this.handleAdvanceChallenge}/>
              );
            }
          })()}
        </div>
      </div>
    );
  }
}

export default Case1;
