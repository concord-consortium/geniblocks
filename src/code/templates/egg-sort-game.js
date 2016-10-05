import React, { Component, PropTypes } from 'react';
import EggClutchView from '../components/egg-clutch';
import GenomeView from '../components/genome';

export default class EggSortGame extends Component {

  componentWillMount() {
    const { drakes } = this.props,
          mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleles, drakes[0].sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleles, drakes[1].sex),
          eggs = drakes.slice(3).map((child) =>
                    new BioLogica.Organism(BioLogica.Species.Drake, child.alleleString, child.sex));
    this.setState({ mother, father, eggs });
  }

  handleEggClick = (id, index, egg) => {
    this.setState({ selected: { index, egg }});
  }

  render() {
    const { hiddenAlleles } = this.props,
          { eggs, selected } = this.state,
          selectedIndex = selected && selected.index,
          selectedEgg = selected && selected.egg,
          genomeView = selectedEgg
                        ? <GenomeView org={selectedEgg} hiddenAlleles={hiddenAlleles} editable={false} />
                        : null;

    return (
      <div id="egg-sort-game">
        <div id="left-section">
          <div id="baskets"></div>
          <div id="eggs">
            <EggClutchView eggs={eggs} selectedIndex={selectedIndex} onClick={this.handleEggClick} />
          </div>
        </div>
        <div id="right-section">
          {genomeView}
        </div>
      </div>
    );
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onSexChange: PropTypes.func.isRequired,
    onCompleteChallenge: PropTypes.func.isRequired
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
      const child = BioLogica.breed(mother, father, false),
            alleles = child.getAlleleString(),
            sex = child.sex;
      drakes.push({ alleles, sex });
    }
    return drakes;
  }

}
