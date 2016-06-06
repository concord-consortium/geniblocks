import QuestionOrganismGlowView from '../../packages/geniblocks/src/code/components/question-organism-glow';

describe("<QuestionOrganismGlowView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, '');

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<QuestionOrganismGlowView hidden={true}
                              org={drake} color='#FFFFFF' size={100}/>);
    assert(wrapper.find('div').hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').hasClass('question-organism-glow'), "Should create a <div> with 'question-organism-glow' class");
  });

  it("when hidden should create a <QuestionGlowView> component", function() {
    const wrapper = shallow(<QuestionOrganismGlowView hidden={true}
                              org={drake} color='#FFFFFF' size={100}/>);
    assert.lengthOf(wrapper.find('QuestionGlowView'), 1, "Should create a single <QuestionGlowView> component");
  });

  it("when hidden should not create an <OrganismGlowView> component", function() {
    const wrapper = shallow(<QuestionOrganismGlowView hidden={true}
                              org={drake} color='#FFFFFF' size={100}/>);
    assert.lengthOf(wrapper.find('OrganismGlowView'), 0, "Should not create an <OrganismGlowView> component");
  });

  it("when not hidden should create an <OrganismGlowView> component", function() {
    const wrapper = shallow(<QuestionOrganismGlowView hidden={false}
                              org={drake} color='#FFFFFF' size={100}/>);
    assert.lengthOf(wrapper.find('OrganismGlowView'), 1, "Should not create an <OrganismGlowView> component");
  });

  it("when not hidden should not create a <QuestionGlowView> component", function() {
    const wrapper = shallow(<QuestionOrganismGlowView hidden={false}
                              org={drake} color='#FFFFFF' size={100}/>);
    assert.lengthOf(wrapper.find('QuestionGlowView'), 0, "Should not create a <QuestionGlowView> component");
  });

});
