import React, {PropTypes} from 'react';
import AnimatedGameteView from './animated-gamete';

const GametePoolView = ({gametes, hiddenAlleles=[], width=300, height=200, animStiffness=60, selectedId, isGameteDisabled, onGameteSelected}) => {
  let gameteCount = gametes.length,
      gameteSize = 30,
      margin = 5,
      spacingDefault = gameteSize + 2 * margin,
      xSpacing = spacingDefault,
      ySpacing = spacingDefault,
      colDefault = Math.floor(width / spacingDefault),
      rowDefault = Math.floor(height / spacingDefault),
      enabledCount = 0,
      disabledCount = 0,
      disabledFlags = isGameteDisabled ? gametes.map(g => isGameteDisabled(g)) : [],
      totalDisabledCount = disabledFlags.reduce((total,flag) => total + flag, 0),
      // leave room for the disabled gamete row if there are disabled gametes
      availableHeight = height - (totalDisabledCount ? spacingDefault : 0) - 4 * margin,
      // pack the disabled gametes into the disabled row
      xDisabledSpacing = Math.min(xSpacing / 2,
                                  (width - 7 * margin) / totalDisabledCount),
      yDisabledSpacing = spacingDefault,
      totalEnabledCount = gameteCount - totalDisabledCount,
      gameteViews;

  // squeeze in to make room for additional gametes if necessary
  var colCount = colDefault,
      rowCount = rowDefault - (totalDisabledCount > 0);
  while (colCount * rowCount < totalEnabledCount) {
    if (ySpacing > xSpacing) {
      ySpacing = availableHeight / ++rowCount;
    }
    else {
      xSpacing = (width - 4 * margin) / ++colCount;
    }
  }

  gameteViews = gametes.map((gamete, index) => {
    const isDisabled = disabledFlags[index],
          layoutIndex = isDisabled ? disabledCount++ : enabledCount++,
          row = isDisabled ? rowDefault - 1 : Math.floor(layoutIndex / colCount),
          col = isDisabled ? layoutIndex : layoutIndex % colCount,
          y = isDisabled ? row * yDisabledSpacing : row * ySpacing,
          x = isDisabled ? col * xDisabledSpacing : col * xSpacing;
    return (
      <AnimatedGameteView gamete={gamete} id={index + 1} key={index}
                          hiddenAlleles={hiddenAlleles}
                          initialDisplay={{ x: Math.round(width/2), y: -Math.round(ySpacing) }}
                          display={{ x: Math.round(x), y: Math.round(y) }}
                          animStiffness={animStiffness}
                          isSelected={index + 1 === selectedId}
                          isDisabled={isDisabled}
                          onClick={onGameteSelected} />
    );
  });

  return (
    <div className="geniblocks gamete-pool" style={{ width: width, height: height }}>
      { gameteViews }
    </div>
  );
};

GametePoolView.propTypes = {
  gametes: PropTypes.arrayOf(PropTypes.object).isRequired,
  hiddenAlleles: PropTypes.arrayOf(PropTypes.string),
  width: PropTypes.number,
  height: PropTypes.number,
  animStiffness: PropTypes.number,
  selectedId: PropTypes.number,
  isGameteDisabled: PropTypes.func,
  onGameteSelected: PropTypes.func
};

export default GametePoolView;
