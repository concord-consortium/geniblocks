import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import GameteGenomeView from '../components/gamete-genome';
import ButtonView from '../components/button';

export default class EggGame extends Component {
    render() {
      const { drakes, gametes, onChromosomeAlleleChange, onGameteChromosomeAdded, onNavigateNextChallenge, hiddenAlleles, challenge } = this.props,
          mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleleString, drakes[0].sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleleString, drakes[1].sex);

      const handleAlleleChange = function(chrom, side, prevAllele, newAllele) {
        onChromosomeAlleleChange(0, chrom, side, prevAllele, newAllele);
      };
      const handleAdvanceChallenge = function() {
        onNavigateNextChallenge(challenge+1);
      };
      const handleChromosomeSelected = function(org, name, side) {
        let chromosomeObj = {orgAlleles: org.getAlleleString(), orgSex: org.sex, name, side},
            chromoNumber = {1: 0, 2: 1, "XY": 2}[name];
        onGameteChromosomeAdded(org.sex, chromoNumber, chromosomeObj);
      };

      return (
      <div id="egg-game">
        <div className='column'>
          <div>Mother</div>
            <OrganismView org={ mother } />
            <GenomeView className="drake-genome" org={ mother } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} showAlleles={true} hiddenAlleles= { hiddenAlleles } />
        </div>
        <div className='egg'>
          <div className='column'>
            <div>Ovum</div>
            <div className='egg-alleles'>
              <GameteGenomeView chromosomes={gametes[1]} hiddenAlleles= { hiddenAlleles } />
            </div>
          </div>
          <img src="resources/images/egg_yellow.png" />
          <div className='column'>
            <div>Sperm</div>
            <div className='egg-alleles'>
              <GameteGenomeView chromosomes={gametes[0]} hiddenAlleles= { hiddenAlleles } />
            </div>
          </div>
        </div>
        <div className='column'>
          <div>Father</div>
            <OrganismView org={ father } />
            <GenomeView className="drake-genome" org={ father } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} showAlleles={true} hiddenAlleles= { hiddenAlleles } />
        </div>
      </div>
    );
    }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    gametes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onGameteChromosomeAdded: PropTypes.func.isRequired,
    onNavigateNextChallenge: PropTypes.func.isRequired,
    challenge: PropTypes.number.isRequired
  }
  static authoredDrakesToDrakeArray = function(authoredChallenge) {
    return [authoredChallenge.mother, authoredChallenge.father];
  }
  static initialGametesArray = function() {
    return [[{},{},{}], [{},{},{}]];
  }
}
