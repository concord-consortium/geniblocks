import CircularGlowView from '../../packages/geniblocks/src/code/components/circular-glow';

describe("<CircularGlowView />", function(){

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<CircularGlowView color='#FFFFFF' size={100}/>);
    assert(wrapper.find('div').hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').hasClass('circular-glow'), "Should create a <div> with 'glow' class");
  });

  it("should create an <svg> tag", function() {
    const wrapper = shallow(<CircularGlowView color='#FFFFFF' size={100}/>);
    assert.lengthOf(wrapper.find('svg'), 1, "Should create a single <svg> tag");
    assert.closeTo(wrapper.find('svg').prop('width'), 100, 3);
  });

  it("should create a <radialGradient> tag", function() {
    const wrapper = shallow(<CircularGlowView id='test-id' color='#FFFFFF' size={100}/>);
    assert.lengthOf(wrapper.find('radialGradient'), 1, "Should create a single <radialGradient> tag");
    assert.include(wrapper.find('radialGradient').prop('id'), 'test-id');
  });

});
