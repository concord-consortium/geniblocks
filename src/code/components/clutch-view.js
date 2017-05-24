import React, {PropTypes} from 'react';
import FVEggHatchView from '../fv-components/fv-egg-hatch';
import classNames from 'classnames';

/**
 * @param {number} rows - Option number of rows. If defined, it will be fixed at that. Otherwise, it
 *                        will default to 1 when there are no orgs, and grows as more rows are needed.
 * @param {number} tightenRows - If given, will shrink the vertical height of the stable by this amount
 *                        per row, crowding the org images as needed.
 */
const ClutchView = React.createClass({

  propTypes: {
    className: PropTypes.string,
    orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
    idPrefix: PropTypes.string,
    height: PropTypes.number,
    rows: PropTypes.number,
    tightenColumns: PropTypes.number,
    tightenRows: PropTypes.number,
    SelectedOrganismView: PropTypes.func,
    selectedIndex: PropTypes.number,
    onClick: PropTypes.func
  },

  getDefaultProps() {
    return ({
      idPrefix: 'organism-',
      height: 218
    });
  },

  getInitialState() {
    return { pagesBack : 0 };
  },

  handleClick(id, org) {
    const prefixIndex = id.indexOf(this.props.idPrefix),
          index = Number(id.substr(prefixIndex + this.props.idPrefix.length));
    if (this.props.onClick) this.props.onClick(index, id, org);
  },

  handlePageForward() {
    this.setState({pagesBack: Math.max(this.state.pagesBack - 1, 0)});
  },

  handlePageBackward() {
    const numPages = this.props.orgs.length / 8;
    this.setState({pagesBack: Math.min(this.state.pagesBack + 1, numPages - 1)});
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.orgs.length === 0) {
      this.setState({pagesBack: 0});
    }
    if (nextProps.orgs.length > this.props.orgs.length) {
      // Move to the end whenever a new clutch is bred
      this.setState({pagesBack: 0});
    }
  },

  render() {
    let displayStyle = {size: this.props.height*(5/8), top: -153, marginLeft: -12},
        stableDrakeViews = this.props.orgs.map((org, index) => {
          return (
            <div className="stable-drake-overlay" style={{width: 116}}>
              <FVEggHatchView organism = {org} id={this.props.idPrefix + index} onClick={this.handleClick} eggStyle={{left: -477, top: -424}} displayStyle={displayStyle}/>
            </div>
          );
        }),
        firstDrake = (this.props.orgs.length - 8) - (this.state.pagesBack * 8),
        pagedDrakeViews = stableDrakeViews.slice(firstDrake, firstDrake + 8);
    const classes = classNames('geniblocks fv-stable', this.props.className);
    const maxPages = this.props.orgs.length / 8;

    return (
      <div className={classes}>
        <div className="clutch-page-counter stable-counter">
          <div className="clutch-page-text">Clutch:</div>
          <div className="clutch-page-count">{(maxPages - this.state.pagesBack) + " / " + maxPages}</div>
        </div>
        <div className="drake-pages">
          <div className="clutch-slider left" onClick={this.handlePageBackward}></div>
          <div className="stable-drakes clutch-drakes">
            { pagedDrakeViews }
          </div>
          <div className="clutch-slider right" onClick={this.handlePageForward}></div>
        </div>
      </div>
    );
  }
});

export default ClutchView;
