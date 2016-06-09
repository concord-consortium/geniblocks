import ChromosomeView from '../../packages/geniblocks/src/code/components/chromosome';

describe("<ChromosomeView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, '');

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<ChromosomeView org={drake} chromosomeName='1' side='a'/>);
    assert(wrapper.find('div').at(0).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(0).hasClass('chromosome-container'), "Should create a <div> with 'chromosome-container' class");
  });

  it("should create intermediate <divs> with appropriate classes with labelsOnRight", function() {
    const wrapper = shallow(<ChromosomeView org={drake} chromosomeName='1' side='a'/>),
          itemsWrapper = wrapper.find('div.items'),
          labelsWrapper = wrapper.find('div.labels');
    assert.lengthOf(itemsWrapper, 1, "should create a single <div> with 'items' class");
    assert(!itemsWrapper.hasClass('rtl'), 1, "'items' <div> should not have 'rtl' class");
    assert.lengthOf(labelsWrapper, 1, "should create a single <div> with 'labels' class");
  });

  it("should create intermediate <divs> with appropriate classes without labelsOnRight", function() {
    const wrapper = shallow(<ChromosomeView org={drake} chromosomeName='1' side='a' labelsOnRight={false}/>),
          itemsWrapper = wrapper.find('div.items'),
          labelsWrapper = wrapper.find('div.labels');
    assert.lengthOf(itemsWrapper, 1, "should create a single <div> with 'items' class");
    assert(itemsWrapper.hasClass('rtl'), 1, "'items' <div> should have 'rtl' class");
    assert.lengthOf(labelsWrapper, 1, "should create a single <div> with 'labels' class");
  });

  it("should create a <ChromosomeImageView> tag", function() {
    const wrapper = shallow(<ChromosomeView org={drake} chromosomeName='1' side='a'/>);
    assert.lengthOf(wrapper.find('ChromosomeImageView'), 1, "Should create a single <ChromosomeImageView> component");
  });

});
