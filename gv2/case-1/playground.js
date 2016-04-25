'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Case1PlaygroundLeft = function (_React$Component) {
  _inherits(Case1PlaygroundLeft, _React$Component);

  function Case1PlaygroundLeft() {
    _classCallCheck(this, Case1PlaygroundLeft);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Case1PlaygroundLeft).apply(this, arguments));
  }

  _createClass(Case1PlaygroundLeft, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var sexLabels = _props.sexLabels;
      var drake = _props.drake;
      var hiddenAlleles = _props.hiddenAlleles;

      return React.createElement(
        'div',
        { id: 'left', className: 'column' },
        React.createElement(GeniBlocks.ChangeSexButtons, { id: 'change-sex-buttons',
          sex: sexLabels[drake.sex], onChange: this.props.onSexChange,
          species: 'Drake', showLabel: true }),
        React.createElement(GeniBlocks.GenomeView, { id: 'drake-genome',
          org: drake, hiddenAlleles: hiddenAlleles, onAlleleChange: this.props.onAlleleChange,
          style: { marginTop: 50, top: 50 } })
      );
    }
  }]);

  return Case1PlaygroundLeft;
}(React.Component);

Case1PlaygroundLeft.propTypes = {
  sexLabels: React.PropTypes.arrayOf(React.PropTypes.string),
  drake: React.PropTypes.object.isRequired,
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  onSexChange: React.PropTypes.func.isRequired,
  onAlleleChange: React.PropTypes.func.isRequired
};

var Case1PlaygroundRight = function (_React$Component2) {
  _inherits(Case1PlaygroundRight, _React$Component2);

  function Case1PlaygroundRight() {
    _classCallCheck(this, Case1PlaygroundRight);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Case1PlaygroundRight).apply(this, arguments));
  }

  _createClass(Case1PlaygroundRight, [{
    key: 'render',
    value: function render() {
      var drake = this.props.drake;

      return React.createElement(
        'div',
        { id: 'right', className: 'column' },
        React.createElement(GeniBlocks.OrganismGlowView, { id: 'drake-image', org: drake, color: '#FFFFAA', size: 200 }),
        React.createElement(GeniBlocks.Button, { id: 'advance-button', label: 'Bring It On!',
          onClick: this.props.onAdvanceChallenge })
      );
    }
  }]);

  return Case1PlaygroundRight;
}(React.Component);

Case1PlaygroundRight.propTypes = {
  drake: React.PropTypes.object.isRequired,
  onAdvanceChallenge: React.PropTypes.func.isRequired
};

var Case1Playground = function (_React$Component3) {
  _inherits(Case1Playground, _React$Component3);

  function Case1Playground(props) {
    _classCallCheck(this, Case1Playground);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Case1Playground).call(this, props));

    _initialiseProps.call(_this3);

    var drakeAlleles = props.challengeSpec.drakeAlleles;
    var drakeSex = Math.floor(2 * Math.random());
    _this3.state = {
      drake: new BioLogica.Organism(BioLogica.Species.Drake, drakeAlleles, drakeSex)
    };
    return _this3;
  }

  _createClass(Case1Playground, [{
    key: 'render',
    value: function render() {
      var sexLabels = this.props.sexLabels;
      var hiddenAlleles = this.props.challengeSpec.hiddenAlleles;
      var drake = this.state.drake;

      return React.createElement(
        'div',
        { id: 'playground-wrapper' },
        React.createElement(Case1PlaygroundLeft, { drake: drake, sexLabels: sexLabels,
          hiddenAlleles: hiddenAlleles,
          onSexChange: this.handleSexChange,
          onAlleleChange: this.handleAlleleChange }),
        React.createElement(Case1PlaygroundRight, { drake: drake, onAdvanceChallenge: this.props.onAdvanceChallenge })
      );
    }
  }]);

  return Case1Playground;
}(React.Component);

