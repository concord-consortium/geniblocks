/*
 * Based on ReactOverlays demo at http://react-bootstrap.github.io/react-overlays/examples/#modals
 */
import React, { PropTypes } from 'react';
import t from '../utilities/translate';

class Notifications extends React.Component {

  static propTypes = {
    location: PropTypes.object,
    messages: PropTypes.array,
    onCloseButton: PropTypes.func,
    onAdvanceNotifications: PropTypes.func.isRequired,
    onCloseNotifications: PropTypes.func.isRequired
  }

  static defaultProps = {
    messages: []
  }

  handleClose(onCloseButton, onCloseNotifications) {
    return () => {
      if (onCloseButton) {
        onCloseButton();
      }
      onCloseNotifications();
    };
  }

  render() {
    if (!this.props.messages || !this.props.messages[0]) {
      return null;
    }

    const message = this.props.messages[0],
          speaker = <div className="fv-character"></div>,
          text = typeof message === "string" ? message : message.text,
            // don't show close button if there's more narrative dialog
          showCloseButton = (message.type && message.type !== "dialog") || !this.props.messages[1],
          showNextButton = !!this.props.messages[1],

          messageView = <div className="notification">
                      <div className="message-text"> { t(text) } </div>
                      <div className="message-buttons">
                        { showCloseButton
                          ? <div className="close-button" onClick={ this.handleClose(this.props.onCloseButton, this.props.onCloseNotifications) }></div>
                          : null }
                        { showNextButton
                          ? <div className="next-arrow" onClick={ this.props.onAdvanceNotifications }></div>
                          : null }
                      </div>
                    </div>;

    return (
      <div className="geniblocks notification-container">
        { speaker }
        { messageView }
      </div>
    );
  }
}

export default Notifications;
