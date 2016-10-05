/*
 * See https://medium.com/@kentcdodds/misunderstanding-es6-modules-upgrading-babel-tears-and-a-solution-ad2d5ab93ce0#.q1vckffiw
 * (Kent C. Dodds, "Misunderstanding ES6 Modules, Upgrading Babel, Tears, and a Solution")
 * for description of some of the details involved in mixing ES6 export with require().
 */

// components
export { default as AlleleFiltersView } from './components/allele-filters';
export { default as AlleleView } from './components/allele';
export { default as AnimatedGameteView } from './components/animated-gamete';
export { default as AnimatedOrganismView } from './components/animated-organism';
export { default as Button } from './components/button';
export { default as ChangeSexButtons } from './components/change-sex-buttons';
export { default as ChromosomeImageView } from './components/chromosome-image';
export { default as ChromosomeView } from './components/chromosome';
export { default as CircularGlowView } from './components/circular-glow';
export { default as EggClutchView } from './components/egg-clutch';
export { default as FeedbackView } from './components/feedback';
export { default as FertilizingGameteView } from './components/fertilizing-gamete';
export { default as GametePoolView } from './components/gamete-pool';
export { default as GameteView } from './components/gamete';
export { default as GeneLabelView } from './components/gene-label';
export { default as GenomeTestView } from './components/genome-test';
export { default as GenomeView } from './components/genome';
export { default as GlowBackgroundView } from './components/glow-background';
export { default as ModalAlert } from './components/modal-alert';
export { default as OrdinalOrganismView } from './components/ordinal-organism';
export { default as OrganismView } from './components/organism';
export { default as OrganismGlowView } from './components/organism-glow';
export { default as PenView } from './components/pen';
export { default as PenStatsView } from './components/pen-stats';
export { default as QuestionGlowView } from './components/question-glow';
export { default as QuestionOrganismGlowView } from './components/question-organism-glow';
export { default as StatsView } from './components/stats';
export { default as ChallengeAwardView } from './components/challenge-award';

// utilities
export { default as GeneticsUtils } from './utilities/genetics-utils';
