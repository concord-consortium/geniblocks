import GameteView from '../../packages/geniblocks/src/code/components/gamete';

describe("<GameteView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, ''),
        gametes = drake.createGametes(10);

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<GameteView gamete={gametes[0]} id={0} display={{x:0, y:0}}/>);
    assert(wrapper.find('div').hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').hasClass('gamete'), "Should create a <div> with 'gamete' class");
  });

  // it("should create an <img> tag", function() {
  //   const wrapper = shallow(<GameteView org={drake}/>);
  //   assert.equal(wrapper.find('img').length, 1, "Should create a single <img> tag");
  // });

});
