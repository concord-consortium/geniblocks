import React, {PropTypes} from 'react';

/**
 * Stateless functional React component for displaying male/female change buttons
 * The appearance of the buttons is currently entirely controlled via external CSS.
 * @param {string} sex - ['male' | 'female'] currently selected button
 * @param {function} onChange(evt, sex) - callback to be called when use clicks to change sex
 */
const ChangeSexButtons = ({id, sex, species, showLabel, style={}, onChange}) => {
  const capSex = sex.substr(0, 1).toUpperCase() + sex.substr(1),
        selectedSexClass = sex === 'male' ? 'male-selected' : 'female-selected',
        BUTTON_IMAGE_WIDTH = 100,
        BUTTON_IMAGE_MIDPOINT_X = BUTTON_IMAGE_WIDTH / 2,
        imageStyle = { position: 'absolute', ...style },
        label = showLabel ? `${capSex} ${species}` : '',
        labelElement = showLabel ? <div style={{position: 'absolute',
                                                fontSize: '14pt',
                                                fontWeight: 'bold',
                                                color: 'white',
                                                left: BUTTON_IMAGE_WIDTH,
                                                whiteSpace: 'nowrap',
                                                marginLeft: 10}}>{label}</div> : '';

  function handleClick(evt) {
    const eltRect = evt.target.getBoundingClientRect(),
          clickX = evt.clientX - eltRect.left;
    if ((sex === 'male') !== (clickX > BUTTON_IMAGE_MIDPOINT_X))
      onChange(sex === 'male' ? 'female' : 'male');
  }

  return (
    <div id={id} style={{position: 'relative'}}>
      <div  className={`geniblocks change-sex-buttons ${selectedSexClass}`}
            style={imageStyle} onClick={handleClick} >
      </div>
      {labelElement}
    </div>
  );
};

ChangeSexButtons.propTypes = {
  id: PropTypes.string,
  sex: PropTypes.oneOf(['male', 'female']).isRequired,
  species: PropTypes.string,
  showLabel: PropTypes.bool,
  style: PropTypes.object,
  onChange: PropTypes.func.isRequired
};

export default ChangeSexButtons;