Case1Playground.propTypes = {
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
};

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.handleSexChange = function (iSex) {
    var sexLabels = _this4.props.sexLabels;
    var drakeAlleles = _this4.props.challengeSpec.drakeAlleles;
    var drake = _this4.state.drake;
    // replace alleles lost when switching to male and back

    var alleleString = GeniBlocks.GeneticsUtils.fillInMissingAllelesFromAlleleString(drake.genetics, drake.getAlleleString(), drakeAlleles),
        sexOfDrake = sexLabels.indexOf(iSex);
    drake = new BioLogica.Organism(BioLogica.Species.Drake, alleleString, sexOfDrake);
    _this4.setState({ drake: drake });
  };

  this.handleAlleleChange = function (chrom, side, prevAllele, newAllele) {
    var drake = _this4.state.drake;

    drake.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
    drake = new BioLogica.Organism(BioLogica.Species.Drake, drake.getAlleleString(), drake.sex);
    _this4.setState({ drake: drake });
  };
};

Case1Playground;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhc2UtMS9wbGF5Z3JvdW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTTs7Ozs7Ozs7Ozs7NkJBVUs7bUJBQ3FDLEtBQUssS0FBTCxDQURyQztVQUNDLDZCQUREO1VBQ1kscUJBRFo7VUFDbUIscUNBRG5COztBQUVQLGFBQ0U7O1VBQUssSUFBRyxNQUFILEVBQVUsV0FBVSxRQUFWLEVBQWY7UUFDRSxvQkFBQyxXQUFXLGdCQUFaLElBQTZCLElBQUcsb0JBQUg7QUFDM0IsZUFBSyxVQUFVLE1BQU0sR0FBTixDQUFmLEVBQTJCLFVBQVUsS0FBSyxLQUFMLENBQVcsV0FBWDtBQUNyQyxtQkFBUSxPQUFSLEVBQWdCLFdBQVcsSUFBWCxFQUZsQixDQURGO1FBSUUsb0JBQUMsV0FBVyxVQUFaLElBQXVCLElBQUcsY0FBSDtBQUNyQixlQUFLLEtBQUwsRUFBWSxlQUFlLGFBQWYsRUFBOEIsZ0JBQWdCLEtBQUssS0FBTCxDQUFXLGNBQVg7QUFDMUQsaUJBQU8sRUFBQyxXQUFXLEVBQVgsRUFBZSxLQUFLLEVBQUwsRUFBdkIsRUFGRixDQUpGO09BREYsQ0FGTzs7OztTQVZMO0VBQTRCLE1BQU0sU0FBTjs7QUFBNUIsb0JBRUcsWUFBWTtBQUNqQixhQUFXLE1BQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBbkM7QUFDQSxTQUFPLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNQLGlCQUFlLE1BQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdkM7QUFDQSxlQUFhLE1BQU0sU0FBTixDQUFnQixJQUFoQixDQUFxQixVQUFyQjtBQUNiLGtCQUFnQixNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7OztJQWtCZDs7Ozs7Ozs7Ozs7NkJBT0s7VUFDQyxRQUFVLEtBQUssS0FBTCxDQUFWLE1BREQ7O0FBRVAsYUFDRTs7VUFBSyxJQUFHLE9BQUgsRUFBVyxXQUFVLFFBQVYsRUFBaEI7UUFDRSxvQkFBQyxXQUFXLGdCQUFaLElBQTZCLElBQUcsYUFBSCxFQUFpQixLQUFLLEtBQUwsRUFBWSxPQUFNLFNBQU4sRUFBZ0IsTUFBTSxHQUFOLEVBQTFFLENBREY7UUFFRSxvQkFBQyxXQUFXLE1BQVosSUFBbUIsSUFBRyxnQkFBSCxFQUFvQixPQUFNLGNBQU47QUFDbkIsbUJBQVMsS0FBSyxLQUFMLENBQVcsa0JBQVgsRUFEN0IsQ0FGRjtPQURGLENBRk87Ozs7U0FQTDtFQUE2QixNQUFNLFNBQU47O0FBQTdCLHFCQUVHLFlBQVk7QUFDakIsU0FBTyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDUCxzQkFBb0IsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBQXJCOzs7SUFlbEI7OztBQWdCSixXQWhCSSxlQWdCSixDQUFZLEtBQVosRUFBbUI7MEJBaEJmLGlCQWdCZTs7d0VBaEJmLDRCQWlCSSxRQURXOzs7O0FBR1gsUUFBRSxlQUFpQixNQUFNLGFBQU4sQ0FBakIsWUFBRixDQUhXO0FBSVgsbUJBQVcsS0FBSyxLQUFMLENBQVcsSUFBSSxLQUFLLE1BQUwsRUFBSixDQUF0QixDQUpXO0FBS2pCLFdBQUssS0FBTCxHQUFhO0FBQ1gsYUFBTyxJQUFJLFVBQVUsUUFBVixDQUFtQixVQUFVLE9BQVYsQ0FBa0IsS0FBbEIsRUFBeUIsWUFBaEQsRUFBOEQsUUFBOUQsQ0FBUDtLQURGLENBTGlCOztHQUFuQjs7ZUFoQkk7OzZCQTZDSztBQUNELFVBQUUsWUFBYyxLQUFLLEtBQUwsQ0FBZCxTQUFGLENBREM7VUFFQyxnQkFBa0IsS0FBSyxLQUFMLENBQVcsYUFBWCxDQUFsQixjQUZEO1VBR0MsUUFBVSxLQUFLLEtBQUwsQ0FBVixNQUhEOztBQUlQLGFBQ0U7O1VBQUssSUFBRyxvQkFBSCxFQUFMO1FBQ0Usb0JBQUMsbUJBQUQsSUFBcUIsT0FBTyxLQUFQLEVBQWMsV0FBVyxTQUFYO0FBQ2YseUJBQWUsYUFBZjtBQUNBLHVCQUFhLEtBQUssZUFBTDtBQUNiLDBCQUFnQixLQUFLLGtCQUFMLEVBSHBDLENBREY7UUFLRSxvQkFBQyxvQkFBRCxJQUFzQixPQUFPLEtBQVAsRUFBYyxvQkFBb0IsS0FBSyxLQUFMLENBQVcsa0JBQVgsRUFBeEQsQ0FMRjtPQURGLENBSk87Ozs7U0E3Q0w7RUFBd0IsTUFBTSxTQUFOOztBQUF4QixnQkFFRyxZQUFZO0FBQ2pCLGFBQVcsTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF4QixDQUFnRCxVQUFoRDtBQUNYLGlCQUFlLE1BQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQjtBQUNuQyxXQUFPLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNQLG1CQUFlLE1BQU0sU0FBTixDQUFnQixJQUFoQixDQUFxQixVQUFyQjtBQUNmLGdCQUFZLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNaLGtCQUFjLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNkLG1CQUFlLE1BQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdkM7R0FMYSxFQU1aLFVBTlk7QUFPZixpQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDZixpQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDZixzQkFBb0IsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBQXJCOzs7Ozs7T0FhdEIsa0JBQWtCLFVBQUMsSUFBRCxFQUFVO0FBQ3BCLFFBQUUsWUFBYyxPQUFLLEtBQUwsQ0FBZCxTQUFGLENBRG9CO1FBRWxCLGVBQWlCLE9BQUssS0FBTCxDQUFXLGFBQVgsQ0FBakIsYUFGa0I7UUFHcEIsUUFBVSxPQUFLLEtBQUwsQ0FBVjs7QUFIb0I7QUFLMUIsUUFBTSxlQUFlLFdBQVcsYUFBWCxDQUF5QixvQ0FBekIsQ0FDQyxNQUFNLFFBQU4sRUFBZ0IsTUFBTSxlQUFOLEVBRGpCLEVBQzBDLFlBRDFDLENBQWY7UUFFQSxhQUFhLFVBQVUsT0FBVixDQUFrQixJQUFsQixDQUFiLENBUG9CO0FBUTFCLFlBQVEsSUFBSSxVQUFVLFFBQVYsQ0FBbUIsVUFBVSxPQUFWLENBQWtCLEtBQWxCLEVBQXlCLFlBQWhELEVBQThELFVBQTlELENBQVIsQ0FSMEI7QUFTMUIsV0FBSyxRQUFMLENBQWMsRUFBRSxZQUFGLEVBQWQsRUFUMEI7R0FBVjs7T0FZbEIscUJBQXFCLFVBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxVQUFkLEVBQTBCLFNBQTFCLEVBQXdDO1FBQ3JELFFBQVUsT0FBSyxLQUFMLENBQVYsTUFEcUQ7O0FBRTNELFVBQU0sUUFBTixDQUFlLFFBQWYsQ0FBd0Isc0JBQXhCLENBQStDLEtBQS9DLEVBQXNELElBQXRELEVBQTRELFVBQTVELEVBQXdFLFNBQXhFLEVBRjJEO0FBRzNELFlBQVEsSUFBSSxVQUFVLFFBQVYsQ0FBbUIsVUFBVSxPQUFWLENBQWtCLEtBQWxCLEVBQXlCLE1BQU0sZUFBTixFQUFoRCxFQUF5RSxNQUFNLEdBQU4sQ0FBakYsQ0FIMkQ7QUFJM0QsV0FBSyxRQUFMLENBQWMsRUFBRSxZQUFGLEVBQWQsRUFKMkQ7R0FBeEM7OztBQXVCdkIiLCJmaWxlIjoiY2FzZS0xL3BsYXlncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBDYXNlMVBsYXlncm91bmRMZWZ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHNleExhYmVsczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZyksXG4gICAgZHJha2U6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBvblNleENoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkFsbGVsZUNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgc2V4TGFiZWxzLCBkcmFrZSwgaGlkZGVuQWxsZWxlcyB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD0nbGVmdCcgY2xhc3NOYW1lPSdjb2x1bW4nPlxuICAgICAgICA8R2VuaUJsb2Nrcy5DaGFuZ2VTZXhCdXR0b25zIGlkPSdjaGFuZ2Utc2V4LWJ1dHRvbnMnXG4gICAgICAgICAgc2V4PXtzZXhMYWJlbHNbZHJha2Uuc2V4XX0gb25DaGFuZ2U9e3RoaXMucHJvcHMub25TZXhDaGFuZ2V9XG4gICAgICAgICAgc3BlY2llcz1cIkRyYWtlXCIgc2hvd0xhYmVsPXt0cnVlfS8+XG4gICAgICAgIDxHZW5pQmxvY2tzLkdlbm9tZVZpZXcgaWQ9J2RyYWtlLWdlbm9tZSdcbiAgICAgICAgICBvcmc9e2RyYWtlfSBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfSBvbkFsbGVsZUNoYW5nZT17dGhpcy5wcm9wcy5vbkFsbGVsZUNoYW5nZX1cbiAgICAgICAgICBzdHlsZT17e21hcmdpblRvcDogNTAsIHRvcDogNTB9fS8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNsYXNzIENhc2UxUGxheWdyb3VuZFJpZ2h0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGRyYWtlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgb25BZHZhbmNlQ2hhbGxlbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBkcmFrZSB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cInJpZ2h0XCIgY2xhc3NOYW1lPVwiY29sdW1uXCI+XG4gICAgICAgIDxHZW5pQmxvY2tzLk9yZ2FuaXNtR2xvd1ZpZXcgaWQ9J2RyYWtlLWltYWdlJyBvcmc9e2RyYWtlfSBjb2xvcj0nI0ZGRkZBQScgc2l6ZT17MjAwfS8+XG4gICAgICAgIDxHZW5pQmxvY2tzLkJ1dHRvbiBpZD0nYWR2YW5jZS1idXR0b24nIGxhYmVsPVwiQnJpbmcgSXQgT24hXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQWR2YW5jZUNoYWxsZW5nZX0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jbGFzcyBDYXNlMVBsYXlncm91bmQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc2V4TGFiZWxzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKS5pc1JlcXVpcmVkLFxuICAgIGNoYWxsZW5nZVNwZWM6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsYWJlbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaXNEcmFrZUhpZGRlbjogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICAgIHRyaWFsQ291bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGRyYWtlQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZylcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGN1cnJDaGFsbGVuZ2U6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBsYXN0Q2hhbGxlbmdlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgb25BZHZhbmNlQ2hhbGxlbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIGNvbnN0IHsgZHJha2VBbGxlbGVzIH0gPSBwcm9wcy5jaGFsbGVuZ2VTcGVjLFxuICAgICAgICAgIGRyYWtlU2V4ID0gTWF0aC5mbG9vcigyICogTWF0aC5yYW5kb20oKSk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRyYWtlOiBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBkcmFrZUFsbGVsZXMsIGRyYWtlU2V4KVxuICAgIH07XG4gIH1cblxuICBoYW5kbGVTZXhDaGFuZ2UgPSAoaVNleCkgPT4ge1xuICAgIGNvbnN0IHsgc2V4TGFiZWxzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIHsgZHJha2VBbGxlbGVzIH0gPSB0aGlzLnByb3BzLmNoYWxsZW5nZVNwZWM7XG4gICAgbGV0IHsgZHJha2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgLy8gcmVwbGFjZSBhbGxlbGVzIGxvc3Qgd2hlbiBzd2l0Y2hpbmcgdG8gbWFsZSBhbmQgYmFja1xuICAgIGNvbnN0IGFsbGVsZVN0cmluZyA9IEdlbmlCbG9ja3MuR2VuZXRpY3NVdGlscy5maWxsSW5NaXNzaW5nQWxsZWxlc0Zyb21BbGxlbGVTdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRyYWtlLmdlbmV0aWNzLCBkcmFrZS5nZXRBbGxlbGVTdHJpbmcoKSwgZHJha2VBbGxlbGVzKSxcbiAgICAgICAgICBzZXhPZkRyYWtlID0gc2V4TGFiZWxzLmluZGV4T2YoaVNleCk7XG4gICAgZHJha2UgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBhbGxlbGVTdHJpbmcsIHNleE9mRHJha2UpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBkcmFrZSB9KTtcbiAgfVxuXG4gIGhhbmRsZUFsbGVsZUNoYW5nZSA9IChjaHJvbSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKSA9PiB7XG4gICAgbGV0IHsgZHJha2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgZHJha2UuZ2VuZXRpY3MuZ2Vub3R5cGUucmVwbGFjZUFsbGVsZUNocm9tTmFtZShjaHJvbSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKTtcbiAgICBkcmFrZSA9IG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsIGRyYWtlLmdldEFsbGVsZVN0cmluZygpLCBkcmFrZS5zZXgpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBkcmFrZSB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHNleExhYmVscyB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICB7IGhpZGRlbkFsbGVsZXMgfSA9IHRoaXMucHJvcHMuY2hhbGxlbmdlU3BlYztcbiAgICBjb25zdCB7IGRyYWtlIH0gPSB0aGlzLnN0YXRlO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwicGxheWdyb3VuZC13cmFwcGVyXCI+XG4gICAgICAgIDxDYXNlMVBsYXlncm91bmRMZWZ0IGRyYWtlPXtkcmFrZX0gc2V4TGFiZWxzPXtzZXhMYWJlbHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNleENoYW5nZT17dGhpcy5oYW5kbGVTZXhDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25BbGxlbGVDaGFuZ2U9e3RoaXMuaGFuZGxlQWxsZWxlQ2hhbmdlfS8+XG4gICAgICAgIDxDYXNlMVBsYXlncm91bmRSaWdodCBkcmFrZT17ZHJha2V9IG9uQWR2YW5jZUNoYWxsZW5nZT17dGhpcy5wcm9wcy5vbkFkdmFuY2VDaGFsbGVuZ2V9Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuQ2FzZTFQbGF5Z3JvdW5kO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
