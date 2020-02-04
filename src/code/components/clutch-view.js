import React, {PropTypes} from 'react';
import FVEggHatchView from '../fv-components/fv-egg-hatch';
import classNames from 'classnames';

let disabledTimer;

const ClutchView = React.createClass({

  propTypes: {
    className: PropTypes.string,
    orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
    idPrefix: PropTypes.string,
    height: PropTypes.number,
    onClick: PropTypes.func,
    pageSize: PropTypes.number
  },

  getDefaultProps() {
    return ({
      idPrefix: 'organism-',
      height: 218,
      pageSize: 8
    });
  },

  getInitialState() {
    return { page : 0, tempDisabled: false };
  },

  handlePageBackward() {
    this.setState({page: Math.max(this.state.page - 1, 1)});
  },

  handlePageForward() {
    const numPages = Math.round(this.props.orgs.length / this.props.pageSize);
    this.setState({page: Math.min(this.state.page + 1, numPages)});
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.orgs.length === 0) {
      this.setState({page: 0});
    }
    if (nextProps.orgs.length > this.props.orgs.length) {
      // Move to the end whenever a new clutch is bred
      const numPages = Math.round(nextProps.orgs.length / this.props.pageSize);
      this.setState({page: numPages});
    }
  },

  componentWillUnmount() {
    if (disabledTimer) {
      clearTimeout(disabledTimer);
    }
  },

  render() {
    const handleClick = this.props.onClick ? (id, org) => {
      let _this = this;
      if (!_this.state.tempDisabled) {
        const prefixIndex = id.indexOf(_this.props.idPrefix),
              indexOnPage = Number(id.substr(prefixIndex + _this.props.idPrefix.length)),
              index = ((_this.state.page-1) * this.props.pageSize) + indexOnPage;

        _this.props.onClick(index, id, org);

        // Disable clicks for a bit to avoid mass submissions
        _this.setState({tempDisabled: true});
        disabledTimer = setTimeout(function() {
          _this.setState({tempDisabled: false});
        }, 2000);
      }
    } : null;

    let displayStyle = {size: 170, top: -35, marginLeft: 0, marginTop: 0},
        firstDrake = (this.state.page - 1) * this.props.pageSize,
        pageDrakes = this.props.orgs.slice(firstDrake, firstDrake + this.props.pageSize),
        stableDrakeViews = pageDrakes.map((org, index) => {
          return (
            <div key={index} className="stable-drake-overlay" style={{width: 116, height: 116}}>
              <FVEggHatchView organism = {org} id={this.props.idPrefix + index} onClick={handleClick} eggStyle={{left: -477, top: -424}} displayStyle={displayStyle}/>
            </div>
          );
        });
    const classes = classNames('geniblocks clutch-view', this.props.className);
    const maxPages = Math.round(this.props.orgs.length / this.props.pageSize);

    return (
      <div className={classes}>
        <div className="drake-pages">
          <div className="clutch-drakes">
            { stableDrakeViews }
          </div>
        </div>
        <div className="clutch-page-counter clutch-counter">
          <div className="clutch-slider left" onClick={this.handlePageBackward}></div>
          <div className="clutch-page-text">Clutch:</div>
          <div className="clutch-page-count">{this.state.page + " / " + maxPages}</div>
          <div className="clutch-slider right" onClick={this.handlePageForward}></div>
        </div>
      </div>
    );
  }
});

export default ClutchView;
