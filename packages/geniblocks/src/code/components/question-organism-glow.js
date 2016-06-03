import {PropTypes} from 'react';
import OrganismGlowView from './organism-glow';
import QuestionGlowView from './question-glow';

const QuestionOrganismGlowView = ({hidden, color, size, ...other}) => {
  const orgView = <OrganismGlowView color={color} size={size} {...other} />,
        questionView = <QuestionGlowView glowColor={color} width={size} />,
        finalView = hidden ? questionView : orgView;

  return (
    <div className="geniblocks question-organism-glow">
      {finalView}
    </div>
  );
};

QuestionOrganismGlowView.propTypes = {
  hidden: PropTypes.bool,
  color: PropTypes.string.isRequired,
  size: PropTypes.number
};

export default QuestionOrganismGlowView;
