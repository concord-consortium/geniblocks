import 'babel-polyfill';
import Case1 from './case-1/case-1';
import Case1Challenge from './case-1/challenge';
import Case1Playground from './case-1/playground';
import Case3 from './case-3/case-3';
import Case5 from './case-5/case-5';
import CaseLog from './case-log/case-log';
import Logger from './cc-logger';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

/*
 * These globals are representative of the kind of state that would be part
 * of an initial configuration of the application, e.g. such as that specified
 * by an author that would be loaded into the application initially.
 * Down the road we expect this state to be managed by Redux.
 */
const caseSpecs = [
  { title: "Case 1: Enter the Drake", className: 'case0', column: 1, 
    component: Case1, path: '/case-1', enabled: true },
  { title: "Case 2: My, Oh Sis!", className: 'case1', column: 1,
    component: undefined, path: undefined, enabled: false },
  { title: "Case 3: In the Clutches of Drakes", className: 'case2', column: 2,
    component: Case3, path: '/case-3', enabled: true },
  { title: "Case 4: Traits and Mates", className: 'case3', column: 2,
    component: undefined, path: undefined, enabled: false },
  { title: "Case 5: Certification", className: 'case4', column: 2,
    component: Case5, path: '/case-5', enabled: true }
];

const { MALE, FEMALE } = BioLogica,
      kSexLabels = ['male', 'female'],
      kInitialAlleles = "a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
      kHiddenAlleles = ['t','tk','h','c','a','b','d','bog','rh'],
      kClutchSize = 20,

      /*
       * Case 1
       */
      kCase1ChallengeSpecs = [
        { label: 'playground', Component: Case1Playground, isDrakeHidden: false, trialCount: 1,
          drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles },
        { label: 'challenge-0', Component: Case1Challenge, isDrakeHidden: false, trialCount: 1,
          drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles },
        { label: 'challenge-1', Component: Case1Challenge, isDrakeHidden: true, trialCount: 1,
          drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles },
        { label: 'challenge-2', Component: Case1Challenge, isDrakeHidden: true, trialCount: 3,
          drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles }
      ],

      /*
       * Case 3
       */
      kEditableAlleles = ['m','w','fl','hl'],
      kCase3ChallengeSpecs = [
        { // Challenge 1: female is editable, male is fixed, one target drake
          label: 'challenge-1',
          targetDrakeCount: 1,
          fixedParentSex: MALE,
          editableParentSex: FEMALE,
          initialAlleles: kInitialAlleles,
          hiddenAlleles: kHiddenAlleles,
          editableAlleles: kEditableAlleles
        },
        { // Challenge 2: male is editable, female is fixed, two target drakes
          label: 'challenge-2',
          targetDrakeCount: 2,
          fixedParentSex: FEMALE,
          editableParentSex: MALE,
          initialAlleles: kInitialAlleles,
          hiddenAlleles: kHiddenAlleles,
          editableAlleles: kEditableAlleles
        }
      ],

      /*
       * Case 5
       */
      kFatherAlleles = "a:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,a:D,a:W,a:fl,b:fl,a:Hl,a:t,b:T,a:rh,a:Bog,b:Bog",
      kInitialMotherAlleles = "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog";

/*
 * These "Connected" components tie the application state (represented by the global
 * variables above) to the individual case and case log components along with their
 * router paths. Once the application state is being managed by Redux, that part of
 * the connection would be handled by Redux's connect() function (hence the name).
 */
class CaseLogConnected extends React.Component {

  static contextTypes = {
      router: React.PropTypes.object.isRequired
  }

  handleCaseSelected = (iComponent) => {
    const caseSpec = caseSpecs.find(function(iCaseSpec) { return iCaseSpec.component === iComponent; }),
          path = caseSpec && caseSpec.path;
    if (path) {
      this.context.router.push(path);
    }
  }

  render() {
    return (
      <CaseLog caseSpecs={caseSpecs} onCaseSelected={this.handleCaseSelected}/>
    );
  }
}

/*
 * Placeholder app component that could eventually contain a toolbar, etc.j
 */
class GV2 extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired
  }

  render() {
    return (
      <div id='GV2'>
        {this.props.children}
      </div>
    );
  }
}

/*
 * These "Connected" component wrappers handle passing parameters to the cases and
 * tying into the router. The variability in Case API could be simplified by having
 * every case take a single configuration object and return (via onCompleteCase())
 * a single results object. This would then allow a single higher-order-component
 * function to connect the case to its routes analogous to the way Redux's connect()
 * can connect different components.
 */
class Case1Connected extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  handleCaseCompleted = (iResults) => {
    iResults; // do something with iResults
    this.context.router.push('/');
  }

  render() {
    const caseSpec = caseSpecs.find(function(iCaseSpec) { return iCaseSpec.component === Case1; });
    return (
      <Case1 sexLabels={kSexLabels}
              caseSpec={caseSpec}
              challengeSpecs={kCase1ChallengeSpecs}
              onCompleteCase={this.handleCaseCompleted}/>
    );
  }
}

class Case3Connected extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  handleCaseCompleted = (iResults) => {
    iResults; // do something with iResults
    this.context.router.push('/');
  }

  render() {
    const caseSpec = caseSpecs.find(function(iCaseSpec) { return iCaseSpec.component === Case3; });
    return (
      <Case3 caseSpec={caseSpec}
              challengeSpecs={kCase3ChallengeSpecs}
              onCompleteCase={this.handleCaseCompleted}/>
    );
  }
}

class Case5Connected extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  handleCaseCompleted = (iResults) => {
    iResults; // do something with iResults
    this.context.router.push('/');
  }

  render() {
    const caseSpec = caseSpecs.find(function(iCaseSpec) { return iCaseSpec.component === Case3; });
    return (
      <Case5 caseSpec={caseSpec}
              hiddenAlleles={kHiddenAlleles}
              fatherAlleles={kFatherAlleles}
              initialMotherAlleles={kInitialMotherAlleles}
              clutchSize={kClutchSize}
              onCompleteCase={this.handleCaseCompleted}/>
    );
  }
}

/*
 * Kick off the GV2 application
 */
GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

const user = '',  // get from context or state?
      ccLoggerUrl = `//learn.concord.org/dataservice/bucket_loggers/name/${user}/bucket_log_items.bundle`,
      loggerConfig = { console: true, endPoints: [] };
// add an endpoint for the CC log server if we have a username
if (user)
  loggerConfig.endPoints.push({ url: ccLoggerUrl });

ReactDOM.render((
  <Logger application="GV2Test" config={loggerConfig}>
    {/* Note: switch to browserHistory for production deployment.
        Requires server configuration, however, so hashHistory is preferred for
        development and for Github pages deployment. */}
    <Router history={hashHistory}>
      <Route path="/" component={GV2}>

        <IndexRoute component={CaseLogConnected}/>

        {/* should extend the routes to include the challenge level as well */}
        <Route path="case-1" component={Case1Connected}/>
        <Route path="case-3" component={Case3Connected}/>
        <Route path="case-5" component={Case5Connected}/>
      </Route>
    </Router>
  </Logger>
), document.getElementById('wrapper'));
