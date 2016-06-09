import QuestionGlowView from '../../packages/geniblocks/src/code/components/question-glow';

describe("<QuestionGlowView />", function(){

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<QuestionGlowView glowColor='#FFFFFF' size={100}/>);
    assert(wrapper.find('div').at(0).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(0).hasClass('question-glow'), "Should create a <div> with 'question-glow' class");
  });

  it("should create a <CircularGlowView> component", function() {
    const wrapper = shallow(<QuestionGlowView glowColor='#FFFFFF' size={100}/>);
    assert.lengthOf(wrapper.find('CircularGlowView'), 1, "Should create a single <CircularGlowView> component");
  });

  it("should create a child <div> with appropriate classes", function() {
    const wrapper = shallow(<QuestionGlowView glowColor='#FFFFFF' size={100}/>);
    assert(wrapper.find('div').at(1).hasClass('geniblocks'), "Should create a child <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(1).hasClass('question-glow'), "Should create a child <div> with 'question-glow' class");
    assert(wrapper.find('div').at(1).hasClass('question-mark'), "Should create a child <div> with 'question-mark' class");
  });

});
