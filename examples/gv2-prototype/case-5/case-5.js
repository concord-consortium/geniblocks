/**
 * Case 5 Certification Challenge
 *
 * The code in this module was written to support a recreation of the certification
 * challenge from Case 5 in Geniverse. The challenge is to choose a set of alleles
 * for the mother drake, breed a clutch of offspring, and then use the results to
 * deduce the alleles of the father drake.
 */
import DrakeGenomeColumn from '../js/drake-genome-column';

/**
 * Center panel has breed button and breeding pen
 */
class BreedButtonAndPenView extends React.Component {

  static propTypes = {
    clutch: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    clutchSize: React.PropTypes.number.isRequired,
    onBreed: React.PropTypes.func.isRequired
  }

  handleBreed = () => {
    this.setState({ selectedIndex: null });
    if (this.props.onBreed)
      this.props.onBreed();
  }

  render() {
    const { clutch, clutchSize } = this.props;
    return (
      <div id='center' className='column'>
        <GeniBlocks.Button id="breed-button" label="Breed" onClick={this.handleBreed} />
        <GeniBlocks.PenStatsView id="breeding-pen" orgs={clutch} lastClutchSize={clutchSize} />
      </div>
    );
  }
}

/*
 * Right panel has father drake, "Ready to answer" button, and overlay test
 */
class Case5RightColumn extends React.Component {

  static propTypes = {
    org: React.PropTypes.object.isRequired,
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    testSelection: React.PropTypes.object.isRequired,
    toggleTest: React.PropTypes.func.isRequired,
    onGeneSelected: React.PropTypes.func.isRequired,
    onCheckAnswer: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    const { toggleTest, onCheckAnswer } = this.props;
    document.getElementsByClassName('toggle-test-button')[0].onclick = toggleTest;
    document.getElementsByClassName('toggle-test-button')[1].onclick = toggleTest;
    document.getElementById('submit-button').onclick = onCheckAnswer;
  }

  render() {
    const { org, hiddenAlleles, testSelection } = this.props;

    return(
      <div id='right' className='column'>
        {/* parent drake label */}
        <div id='father-drake-label' className='column-label'>Male Drake</div>

        <GeniBlocks.OrganismGlowView org={org} id='father' size={200} color='#FFFFAA' />
        <div id='father-genome-unknown'>?</div>
        <div id='test-wrapper'>
          <GeniBlocks.GenomeTestView id='father-genome-test'
                                    org={org} hiddenAlleles={hiddenAlleles}
                                    selection={testSelection}
                                    onSelectionChange={this.props.onGeneSelected} />
          <GeniBlocks.Button className='toggle-test-button' label="Return to Lab" />
          <GeniBlocks.Button id='submit-button' label="Submit!" />
        </div>
        <GeniBlocks.Button className='toggle-test-button' label="Ready to answer" />
      </div>);
  }
}

/*
 * Case 5 combines the mother genome (left), breeding area (center), father genome test (right)
 */
class Case5 extends React.Component {

  static propTypes = {
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
    initialMotherAlleles: React.PropTypes.string.isRequired,
    fatherAlleles: React.PropTypes.string.isRequired,
    clutchSize: React.PropTypes.number,
    onCompleteCase: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    hiddenAlleles: [],
    clutchSize: 20
  }

  state = {
    mother: null,
    father: null,
    offspring: [],
    clutch: [],
    testSelection: {},
    showingTest: false
  }

  static userStates = {
    NORMAL: 'normal',
    ALERT_INCOMPLETE: 'alert-incomplete',
    ALERT_CORRECT: 'alert-correct',
    ALERT_INCORRECT: 'alert-incorrect'
  }

  resetChallenge = () => {
    if (this.state.showingTest)
      this.toggleTest();

    const { initialMotherAlleles, fatherAlleles } = this.props;
    this.setState({
      mother: new BioLogica.Organism(BioLogica.Species.Drake, initialMotherAlleles, BioLogica.FEMALE),
      father: new BioLogica.Organism(BioLogica.Species.Drake, fatherAlleles, BioLogica.MALE),
      offspring: [],
      clutch: [],
      testSelection: {},
      showingTest: false,
      userState: Case5.userStates.NORMAL
    });
  }

  componentWillMount() {
    this.resetChallenge();
  }

