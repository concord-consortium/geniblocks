import React, {PropTypes} from 'react';
import BreedButtonView from './breed-button';
import OrganismView from '../components/organism';
import FVEggView from './animated-egg';
import classNames from 'classnames';
import unscaleProperties from '../utilities/unscale-properties';

function isCompleteChromosomeSet(chromosomes) {
  return chromosomes && (chromosomes.length >= 3) &&
          chromosomes.every((ch) => ch != null);
}

class BreedButtonAreaView extends React.Component {

  static propTypes = {
    challengeClasses: PropTypes.string,
    scale: PropTypes.number,
    ovumChromosomes: PropTypes.array,
    spermChromosomes: PropTypes.array,
    userDrake: PropTypes.object,
    showUserDrake: PropTypes.bool,
    userDrakeHidden: PropTypes.bool,
    isHatchingInProgress: PropTypes.bool,
    isHatchingComplete: PropTypes.bool,
    onBreed: PropTypes.func
  };

  render() {
    const { challengeClasses, ovumChromosomes, spermChromosomes,
          userDrake, showUserDrake, userDrakeHidden,
          isHatchingInProgress, isHatchingComplete, onBreed } = this.props,
          // ovumClasses = classNames('ovum', challengeClasses),
          // spermClasses = classNames('sperm', challengeClasses),
          isBreedButtonEnabled = isCompleteChromosomeSet(ovumChromosomes) &&
                                  isCompleteChromosomeSet(spermChromosomes),
          eggClasses = classNames('egg-image', challengeClasses),
          eggImageView = <div className={'egg-wrapper'}> <FVEggView eggClasses={eggClasses} /> </div>;
    let userDrakeView = null;

    if (userDrake && isHatchingComplete) {
      const drakeImageView = <OrganismView className="matching" org={userDrake} width={200} key={1} />,
            eggOrDrakeView = showUserDrake || !userDrakeHidden ? drakeImageView : eggImageView;
      userDrakeView = eggOrDrakeView;
    } else {
      if (isHatchingInProgress) {
        userDrakeView = eggImageView;
      } else if (!userDrake) {
        userDrakeView = <BreedButtonView disabled={ !isBreedButtonEnabled } onClick={ onBreed } />;
      }
    }

    return (
      <div className="geniblocks breed-button-area">
        <div className='geniblocks breed-button-surround'>
          { userDrakeView }
        </div>
      </div>
    );
  }

  updateNotificationLocation() {
    const breedButtonAreaNodes = document.getElementsByClassName('geniblocks breed-button-area'),
          breedButtonAreaNode = breedButtonAreaNodes && breedButtonAreaNodes[0],
          drakeImageNodes = breedButtonAreaNode &&
                              breedButtonAreaNode.getElementsByClassName('geniblocks organism'),
          drakeImageNode = drakeImageNodes && drakeImageNodes[0],
          drakeImageBounds = drakeImageNode && drakeImageNode.getBoundingClientRect(),
          unscaledDrakeImageBounds = drakeImageBounds && unscaleProperties(drakeImageBounds);
    if (unscaledDrakeImageBounds) {
      // TODO: For the purposes of the upcoming classroom test we simply stash the location
      // in a global. Beyond the classroom test, the ITS feedback will presumably end up in
      // the HUD or some other such location so that this mechanism can be eliminated.
      // If it weren't temporary, a better long-term solution would be to put the location
      // in the state and have it handled via normal redux mechanisms, but that effort
      // doesn't seem worth it given the temporary nature of the need.
      window.gNotificationLocation = { top: unscaledDrakeImageBounds.top - 12,
                                      left: unscaledDrakeImageBounds.right + 15 };
    }
  }

  componentDidMount() {
    this.updateNotificationLocation();
  }

  componentDidUpdate() {
    this.updateNotificationLocation();
  }

}

export default BreedButtonAreaView;
