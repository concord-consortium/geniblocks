import ChromosomeView from '../../src/code/components/chromosome';

describe("<ChromosomeView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, ''),
        chromosome = drake.getGenotype().chromosomes[1]["a"];

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

  it("should create no labels if showLabels is false", function() {
    const wrapper = shallow(<ChromosomeView org={drake} chromosomeName='1' side='a' showLabels={false}/>),
          labelsWrapper = wrapper.find('div.labels');
    assert.lengthOf(labelsWrapper, 0, "should create no <div> with 'labels' class");
  });

  it("should create alleles if showAlleles is true", function() {
    const wrapper = shallow(<ChromosomeView org={drake} chromosomeName='1' side='a' showAlleles={true}/>),
          allelesWrapper = wrapper.find('div.alleles');
    assert.lengthOf(allelesWrapper, 1, "should create 1 <div> with 'alleles' class");
  });

  it("should create appropriate labels and alleles when we don't specify changeable or visible genes", function() {
    const wrapper = shallow(<ChromosomeView org={drake} chromosomeName='1' side='a' showAlleles={true}/>),
          labels = wrapper.find('GeneLabelView'),
          alleles = wrapper.find('AlleleView');
    assert.lengthOf(labels, 4, "should create 4 GeneLabelViews");
    assert.lengthOf(alleles, 4, "should create 4 AlleleViews");
    for (let label of labels) {
      assert.isFalse(label.props.editable);
    }
  });

  it("should create appropriate labels and alleles when we only specify changeable genes", function() {
    const wrapper = shallow(<ChromosomeView org={drake} chromosomeName='1' side='a' userChangeableGenes={["wings", "tail"]} showAlleles={true}/>),
          labels = wrapper.find('GeneLabelView'),
          alleles = wrapper.find('AlleleView');
    assert.lengthOf(labels, 2, "should create 2 GeneLabelViews");
    assert.lengthOf(alleles, 2, "should create 2 AlleleViews");
    for (let label of labels) {
      assert.isTrue(label.props.editable);
    }
  });

  it("should create appropriate labels and alleles when we only specify visible genes", function() {
    const wrapper = shallow(<ChromosomeView org={drake} chromosomeName='1' side='a' visibleGenes={["wings", "tail"]} showAlleles={true}/>),
          labels = wrapper.find('GeneLabelView'),
          alleles = wrapper.find('AlleleView');
    assert.lengthOf(labels, 2, "should create 2 GeneLabelViews");
    assert.lengthOf(alleles, 2, "should create 2 AlleleViews");
    for (let label of labels) {
      assert.isFalse(label.props.editable);
    }
  });

  it("should create appropriate labels and alleles when we specify changeable and visible genes", function() {
    const wrapper = shallow(<ChromosomeView org={drake} chromosomeName='1' side='a' userChangeableGenes={["wings", "tail"]} visibleGenes={["horns"]} showAlleles={true}/>),
          labels = wrapper.find('GeneLabelView'),
          alleles = wrapper.find('AlleleView'),
          editableLabels = wrapper.find('GeneLabelView[editable=true]');
    assert.lengthOf(labels, 3, "should create 3 GeneLabelViews");
    assert.lengthOf(alleles, 3, "should create 3 AlleleViews");
    assert.lengthOf(editableLabels, 2, "should create 2 editable GeneLabelViews");
  });

  it("should create a <ChromosomeImageView> tag", function() {
    const wrapper = shallow(<ChromosomeView org={drake} chromosomeName='1' side='a'/>);
    assert.lengthOf(wrapper.find('ChromosomeImageView'), 1, "Should create a single <ChromosomeImageView> component");
  });

  it("should create an empty chromosome if there is no organism", function() {
    const wrapper = shallow(<ChromosomeView />),
          labelsWrapper = wrapper.find('div.labels'),
          allelesWrapper = wrapper.find('div.alleles');
    assert.lengthOf(labelsWrapper, 0, "Should create no labels");
    assert.lengthOf(allelesWrapper, 0, "Should create no alleles");
    assert.lengthOf(wrapper.find('ChromosomeImageView'), 1, "Should still create a <ChromosomeImageView>");
  });

  it("should create the view when passed a chromosome object", function() {
    const wrapper = shallow(<ChromosomeView chromosome={chromosome}/>),
          labelsWrapper = wrapper.find('div.labels');
    assert.lengthOf(wrapper.find('ChromosomeImageView'), 1, "Should create a single <ChromosomeImageView> component");
    assert.lengthOf(labelsWrapper, 1, "should create a single <div> with 'labels' class");
  });

});
