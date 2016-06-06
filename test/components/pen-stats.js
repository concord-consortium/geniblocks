import PenStatsView from '../../packages/geniblocks/src/code/components/pen-stats';

describe("<PenStatsView />", function(){

  it("should create a <Tabs> component with two panels", function() {
    const wrapper = shallow(<PenStatsView orgs={[]} lastClutchSize={0}/>);
    assert.lengthOf(wrapper.find('Tabs'), 1, "Should create one <Tabs> component");
    assert.lengthOf(wrapper.find('Tabs').find('Panel'), 2, "Should create two <Tabs.Panel> components");
  });

  it("should create <PenView> and <StatsView> components", function() {
    const wrapper = shallow(<PenStatsView orgs={[]} lastClutchSize={0}/>);
    assert.lengthOf(wrapper.find('PenView'), 1, "Should create one <PenView> component");
    assert.lengthOf(wrapper.find('StatsView'), 1, "Should create one <StatsView> component");
  });

});
