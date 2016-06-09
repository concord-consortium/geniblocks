import OrganismView from '../../packages/geniblocks/src/code/components/organism';

describe("<OrganismView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, ''),
        orgID = 'organism-0';

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<OrganismView org={drake} id={orgID} />);
    assert(wrapper.find('div').hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').hasClass('organism'), "Should create a <div> with 'organism' class");
  });

  it("should create an <img> tag", function() {
    const wrapper = shallow(<OrganismView org={drake} id={orgID} />);
    assert.equal(wrapper.find('img').length, 1, "Should create a single <img> tag");
  });

  it("clicking an <OrganismView> should trigger the handleClick handler", function() {
    let clickedID, clickedOrg;
    function handleTestClick(id, org) {
      clickedID = id;
      clickedOrg = org;
    }
    const wrapper = shallow(<OrganismView org={drake}  id={orgID}
                                          onClick={handleTestClick} />);
    wrapper.simulate('click');
    assert.equal(clickedID, orgID, "Clicking an <OrganismView> should trigger click handler");
    assert.equal(clickedOrg, drake, "Clicking an <OrganismView> should trigger click handler");
  });

});
