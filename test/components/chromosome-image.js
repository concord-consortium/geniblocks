import ChromosomeImageView from '../../packages/geniblocks/src/code/components/chromosome-image';

describe("<ChromosomeImageView />", function(){

  it("should create an <svg> tag", function() {
    const wrapper = shallow(<ChromosomeImageView />);
    assert.lengthOf(wrapper.find('svg'), 1, "Should create a single <svg> tag");
  });

  it("should create an <svg> tag with height and width attributes", function() {
    const wrapper = shallow(<ChromosomeImageView color='#FFFFFF' width={16} height={96}/>);
    assert.closeTo(wrapper.find('svg').prop('width'), 20, 2);
    assert.closeTo(wrapper.find('svg').prop('height'), 100, 2);
  });

  it("should create an <circle> tag with appropriate color", function() {
    const wrapper = shallow(<ChromosomeImageView color='#FFFFFF' width={16} height={96}/>);
    assert.equal(wrapper.find('circle').at(0).prop('fill'), '#FFFFFF');
  });

});
