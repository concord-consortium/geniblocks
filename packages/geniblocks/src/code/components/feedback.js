import {PropTypes} from 'react';

/**
 * Implements a rectangular text area for providing feedback to users, such as
 * that used in Geniverse's challenges for providing trial and goal feedback.
 * Implemented as a React stateless functional component.
 *
 * @param {string|string[]} text - a single or multiple lines of text to display
 * @param {object} style - inline styles applied to the <div> containing each line of text
 */
const FeedbackView = ({text, style={}}) => {
  const tText = Array.isArray(text) ? text : [text],
        lineCount = tText.length,
        height = 20 * lineCount + 2,
        defaultStyle = { height: height, ...style },
        textLines = tText.map((iText, index) => 
                      <div className="geniblocks feedback text-line" key={index}>{iText}</div>);

  return (
    <div className="geniblocks feedback-view" style={defaultStyle}>
      {textLines}
    </div>
  );
};

FeedbackView.propTypes = {
  text: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string)
        ]).isRequired,
  style: PropTypes.object
};

export default FeedbackView;
