/*
 * Based on ReactOverlays demo at http://react-bootstrap.github.io/react-overlays/examples/#modals
 */
import React, { PropTypes } from 'react';
import t from '../utilities/translate';

class Notifications extends React.Component {

  static propTypes = {
    messages: PropTypes.array,
    defaultCharacter: PropTypes.string,
    closeButton: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    arrowAsCloseButton: PropTypes.bool,       // uses the arrow as a close button
    onCloseButton: PropTypes.func,
    onAdvanceNotifications: PropTypes.func.isRequired,
    onCloseNotifications: PropTypes.func.isRequired,
    isRaised: PropTypes.bool,
    systemMessage: PropTypes.string
  }

  static defaultProps = {
    messages: []
  }

  handleClose(onCloseButton, onCloseNotifications) {
    return () => {
      onCloseNotifications();
      if (onCloseButton) {
        onCloseButton();
      }
    };
  }

  render() {
    if (!this.props.messages || !this.props.messages[0]) {
      return null;
    }
    const message = this.props.messages[0],
          isSystemMessage = !!this.props.systemMessage,
          text = message.text,
          character = message.character ? message.character : !isSystemMessage ? this.props.defaultCharacter : "SYSTEM",
          speaker = <div className={`fv-character ${character}`}></div>,
            // don't show close button if there's more narrative dialog
          isNarrative = message.type && message.type === "narrative",
          systemMessageStyle = ` system-message ${this.props.systemMessage}`,
          showCloseButton = !!this.props.closeButton && (!isNarrative || !this.props.messages[1]) && !this.props.arrowAsCloseButton,
          showNextButton = !!this.props.messages[1] || this.props.arrowAsCloseButton,
          isRaised = this.props.isRaised,
          onClose = this.handleClose(this.props.onCloseButton, this.props.onCloseNotifications),
          className = `notification${isNarrative ? "" : isSystemMessage ? systemMessageStyle : " its-hint"}${isRaised ? " raised" : ""}`,

          messageView = <div className={ className }>
            <div className="message-text"> {t(text)} </div>
                      <div className="message-buttons">
                        { showCloseButton
                          ? <div className="close-button" onClick={ onClose }></div>
                          : null }
                        { showNextButton
                          ? <div className="next-arrow" onClick={ this.props.arrowAsCloseButton ? onClose : this.props.onAdvanceNotifications }></div>
                          : null }
                      </div>
                    </div>,

          traitHighlightView = message.trait ? (
            [
              <div className={`hint-arrow ${message.trait}`} />,
              <div className={`hint-arrow-second-parent ${message.trait}`} />
            ]
      ) : null;

    return (
      <div className="geniblocks notification-container">
        { speaker }
        { messageView }
        { traitHighlightView }
      </div>
    );
  }
}

export default Notifications;
