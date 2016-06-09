import React, {PropTypes} from 'react';
import PenView from './pen';
import StatsView from './stats';
import Tabs from 'react-simpletabs';

class PenStatsView extends React.Component {

  static propTypes = {
    orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
    lastClutchSize: PropTypes.number.isRequired,
    selectedIndex: PropTypes.number,
    onSelectionChange: PropTypes.func
  }

  render() {
    const { orgs, lastClutchSize, selectedIndex, onSelectionChange, ...others } = this.props,
          lastClutch = orgs.slice(-lastClutchSize);

    return (
      <Tabs>
        <Tabs.Panel title="Breeding Pen" key="Breeding Pen">
          <PenView orgs={lastClutch} {...others}
                  selectedIndex={selectedIndex}
                  onClick={function(iSelectedIndex) {
                    if (onSelectionChange)
                      onSelectionChange(iSelectedIndex);
                  }} />
        </Tabs.Panel>
        <Tabs.Panel title="Stats" key="Stats">
          <StatsView orgs={orgs} lastClutchSize={lastClutchSize} />
        </Tabs.Panel>
      </Tabs>
    );
  }
}

export default PenStatsView;
