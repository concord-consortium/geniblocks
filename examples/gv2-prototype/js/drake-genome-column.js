/**
 * DrakeGenomeColumn - shows drake image and genome
 */
class DrakeGenomeColumn extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    idPrefix: React.PropTypes.string.isRequired,
    columnLabel: React.PropTypes.string,
    drake: React.PropTypes.object.isRequired,
    showDrake: React.PropTypes.bool,
    editable: React.PropTypes.bool.isRequired,
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
    onAlleleChange: React.PropTypes.func.isRequired,
    buttonID: React.PropTypes.string,
    buttonLabel: React.PropTypes.string,
    onButtonClick: React.PropTypes.func
  }

  static defaultProps = {
    columnLabel: "",
    showDrake: true
  }

  render() {
    const { id, idPrefix, columnLabel, drake, showDrake, editable,
            hiddenAlleles, buttonID, buttonLabel } = this.props,
          drakeLabelID = `${idPrefix}-drake-label`,
          drakeOrgID = `${idPrefix}-drake`,
          drakeImage = showDrake
                        ? <GeniBlocks.OrganismGlowView id={drakeOrgID} className='parent-drake' 
                            org={drake} color='#FFFFAA' size={200} />
                        : null,
          button = buttonID
                    ? <GeniBlocks.Button id={buttonID} label={buttonLabel}
                                          onClick={this.props.onButtonClick}/>
                    : null;
    return (
      <div id={id} className='column'>

        {/* column label */}
        <div id={drakeLabelID} className="column-label">{columnLabel}</div>

        {/* optional drake image */}
        {drakeImage}

        {/* drake genome */}
        <GeniBlocks.GenomeView
          className='parent-genome' org={drake} hiddenAlleles={hiddenAlleles}
          editable={editable} onAlleleChange={this.props.onAlleleChange} />

        {/* optional button */}
        {button}
      </div>
    );
  }
}

export default DrakeGenomeColumn;
