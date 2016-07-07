import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import ButtonView from '../components/button';
import { transientStateTypes } from '../actions';

export default class EggGame extends Component {
    render() {
      const { drakes, gametes, onChromosomeAlleleChange, onGameteChromosomeAdded, onFertilize, onReset, hiddenAlleles, transientStates } = this.props,
          mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleleString, drakes[0].sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleleString, drakes[1].sex);

      const handleAlleleChange = function(chrom, side, prevAllele, newAllele) {
        onChromosomeAlleleChange(0, chrom, side, prevAllele, newAllele);
      };
      const handleChromosomeSelected = function(org, name, side) {
        onGameteChromosomeAdded(org.sex, name, side);
      };
      const handleFertilize = function() {
        if (Object.keys(gametes[0]).length === 3 && Object.keys(gametes[1]).length === 3) {
          onFertilize(2000, 0, 1);
        }
      };
      const handleReset = function() {
        onReset();
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
      if (transientStates.length === 0 && !drakes[2]) {
        gametesClass += " unfertilized";
      }

      var childView;
      if (drakes[2]) {
        let child = new BioLogica.Organism(BioLogica.Species.Drake, drakes[2].alleleString, drakes[2].sex);
        childView = <OrganismView org={ child } width={170} />;
      } else if (transientStates.indexOf(transientStateTypes.HATCHING) > -1) {
        childView = <img className="egg-image" src="resources/images/egg_yellow.png" />;
      } else if (transientStates.indexOf(transientStateTypes.FERTILIZING) === -1) {
        let text = "Fertilize ❤️",
            className = "fertilize-button";
        if (Object.keys(gametes[0]).length !== 3 || Object.keys(gametes[1]).length !== 3) {
          text = "Fertilize",
          className += " disabled";
        }
        childView = <ButtonView className={ className } label={ text } onClick={ handleFertilize } />;
      }

      var ovumView, spermView;
      if ((transientStates.length === 0 && !drakes[2]) ||  transientStates.indexOf(transientStateTypes.FERTILIZING) > -1) {
        ovumView  = <img className="ovum" src="resources/images/egg.svg" />;
        spermView = <img className="sperm" src="resources/images/sperm.svg" />;
      }

      var resetButtonView = null;
      if (drakes[2]) {
        resetButtonView = <ButtonView label="Reset" onClick={ handleReset } />;
      }

      return (
      <div id="egg-game">
        <div className='column'>
          <div>Mother</div>
            <OrganismView org={ mother } flipped={ true }/>
            <GenomeView org={ mother } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} hiddenAlleles= { hiddenAlleles } small={ true } selectedChromosomes={ gametes[1] } />
        </div>
        <div className='egg column'>
          <div className='top'>
            { childView }
          </div>
          <div className={ gametesClass }>
            <div className='half-genome half-genome-left'>
              { ovumView }
              <GenomeView chromosomes={ femaleGameteChromosomeMap } species={ mother.species } editable={false} hiddenAlleles= { hiddenAlleles } small={ true } />
            </div>
            <div className='half-genome half-genome-right'>
              { spermView }
              <GenomeView chromosomes={ maleGameteChromosomeMap }   species={ mother.species } editable={false} hiddenAlleles= { hiddenAlleles } small={ true } />
            </div>
          </div>
          <div>
            { resetButtonView }
          </div>
        </div>
        <div className='column'>
          <div>Father</div>
            <OrganismView org={ father } />
            <GenomeView org={ father } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} hiddenAlleles= { hiddenAlleles } small={ true } selectedChromosomes={ gametes[0] } />
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
