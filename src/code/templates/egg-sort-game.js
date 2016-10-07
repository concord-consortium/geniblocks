import React, { Component, PropTypes } from 'react';
import BasketSetView from '../components/basket-set';
import EggClutchView from '../components/egg-clutch';
import GenomeView from '../components/genome';

function isEggCompatibleWithBasket(egg, basket) {
  if (!egg || !basket) return false;
  if ((basket.sex != null) && (egg.sex !== basket.sex))
    return false;
  // one of the basket's allele strings...
  return basket.alleles.some((alleleString) => {
    // ... must match every one of its alleles ...
    return alleleString.split(',').every((allele) => {
      // ... to the alleles of the egg
      return egg.alleles.indexOf(allele) >= 0;
    });
  });
}

export default class EggSortGame extends Component {

  static propTypes = {
    case: PropTypes.number.isRequired,
    challenge: PropTypes.number.isRequired,
    trial: PropTypes.number.isRequired,
    drakes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    baskets: PropTypes.array.isRequired,
    onEggPlaced: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { drakes } = this.props,
          mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleles, drakes[0].sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleles, drakes[1].sex),
          eggs = drakes.slice(3).map((child) =>
                    new BioLogica.Organism(BioLogica.Species.Drake, child.alleleString, child.sex));
    this.setState({ mother, father, eggs });
  }

  componentWillReceiveProps(nextProps) {
    const { case: prevCase, challenge: prevChallenge, trial: prevTrial } = this.props,
          { case: nextCase, challenge: nextChallenge, trial: nextTrial } = nextProps;
    if ((prevCase !== nextCase) || (prevChallenge !== nextChallenge) || (prevTrial !== nextTrial))
      this.clearSelection();
  }

  clearSelection() {
    this.setState({ selectedBasketIndex: null, selectedBasket: null,
                    selectedEggIndex: null, selectedEgg: null });
  }

  handleBackgroundClick = () => {
    this.clearSelection();
  }

  handleBasketClick = (id, index, basket) => {
    const { onEggPlaced } = this.props,
          { selectedEgg } = this.state,
          isCompatible = selectedEgg && isEggCompatibleWithBasket(selectedEgg, basket);
    if (selectedEgg) {
      onEggPlaced(selectedEgg, basket, isCompatible);
    }
    this.setState({ selectedBasketIndex: index, selectedBasket: basket });
  }

  handleEggClick = (id, index, egg) => {
    this.setState({ selectedEggIndex: index, selectedEgg: egg });
  }

  render() {
    const { hiddenAlleles, baskets } = this.props,
          { eggs, selectedEgg, selectedEggIndex, selectedBasketIndex } = this.state,
          genomeView = selectedEgg
                        ? <GenomeView org={selectedEgg} hiddenAlleles={hiddenAlleles} editable={false} />
                        : null;

    return (
      <div id="egg-sort-game" onClick={this.handleBackgroundClick}>
        <div id="left-section">
          <div id="baskets">
            <BasketSetView baskets={baskets} selectedIndex={selectedBasketIndex} onClick={this.handleBasketClick} />
          </div>
          <div id="eggs">
            <EggClutchView eggs={eggs} selectedIndex={selectedEggIndex} onClick={this.handleEggClick} />
          </div>
        </div>
        <div id="right-section">
          {genomeView}
        </div>
      </div>
    );
  }

  static authoredDrakesToDrakeArray = function(authoredChallenge) {

    const mother = new BioLogica.Organism(BioLogica.Species.Drake,
                                          authoredChallenge.mother.alleles,
                                          authoredChallenge.mother.sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake,
                                          authoredChallenge.father.alleles,
                                          authoredChallenge.father.sex),
          // authored specs may be incomplete; these are complete specs
          motherSpec = { alleles: mother.getAlleleString(), sex: mother.sex },
          fatherSpec = { alleles: father.getAlleleString(), sex: father.sex };
    let drakes = [motherSpec, fatherSpec, null];
    for (let i = 0; i < authoredChallenge.eggCount; ++i) {
      const child = BioLogica.breed(mother, father),
            alleles = child.getAlleleString(),
            sex = child.sex;
      drakes.push({ alleles, sex });
    }
    return drakes;
  }

}
