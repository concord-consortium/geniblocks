class Case1PlaygroundLeft extends React.Component {

  static propTypes = {
    sexLabels: React.PropTypes.arrayOf(React.PropTypes.string),
    drake: React.PropTypes.object.isRequired,
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
    onSexChange: React.PropTypes.func.isRequired,
    onAlleleChange: React.PropTypes.func.isRequired
  }

  render() {
    const { sexLabels, drake, hiddenAlleles } = this.props;
    return (
      <div id='left' className='column'>
        <GeniBlocks.ChangeSexButtons id='change-sex-buttons'
          sex={sexLabels[drake.sex]} onChange={this.props.onSexChange}
          species="Drake" showLabel={true}/>
        <GeniBlocks.GenomeView id='drake-genome'
          org={drake} hiddenAlleles={hiddenAlleles} onAlleleChange={this.props.onAlleleChange}
          style={{marginTop: 50, top: 50}}/>
      </div>
    );
  }
}

class Case1PlaygroundRight extends React.Component {

  static propTypes = {
    drake: React.PropTypes.object.isRequired,
    onAdvanceChallenge: React.PropTypes.func.isRequired
  }

  render() {
    const { drake } = this.props;
    return (
      <div id="right" className="column">
        <GeniBlocks.OrganismGlowView id='drake-image' org={drake} color='#FFFFAA' size={200}/>
        <GeniBlocks.Button id='advance-button' label="Bring It On!"
                            onClick={this.props.onAdvanceChallenge}/>
      </div>
    );
  }
}

class Case1Playground extends React.Component {

  static propTypes = {
    sexLabels: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    challengeSpec: React.PropTypes.shape({
      label: React.PropTypes.string.isRequired,
      isDrakeHidden: React.PropTypes.bool.isRequired,
      trialCount: React.PropTypes.number.isRequired,
      drakeAlleles: React.PropTypes.string.isRequired,
      hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string)
    }).isRequired,
    currChallenge: React.PropTypes.number.isRequired,
    lastChallenge: React.PropTypes.number.isRequired,
    onAdvanceChallenge: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    const { drakeAlleles } = props.challengeSpec,
          drakeSex = Math.floor(2 * Math.random());
    this.state = {
      drake: new BioLogica.Organism(BioLogica.Species.Drake, drakeAlleles, drakeSex)
    };
  }

  handleSexChange = (iSex) => {
    const { sexLabels } = this.props,
          { drakeAlleles } = this.props.challengeSpec;
    let { drake } = this.state;
    // replace alleles lost when switching to male and back
    const alleleString = GeniBlocks.GeneticsUtils.fillInMissingAllelesFromAlleleString(
                          drake.genetics, drake.getAlleleString(), drakeAlleles),
          sexOfDrake = sexLabels.indexOf(iSex);
    drake = new BioLogica.Organism(BioLogica.Species.Drake, alleleString, sexOfDrake);
    this.setState({ drake });
  }

  handleAlleleChange = (chrom, side, prevAllele, newAllele) => {
    let { drake } = this.state;
    drake.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
    drake = new BioLogica.Organism(BioLogica.Species.Drake, drake.getAlleleString(), drake.sex);
    this.setState({ drake });
  }

  render() {
    const { sexLabels } = this.props,
          { hiddenAlleles } = this.props.challengeSpec;
    const { drake } = this.state;
    return (
      <div id="playground-wrapper">
        <Case1PlaygroundLeft drake={drake} sexLabels={sexLabels}
                            hiddenAlleles={hiddenAlleles}
                            onSexChange={this.handleSexChange}
                            onAlleleChange={this.handleAlleleChange}/>
        <Case1PlaygroundRight drake={drake} onAdvanceChallenge={this.props.onAdvanceChallenge}/>
      </div>
    );
  }
}

export default Case1Playground;
