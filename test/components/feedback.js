import FeedbackView from '../../packages/geniblocks/src/code/components/feedback';

describe("<FeedbackView />", function(){

  it("should accept a single string of text", function() {
    const wrapper = shallow(<FeedbackView text={"Single String"}/>);
    assert(wrapper.find('div').at(0).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(0).hasClass('feedback-view'), "Should create a <div> with 'feedback' class");
    assert.lengthOf(wrapper.find('div.text-line'), 1, "Should create a single <div> with 'text-line' class");
    assert.equal(wrapper.find('div.text-line').at(0).text(), "Single String", "text-line should contain the correct text");
  });

  it("should accept an array of text strings", function() {
    const wrapper = shallow(<FeedbackView text={["String 1", "String 2"]}/>);
    assert(wrapper.find('div').at(0).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(0).hasClass('feedback-view'), "Should create a <div> with 'feedback' class");
    assert.lengthOf(wrapper.find('div.text-line'), 2, "Should create two <div>s with 'text-line' class");
    assert.equal(wrapper.find('div.text-line').at(0).text(), "String 1", "text-line should contain the correct text");
    assert.equal(wrapper.find('div.text-line').at(1).text(), "String 2", "text-line should contain the correct text");
  });

});
