class CaseLog extends React.Component {

  static propTypes = {
    caseSpecs: React.PropTypes.arrayOf(
                React.PropTypes.shape({
                  title: React.PropTypes.string.isRequired,
                  className: React.PropTypes.string.isRequired,
                  column: React.PropTypes.number.isRequired,
                  component: React.PropTypes.func,
                  path: React.PropTypes.string,
                  enabled: React.PropTypes.bool.isRequired
                })
              ).isRequired,
    onCaseSelected: React.PropTypes.func.isRequired
  }

  render() {

    const props = this.props,
          mapCaseSpecToCaseLogEntry = function(iCaseSpec) {
      const onClick = iCaseSpec.path && iCaseSpec.enabled
                        ? function() { props.onCaseSelected(iCaseSpec.component); }
                        : null,
            disabledClass = iCaseSpec.enabled ? '' : 'case-disabled';
      return (
        <div className={`case caselog-active ${iCaseSpec.className} ${disabledClass}`}
              key={iCaseSpec.className} onClick={onClick}>
          <div className='title'>
            <div>{iCaseSpec.title}</div>
          </div>
        </div>
      );
    };

    const { caseSpecs } = this.props,
          col1Cases = caseSpecs
                        .filter(function(iCaseSpec) {
                          return iCaseSpec.column === 1;
                        })
                        .map(mapCaseSpecToCaseLogEntry),
          col2Cases = caseSpecs
                        .filter(function(iCaseSpec) {
                          return iCaseSpec.column === 2;
                        })
                        .map(mapCaseSpecToCaseLogEntry);

    return (
      <div className='caselog-view'>
        <div id='caselog-wrap'>
          <div id='caselog-book'>
            <div id='col1'>
              <div id='title'>
                <div className='title'>Case Log</div>
                <div className='section'>Training</div>
              </div>
              {col1Cases}
            </div>
            <div id='col2'>
              {col2Cases}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CaseLog;
