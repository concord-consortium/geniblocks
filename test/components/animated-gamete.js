import AnimatedGameteView from '../../packages/geniblocks/src/code/components/animated-gamete';

describe("<AnimatedGameteView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, ''),
        gametes = drake.createGametes(10);

  it("should create a <Motion> component with appropriate classes", function() {
    const wrapper = shallow(<AnimatedGameteView gamete={gametes[0]} id={0} display={{x:0, y:0}}/>);
    assert(wrapper.find('Motion').hasClass('geniblocks'), "Should create a <Motion> component with 'geniblocks' class");
    assert(wrapper.find('Motion').hasClass('animated-gamete'), "Should create a <Motion> component with 'animated-gamete' class");
  });

  // it('should create an <GameteView> component', function() {
  //   const wrapper = shallow(<AnimatedGameteView gamete={gametes[0]} id='' display={{x:0, y:0}}/>);
  //   assert.lengthOf(wrapper.find('GameteView'), 1, "Should create a single <GameteView> component");
  // });

});
