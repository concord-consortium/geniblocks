import GametePoolView from '../../packages/geniblocks/src/code/components/gamete-pool';

describe("<GametePoolView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, ''),
        gametes = drake.createGametes(10);

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<GametePoolView gametes={gametes} />);
    assert(wrapper.find('div').at(0).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(0).hasClass('gamete-pool'), "Should create a <div> with 'gamete-pool' class");
  });

  it("should create appropriate child components", function() {
    const wrapper = shallow(<GametePoolView gametes={gametes} />);
    assert.lengthOf(wrapper.find('AnimatedGameteView'), 10, "Should create a <AnimatedGameteView> component for each gamete");
  });

});
