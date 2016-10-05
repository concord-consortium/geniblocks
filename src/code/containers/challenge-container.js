import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import templates from '../templates';
import { changeAllele, changeSex, submitDrake, resetGametes,
        navigateToCurrentRoute, navigateToChallenge, navigateToNextChallenge,
        addGameteChromosome, keepOffspring, fertilize, hatch,
        completeChallenge } from '../actions';

class ChallengeContainer extends Component {
  componentWillMount() {
    if (this.props.routeParams.case && this.props.routeParams.challenge) {
      this.props.navigateToCurrentRoute(this.props.routeParams.case-1, this.props.routeParams.challenge-1);
    } else {
      this.props.navigateToChallenge(0, 0);
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.case !== newProps.routeParams.case-1 ||
      newProps.challenge !== newProps.routeParams.challenge-1) {
      if (newProps.routeParams.case && newProps.routeParams.challenge) {
        this.props.navigateToCurrentRoute(newProps.routeParams.case-1, newProps.routeParams.challenge-1);
      }
    }
  }

  render() {
    if (!this.props.template) return null;

    const Template = templates[this.props.template];
    return (
      <div id="challenges" className="case-backdrop">
        <div id="case-wrapper">
          <Template {...this.props} />
        </div>
      </div>
    );
  }

  static propTypes = {
    template: PropTypes.string,
    routeParams: PropTypes.shape({
      case: PropTypes.string,
      challenge: PropTypes.string
    }),
    navigateToChallenge: PropTypes.func,
    navigateToCurrentRoute: PropTypes.func
  }
}

function mapStateToProps (state) {
    return {
      template: state.template,
      challengeType: state.challengeType,
      showUserDrake: state.showUserDrake,
      drakes: state.drakes,
      gametes: state.gametes,
      hiddenAlleles: state.hiddenAlleles.asMutable(),
      trial: state.trial,
      trials: state.trials,
      case: state.case,
      challenge: state.challenge,
      moves: state.moves,
      goalMoves: state.goalMoves,
      userDrakeHidden: state.userDrakeHidden
    };
  }

function mapDispatchToProps(dispatch) {
  return {
    onChromosomeAlleleChange: (index, chrom, side, prevAllele, newAllele) => dispatch(changeAllele(index, chrom, side, prevAllele, newAllele, true)),
    onSexChange: (index, newSex) => dispatch(changeSex(index, newSex, true)),
    onDrakeSubmission: (targetPhenotype, userPhenotype, correct, incorrectAction) => 
      dispatch(submitDrake(targetPhenotype, userPhenotype, correct, incorrectAction)),
    onNavigateNextChallenge: () => dispatch(navigateToNextChallenge()),
    onCompleteChallenge: () => dispatch(completeChallenge()),
    navigateToChallenge: (_case, challenge) => dispatch(navigateToChallenge(_case, challenge)),
    navigateToCurrentRoute: (_case, challenge) => dispatch(navigateToCurrentRoute(_case, challenge)),
    onGameteChromosomeAdded: (index, name, side) => dispatch(addGameteChromosome(index, name, side)),
    onFertilize: (gamete1, gamete2) => dispatch(fertilize(gamete1, gamete2)),
    onHatch: () => dispatch(hatch()),
    onResetGametes: () => dispatch(resetGametes()),
    onKeepOffspring: (index, success, maxDrakes) => dispatch(keepOffspring(index, success, maxDrakes))
  };
}

const Challenge = connect(mapStateToProps, mapDispatchToProps)(ChallengeContainer);

export default Challenge;
