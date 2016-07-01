import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';

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
        onGameteChromosomeAdded(org.sex, name, side);
      };

      function getGameteChromosome(index, chromosomeName) {
        var parent = index === 1 ? mother : father;
        if (gametes[index][chromosomeName]) {
          return parent.getGenotype().chromosomes[chromosomeName][gametes[index][chromosomeName]];
        }
      }

      const gameteChromosomeMap = {
        "1":  { a: getGameteChromosome(1, 1),    b: getGameteChromosome(0, 1) },
        "2":  { a: getGameteChromosome(1, 2),    b: getGameteChromosome(0, 2) },
        "XY": { a: getGameteChromosome(1, "XY"), b: getGameteChromosome(0, "XY") }
      };



      return (
      <div id="egg-game">
        <div className='column'>
          <div>Mother</div>
            <OrganismView org={ mother } />
            <GenomeView className="drake-genome" org={ mother } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} hiddenAlleles= { hiddenAlleles } />
        </div>
        <div className='egg column'>
          <GenomeView className="gamete-genomes" chromosomes={ gameteChromosomeMap } species={ mother.species } editable={false} hiddenAlleles= { hiddenAlleles } />
        </div>
        <div className='column'>
          <div>Father</div>
            <OrganismView org={ father } />
            <GenomeView className="drake-genome" org={ father } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} hiddenAlleles= { hiddenAlleles } />
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
    return [{}, {}];
  }
}
