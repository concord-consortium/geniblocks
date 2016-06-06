import OrganismGlowView from '../../packages/geniblocks/src/code/components/organism-glow';

describe("<OrganismGlowView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, '');

  it("should create a <div> tag with appropriate id", function() {
    const wrapper = shallow(<OrganismGlowView id='test-id' className='test-class'
                                org={drake} color='#FFFFFF' size={100}/>);
    assert.equal(wrapper.find('div').prop('id'), 'test-id', "Should create a <div> with 'geniblocks' class");
  });

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<OrganismGlowView id='test-id' className='test-class'
                                org={drake} color='#FFFFFF' size={100}/>);
    assert(wrapper.find('div').hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').hasClass('organism-glow'), "Should create a <div> with 'organism-glow' class");
    assert(wrapper.find('div').hasClass('test-class'), "Should create a <div> with 'test-class' class");
  });

  it("should create a <CircularGlowView> component", function() {
    const wrapper = shallow(<OrganismGlowView id='test-id' className='test-class'
                                org={drake} color='#FFFFFF' size={100}/>);
    assert.lengthOf(wrapper.find('CircularGlowView'), 1, "Should create a single <CircularGlowView> tag");
  });

  it("should create an <OrganismView> component", function() {
    const wrapper = shallow(<OrganismGlowView id='test-id' className='test-class'
                                org={drake} color='#FFFFFF' size={100}/>);
    assert.lengthOf(wrapper.find('OrganismView'), 1, "Should create a single <OrganismView> tag");
  });

});
