import React, { Component, PropTypes } from 'react';
import GenomeView from '../components/genome';
import ButtonView from '../components/button';

export default class EggGame extends Component {
    render() {
      const { drakes, onChromosomeAlleleChange, onChromosomeSelected, onNavigateNextChallenge, hiddenAlleles, challenge } = this.props,
          drakeDef = drakes[0].alleleString,
          drakeSex = drakes[0].sex,
          drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef, drakeSex);

      const handleAlleleChange = function(chrom, side, prevAllele, newAllele) {
        onChromosomeAlleleChange(0, chrom, side, prevAllele, newAllele);
      };
      const handleAdvanceChallenge = function() {
        onNavigateNextChallenge(challenge+1);
      };
      const handleChromosomeSelected = function(organism, chromosome) {
        onChromosomeSelected(organism, chromosome);
      };

      return (
      <div id="egg-game">
        <div className='column'>
          <div>Mother</div>
            <GenomeView className="drake-genome" org={ drake } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} showAlleles={true} hiddenAlleles= { hiddenAlleles } />
            <div>Ovum</div>
            <div className='egg-alleles' />
        </div>
        <div className='column'>
          <div>Father</div>
            <GenomeView className="drake-genome" org={ drake } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} showAlleles={true} hiddenAlleles= { hiddenAlleles } />
            <div>Sperm</div>
            <div className='egg-alleles' />
        </div>
          <div className='egg'>
            <img src="resources/images/egg_yellow.png" />
          </div>
      </div>
    );
    }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onChromosomeSelected: PropTypes.func.isRequired,
    onNavigateNextChallenge: PropTypes.func.isRequired,
    challenge: PropTypes.number.isRequired
  }
  static authoredDrakesToDrakeArray = function(authoredChallenge) {
    return [authoredChallenge.initialDrakes];
  }
}
