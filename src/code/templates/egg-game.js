import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import ButtonView from '../components/button';
import { transientStateTypes } from '../actions';

export default class EggGame extends Component {
    render() {
      const { drakes, gametes, onChromosomeAlleleChange, onGameteChromosomeAdded, onFertilize, hiddenAlleles, transientStates } = this.props,
          mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleleString, drakes[0].sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleleString, drakes[1].sex);

      const handleAlleleChange = function(chrom, side, prevAllele, newAllele) {
        onChromosomeAlleleChange(0, chrom, side, prevAllele, newAllele);
      };
      const handleChromosomeSelected = function(org, name, side) {
        onGameteChromosomeAdded(org.sex, name, side);
      };
      const handleFertilize = function() {
        onFertilize(2000, 0, 1);
      };

      function getGameteChromosome(index, chromosomeName) {
        var parent = index === 1 ? mother : father;
        if (gametes[index][chromosomeName]) {
          return parent.getGenotype().chromosomes[chromosomeName][gametes[index][chromosomeName]];
        }
      }

      const femaleGameteChromosomeMap = {
        "1":  { a: getGameteChromosome(1, 1)},
        "2":  { a: getGameteChromosome(1, 2)},
        "XY": { a: getGameteChromosome(1, "XY") }
      };

      const maleGameteChromosomeMap = {
        "1":  { b: getGameteChromosome(0, 1)},
        "2":  { b: getGameteChromosome(0, 2)},
        "XY": { b: getGameteChromosome(0, "XY") }
      };

      let gametesClass = "gametes";
      if (transientStates.indexOf(transientStateTypes.FERTILIZING) === -1 && !drakes[2]) {
        gametesClass += " unfertilized";
      }

      var childView;
      if (drakes[2]) {
        let child = new BioLogica.Organism(BioLogica.Species.Drake, drakes[2].alleleString, drakes[2].sex);
        childView = <OrganismView org={ child } />;
      } else {
        childView = <ButtonView label="Fertilize ❤️" onClick={ handleFertilize } />;
      }

      return (
      <div id="egg-game">
        <div className='column'>
          <div>Mother</div>
            <OrganismView org={ mother } />
            <GenomeView org={ mother } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} hiddenAlleles= { hiddenAlleles } />
        </div>
        <div className='egg column'>
          <div>
            { childView }
          </div>
          <div className={ gametesClass }>
            <div className='half-genome-left'>
              <GenomeView chromosomes={ femaleGameteChromosomeMap } species={ mother.species } editable={false} hiddenAlleles= { hiddenAlleles } />
            </div>
            <div className='half-genome-right'>
              <GenomeView chromosomes={ maleGameteChromosomeMap }   species={ mother.species } editable={false} hiddenAlleles= { hiddenAlleles } />
            </div>
          </div>
        </div>
        <div className='column'>
          <div>Father</div>
            <OrganismView org={ father } />
            <GenomeView org={ father } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} hiddenAlleles= { hiddenAlleles } />
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
    onFertilize: PropTypes.func.isRequired,
    challenge: PropTypes.number.isRequired
  }
  static authoredDrakesToDrakeArray = function(authoredChallenge) {
    return [authoredChallenge.mother, authoredChallenge.father];
  }
  static initialGametesArray = function() {
    return [{}, {}];
  }
}
