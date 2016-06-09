import GlowBackgroundView from '../../packages/geniblocks/src/code/components/glow-background';
import OrganismView from '../../packages/geniblocks/src/code/components/organism';

describe("<GlowBackgroundView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, '');

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<GlowBackgroundView id='test-id' color='#FFFFFF' size={100}
                                                ChildComponent={OrganismView} org={drake}/>);
    assert(wrapper.find('div').at(0).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(0).hasClass('glow-background'), "Should create a <div> with 'glow-background' class");
  });

  it("should create a <CircularGlowView> component", function() {
    const wrapper = shallow(<GlowBackgroundView id='test-id' color='#FFFFFF' size={100}
                                                ChildComponent={OrganismView} org={drake}/>);
    assert.lengthOf(wrapper.find('CircularGlowView'), 1, "Should create a single <CircularGlowView> component");
  });

  it("should create a <OrganismView> component", function() {
    const wrapper = shallow(<GlowBackgroundView id='test-id' color='#FFFFFF' size={100}
                                                ChildComponent={OrganismView} org={drake}/>);
    assert.lengthOf(wrapper.find('OrganismView'), 1, "Should create a single <OrganismView> component");
  });

});
