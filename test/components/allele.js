import AlleleView from '../../packages/geniblocks/src/code/components/allele';

describe("<AlleleView />", function(){

  it("should create an <svg> tag", function() {
    const wrapper = shallow(<AlleleView width={25}/>);
    assert.lengthOf(wrapper.find('svg'), 1, "Should create a single <svg> tag");
    assert.closeTo(wrapper.find('svg').prop('width'), 25, 3);
  });

  it("should create a <circle> tag if requested", function() {
    const wrapper = shallow(<AlleleView width={25} shape="circle"/>);
    assert.lengthOf(wrapper.find('circle'), 1, "Should create a single <circle> tag");
    assert.closeTo(wrapper.find('circle').prop('r'), 12.5, 2);
  });

  it("should create a <rect> tag if requested", function() {
    const wrapper = shallow(<AlleleView width={25} shape="rect"/>);
    assert.lengthOf(wrapper.find('rect'), 1, "Should create a single <rect> tag");
    assert.closeTo(wrapper.find('rect').prop('width'), 25, 2);
  });

  it("should create a <text> tag", function() {
    const wrapper = shallow(<AlleleView width={25}/>);
    assert.lengthOf(wrapper.find('text'), 1, "Should create a single <text> tag");
  });

});
