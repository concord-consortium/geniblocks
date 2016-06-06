import GeneLabelView from '../../packages/geniblocks/src/code/components/gene-label';

describe("<GeneLabelView />", function(){
  const drake = BioLogica.Species.Drake,
        tailAllele = 'T'; // long tail

  it("when non-editable should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<GeneLabelView species={drake} allele={tailAllele}/>);
    assert(wrapper.find('div').hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').hasClass('gene-label'), "Should create a <div> with 'gene-label' class");
    assert(wrapper.find('div').hasClass('allele'), "Should create a <div> with 'allele' class");
    assert(!wrapper.find('div').hasClass('editable'), "Should create a <div> without 'editable' class");
    assert(wrapper.find('div').hasClass('noneditable'), "Should create a <div> with 'noneditable' class");
  });

  it("when non-editable should not create a <select> tag", function() {
    const wrapper = shallow(<GeneLabelView species={drake} allele={tailAllele}/>);
    assert.lengthOf(wrapper.find('select'), 0, "Should not create a <select> tag");
  });

  it("when editable should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<GeneLabelView species={drake} allele={tailAllele} editable={true}/>);
    assert(wrapper.find('div').hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').hasClass('gene-label'), "Should create a <div> with 'gene-label' class");
    assert(wrapper.find('div').hasClass('allele'), "Should create a <div> with 'allele' class");
    assert(wrapper.find('div').hasClass('editable'), "Should create a <div> with 'editable' class");
    assert(!wrapper.find('div').hasClass('noneditable'), "Should create a <div> without 'noneditable' class");
  });

  it("when editable should create a <select> tag with appropriate <option>s", function() {
    const wrapper = shallow(<GeneLabelView species={drake} allele={tailAllele} editable={true}/>);
    assert.lengthOf(wrapper.find('select'), 1, "Should create a single <select> tag");
    // see http://facebook.github.io/react/docs/forms.html#why-select-value
    assert.equal(wrapper.find('select').prop('value'), tailAllele, "<select> tag should have a value");
    assert.lengthOf(wrapper.find('option'), 3, "Should create three <option> tags");
  });

});
