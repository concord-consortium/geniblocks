import AnimatedOrganismView from '../../packages/geniblocks/src/code/components/animated-organism';

describe("<AnimatedOrganismView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, '');

  it("should create a <Motion> component with appropriate classes", function() {
    const wrapper = shallow(<AnimatedOrganismView org={drake}/>);
    assert(wrapper.find('Motion').hasClass('geniblocks'), "Should create a <Motion> component with 'geniblocks' class");
    assert(wrapper.find('Motion').hasClass('animated-organism-view'), "Should create a <Motion> component with 'animated-organism-view' class");
  });

  // it('should create an <OrganismView> component', function() {
  //   const wrapper = shallow(<AnimatedOrganismView org={drake}/>);
  //   assert.lengthOf(wrapper.find('div'), 1, "Should create a single child <div>");
  // });

});
