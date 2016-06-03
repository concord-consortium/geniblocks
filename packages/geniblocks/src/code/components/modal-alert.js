/*
 * Based on ReactOverlays demo at http://react-bootstrap.github.io/react-overlays/examples/#modals
 */
import Modal from 'react-overlays/lib/Modal';
import Button from './button';
import { PropTypes } from 'react';

const modalStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0, bottom: 0, left: 0, right: 0
};

const backdropStyle = {
  ...modalStyle,
  zIndex: 'auto',
  backgroundColor: '#000',
  opacity: 0.1
};

const dialogStyle = function() {
  // we use some psuedo random coords so nested modals
  // don't sit right on top of each other.
  let top = 50;
  let left = 50;

  return {
    position: 'absolute',
    width: 400,
    top: top + '%', left: left + '%',
    transform: `translate(-${top}%, -${left}%)`,
    border: '1px solid #e5e5e5',
    backgroundColor: 'white',
    boxShadow: '0 5px 15px rgba(0,0,0,.5)',
    padding: 20
  };
};


class ModalAlert extends React.Component {

  static propTypes = {
    show: PropTypes.bool,
    message: PropTypes.string,
    explanation: PropTypes.string,
    leftButton: PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func
    }),
    rightButton: PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func
    }),
    onHide: PropTypes.func
  }

  static defaultProps = {
    show: false
  }

  render() {
    /* eslint react/jsx-handler-names: 0 */
    const leftProps = this.props.leftButton || {},
          leftButton = leftProps
                        ? <Button label={leftProps.label || ""}
                                  onClick={leftProps.onClick}/>
                        : null,
          rightProps = this.props.rightButton || {},
          rightButton = <Button label={rightProps.label || ""}
                                onClick={rightProps.onClick}/>;

    return (
      <Modal  aria-labelledby='modal-label'
              style={modalStyle}
              backdropStyle={backdropStyle}
              show={this.props.show}
              onHide={this.props.onHide} >
        <div style={dialogStyle()} >
          <h4 id='modal-label'>{this.props.message}</h4>
          <p>{this.props.explanation}</p>
          {leftButton} {rightButton}
        </div>
      </Modal>
    );
  }
}

export default ModalAlert;

