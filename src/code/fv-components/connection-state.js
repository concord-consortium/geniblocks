import React, { PropTypes } from 'react';
import { CONNECTION_STATUS } from '../actions';

const ConnectionStateView = React.createClass({
  propTypes: {
    connectionState: PropTypes.string,
    onNotifyConnectionState: PropTypes.func
  },
  handleClick() {
    this.props.onNotifyConnectionState(this.props.connectionState);
  },
  render() {
    const currentConnectionState = this.props.connectionState || CONNECTION_STATUS.online;

    return (
      <div className={`geniblocks avatar-button ${currentConnectionState}`} onClick={this.handleClick}>
        <div className={`geniblocks avatar-center ${currentConnectionState}`}>
        </div>
      </div>
    );
  }
});

export default ConnectionStateView;