  handleAlleleChange = (chrom, side, prevAllele, newAllele) => {
    let { mother } = this.state;
    mother.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
    mother = new BioLogica.Organism(BioLogica.Species.Drake,
                                    mother.getAlleleString(),
                                    BioLogica.FEMALE);
    this.setState({ mother, offspring: [], clutch: [] });
  }

  handleBreed = () => {
    const { clutchSize } = this.props;
    let   { offspring, clutch } = this.state,
          count = clutchSize;
    clutch = [];
    while (count--) {
      var child = BioLogica.breed(this.state.mother, this.state.father);
      clutch.push(child);
      offspring.push(child);
    }
    this.setState({ offspring, clutch });
  }

  toggleTest = () => {
    let { showingTest } = this.state;
    showingTest = !showingTest;
    this.setState({ showingTest });

    var display = showingTest ? "block" : "none";
    document.getElementById("overlay").style.display = display;
    document.getElementById("test-wrapper").style.display = display;
  }

  handleGeneSelected = (gene, newValue) => {
    let { testSelection } = this.state;
    testSelection[gene.name] = newValue;
    this.setState({ testSelection });
  }

  handleCheckAnswer = () => {
    let allSelectedAlleles = [],
        alleleString = this.state.father.getAlleleString(),
        alleleStringLength = alleleString.length,
        testAllele,
        success = true;

    // hard-coded check to see if user has made all four choices
    if (Object.keys(this.state.testSelection).length !== 4) {
      this.setState({ userState: Case5.userStates.ALERT_INCOMPLETE });
      return;
    }

    for (const geneName in this.state.testSelection) {
      const alleles = this.state.father.species.geneList[geneName].alleles,
            selectedAlleles = this.state.testSelection[geneName].split(" ").map(num => alleles[num]);
      allSelectedAlleles = allSelectedAlleles.concat(selectedAlleles);
    }
    while (success && (testAllele = allSelectedAlleles.pop())) {
      alleleString = alleleString.replace(`:${testAllele}`, "");
      if (alleleString.length === alleleStringLength) {
        success = false;
      }
      alleleStringLength = alleleString.length;
    }
    const userState = success ? Case5.userStates.ALERT_CORRECT
                              : Case5.userStates.ALERT_INCORRECT;
    this.setState({ userState });
  }

  handleCloseAlert = () => {
    this.setState({ userState: Case5.userStates.NORMAL });
  }

  render() {
    const { hiddenAlleles, clutchSize } = this.props;
    let showAlert, message, leftButton = {}, rightButton = {};
    switch (this.state.userState) {
      case Case5.userStates.ALERT_INCOMPLETE:
        showAlert = true;
        message = "First make a selection for all four genes!";
        leftButton = null;
        rightButton.label = "OK";
        rightButton.onClick = this.handleCloseAlert;
        break;
      case Case5.userStates.ALERT_INCORRECT:
        showAlert = true;
        message = "Sorry, that's not correct";
        leftButton = null;
        rightButton.label = "Try Again";
        rightButton.onClick = this.handleCloseAlert;
        break;
      case Case5.userStates.ALERT_CORRECT:
        showAlert = true;
        message = "That's correct!";
        leftButton.label = "Try Again";
        leftButton.onClick = this.resetChallenge;
        rightButton.label = "Case Log";
        rightButton.onClick = this.props.onCompleteCase;
        break;
    }
    return (
      <div id='case-backdrop'>
        <div id='case-5'>
          <div className='column-wrapper'>
            <DrakeGenomeColumn
                  id='left' idPrefix='female' className='column'
                  columnLabel="Female Drake"
                  drake={this.state.mother} sex='female'
                  editable={true}
                  hiddenAlleles={hiddenAlleles}
                  onAlleleChange={this.handleAlleleChange} />
            <BreedButtonAndPenView id='center' className='column'
                                  clutch={this.state.clutch} clutchSize={clutchSize}
                                  onBreed={this.handleBreed}/>
            <Case5RightColumn id='right' className='column' 
                              org={this.state.father} hiddenAlleles={hiddenAlleles}
                              testSelection={this.state.testSelection}
                              toggleTest={this.toggleTest}
                              onGeneSelected={this.handleGeneSelected}
                              onCheckAnswer={this.handleCheckAnswer} />
            <GeniBlocks.ModalAlert
                  show={showAlert} message={message}
                  leftButton={leftButton} rightButton={rightButton}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Case5;
