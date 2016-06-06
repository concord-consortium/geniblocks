import Button from '../../packages/geniblocks/src/code/components/button';

describe("<Button />", function() {

  it("should create a <button> tag with appropriate class and attributes", function() {
    const wrapper = shallow(<Button className='test-class' label="Button Label"/>),
          buttonWrapper = wrapper.find('button');
    assert.lengthOf(buttonWrapper, 1, "Should create a single <button> tag");
    assert(buttonWrapper.hasClass('test-class'), "should have 'test-class' class");
    assert(buttonWrapper.hasClass('gb-button'), "should have 'gb-button' class");
    assert.equal(buttonWrapper.text(), "Button Label", "should have correct label");
  });

  it("should apply 'no-focus-highlight' class on mouse enter", function() {
    const wrapper = mount(<Button className='test-class' label="Button Label"/>),
          buttonWrapper = wrapper.find('button');
    assert(!buttonWrapper.hasClass('no-focus-highlight'), "should not have 'no-focus-highlight' class initially");
    buttonWrapper.simulate('mouseenter');
    assert(buttonWrapper.hasClass('no-focus-highlight'), "should have 'no-focus-highlight' class after event");
  });

});
