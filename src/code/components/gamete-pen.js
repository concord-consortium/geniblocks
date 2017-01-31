import React, {PropTypes} from 'react';
import { assign, map } from 'lodash';
import { toClass } from 'recompose';
import Dimensions from 'react-dimensions';
import GameteImageView from './gamete-image';

/**
 * @param {number} rows - Option number of rows. If defined, it will be fixed at that. Otherwise, it
 *                        will default to 1 when there are no orgs, and grows as more rows are needed.
 * @param {number} tightenRows - If given, will shrink the vertical height of the pen by this amount
 *                        per row, crowding the org images as needed.
 */
const GametePenView = ({id, sex, gametes, idPrefix='gamete-', gameteSize=1.0, showChromosomes=true, containerWidth, containerHeight, rows, columns, tightenRows=0, tightenColumns=0, selectedIndex, selectedColor='#FF6666', onClick}) => {

  function handleGameteClick(evt, gameteID) {
    const prefixIndex = gameteID.indexOf(idPrefix),
          gameteIndex = Number(gameteID.substr(prefixIndex + idPrefix.length));
    if (onClick) onClick(id, sex, gameteIndex, gameteID, gametes[gameteIndex]);
    evt.stopPropagation();
  }

  function handlePenClick(evt) {
    if (onClick) onClick(id, sex, null);
    evt.stopPropagation();
  }

  const availableWidth = containerWidth - 12,
        availableHeight = containerHeight - 4,
        gameteImageWidth = Math.ceil((sex === BioLogica.FEMALE ? 68 : 145) * gameteSize),
        gameteImageHeight = Math.ceil((sex === BioLogica.FEMALE ? 78 : 40) * gameteSize);
  let   effectiveWidth = gameteImageWidth * (1 - tightenColumns),
        effectiveHeight = gameteImageHeight * (1 - tightenRows),
        gametesPerRow = Math.floor(availableWidth / effectiveWidth);
  if (columns) {
    if (gametesPerRow < columns) {
      gametesPerRow = columns;
      tightenColumns = 1 - (availableWidth / gametesPerRow) / gameteImageWidth;
      effectiveWidth = gameteImageWidth * (1 - tightenColumns);
    }
  }
  if (rows) {
    const minColumns = Math.ceil(gametesPerRow / rows);
    if (minColumns > gametesPerRow) {
      tightenColumns = 1 - (availableWidth / minColumns) / gameteImageWidth;
      effectiveWidth = gameteImageWidth * (1 - tightenColumns);
      gametesPerRow = minColumns;
    }
  }
  else {
    rows = Math.ceil(gametes.length / columns);
  }
  if (availableHeight < Math.ceil(rows * effectiveHeight)) {
    tightenRows = 1 - (availableHeight / rows) / gameteImageHeight;
    effectiveHeight = gameteImageHeight * (1 - tightenRows);
  }

  function getGameteStyle(index) {
    const row = Math.floor(index / columns),
          indexInRow = index - (row * columns),
          xMargin = 2,
          yMargin = sex === BioLogica.MALE ? 14 : 2;
    return { position: 'absolute',
              left: xMargin + indexInRow * effectiveWidth,
              top: yMargin + row * effectiveHeight };
  }

  function shouldShowChromosomes(index) {
    if ((showChromosomes === 'all') || (showChromosomes === true)) return true;
    if ((showChromosomes === 'selected') && (index === selectedIndex)) return true;
    return false;
  }

  let isEgg = sex === BioLogica.FEMALE,
      gameteDefaultDisplayStyle = { size: gameteSize },
      gameteViews = gametes.map((gamete, index) => {
        const chromosomes = shouldShowChromosomes(index)
                              ? map(gamete, (side, name) => { return { name, side }; })
                              : [],
              className = index === selectedIndex ? 'selected' : '',
              eltStyle = getGameteStyle(index),
              gameteDisplayStyle = assign({}, gameteDefaultDisplayStyle,
                                          index === selectedIndex ? { fillColor: selectedColor } : null);
        return gamete != null
                ? <GameteImageView isEgg={isEgg} chromosomes={chromosomes} key={index}
                                    id={idPrefix + index} className={className}
                                    style={eltStyle} displayStyle={gameteDisplayStyle}
                                    onClick={handleGameteClick}/>
                : null;
      });

  let containerStyle = { position: 'relative' };

  return (
    <div id={id} className="geniblocks gamete-pen" style={containerStyle} onClick={handlePenClick}>
      { gameteViews }
    </div>
  );
};

GametePenView.propTypes = {
  id: PropTypes.string,
  sex: PropTypes.number.isRequired,
  gametes: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string,
  containerWidth: PropTypes.number,
  containerHeight: PropTypes.number,
  gameteSize: PropTypes.number,
  showChromosomes: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  rows: PropTypes.number,
  columns: PropTypes.number,
  tightenColumns: PropTypes.number,
  tightenRows: PropTypes.number,
  selectedIndex: PropTypes.number,
  selectedColor: PropTypes.string,
  onClick: PropTypes.func
};

const containerStyle = { height: 48, padding: 0, border: 0 };
// Use toClass() to wrap the stateless functional component in a class to eliminate warning about
// react-dimension's attempt to add a 'ref' to the wrapped component. If/when react-dimension merges
// https://github.com/digidem/react-dimensions/pull/51 or some other fix for the problem, the use
// of toClass() can be eliminated.
export default Dimensions({ className: 'gamete-pen-wrapper', containerStyle })(toClass(GametePenView));
