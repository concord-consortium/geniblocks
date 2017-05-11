import React, {PropTypes} from 'react';
import classNames from 'classnames';
import t from '../utilities/translate';

/**
 * Stateless functional React component for displaying male/female change buttons
 * The appearance of the buttons is currently entirely controlled via external CSS.
 * @param {integer} sex - [BioLogica.MALE, BioLogica.FEMALE] currently selected button
 * @param {function} onChange(evt, sex) - callback to be called when use clicks to change sex
 */
const FVChangeSexToggle = ({sex, style={}, onChange}) => {
  const isMaleSelected = sex === BioLogica.MALE,
        isFemaleSelected = sex === BioLogica.FEMALE,
        selectedSexClass = isMaleSelected ? 'male-selected' : 'female-selected';

  function handleSexToggle() {
    switch (sex) {
      case BioLogica.MALE:
        onChange(BioLogica.FEMALE);
        break;
      case BioLogica.FEMALE:
        onChange(BioLogica.MALE);
        break;
      default:
        console.log("Unhandled sex selected");
    }
  }

  return (
    <div className='geniblocks change-sex-toggle-group'>
      <div className={classNames('sex-label female-label', { selected: isFemaleSelected })} onClick={handleSexToggle}>
        {t('~BUTTON.FEMALE')}
      </div>
      <div className={`change-sex-toggle ${selectedSexClass}`} style={style} >
        <div className={classNames('toggle-button female-button', { selected: isFemaleSelected })}
              onClick={handleSexToggle}></div>
        <div className={classNames('toggle-button male-button', { selected: isMaleSelected })}
              onClick={handleSexToggle}></div>
      </div>
      <div className={classNames('sex-label male-label', { selected: isMaleSelected })} onClick={handleSexToggle}>
        {t('~BUTTON.MALE')}
      </div>
    </div>
  );
};

FVChangeSexToggle.propTypes = {
  sex: PropTypes.oneOf([BioLogica.MALE, BioLogica.FEMALE]),
  style: PropTypes.object,
  onChange: PropTypes.func.isRequired
};

export default FVChangeSexToggle;
