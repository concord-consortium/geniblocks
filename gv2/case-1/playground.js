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
//# sourceMappingURL=data:application/json;base64,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QUEsUUFHcEIsS0FIb0IsR0FHVixPQUFLLEtBSEssQ0FHcEIsS0FIb0I7OztBQUsxQixRQUFNLGVBQWUsV0FBVyxhQUFYLENBQXlCLG9DQUF6QixDQUNDLE1BQU0sUUFEUCxFQUNpQixNQUFNLGVBQU4sRUFEakIsRUFDMEMsWUFEMUMsQ0FBckI7UUFFTSxhQUFhLFVBQVUsT0FBVixDQUFrQixJQUFsQixDQUZuQjtBQUdBLFlBQVEsSUFBSSxVQUFVLFFBQWQsQ0FBdUIsVUFBVSxPQUFWLENBQWtCLEtBQXpDLEVBQWdELFlBQWhELEVBQThELFVBQTlELENBQVI7QUFDQSxXQUFLLFFBQUwsQ0FBYyxFQUFFLFlBQUYsRUFBZDtBQUNELEc7O09BRUQsa0IsR0FBcUIsVUFBQyxLQUFELEVBQVEsSUFBUixFQUFjLFVBQWQsRUFBMEIsU0FBMUIsRUFBd0M7QUFBQSxRQUNyRCxLQURxRCxHQUMzQyxPQUFLLEtBRHNDLENBQ3JELEtBRHFEOztBQUUzRCxVQUFNLFFBQU4sQ0FBZSxRQUFmLENBQXdCLHNCQUF4QixDQUErQyxLQUEvQyxFQUFzRCxJQUF0RCxFQUE0RCxVQUE1RCxFQUF3RSxTQUF4RTtBQUNBLFlBQVEsSUFBSSxVQUFVLFFBQWQsQ0FBdUIsVUFBVSxPQUFWLENBQWtCLEtBQXpDLEVBQWdELE1BQU0sZUFBTixFQUFoRCxFQUF5RSxNQUFNLEdBQS9FLENBQVI7QUFDQSxXQUFLLFFBQUwsQ0FBYyxFQUFFLFlBQUYsRUFBZDtBQUNELEc7OztBQWtCSCIsImZpbGUiOiJjYXNlLTEvcGxheWdyb3VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIENhc2UxUGxheWdyb3VuZExlZnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc2V4TGFiZWxzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBkcmFrZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLFxuICAgIG9uU2V4Q2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uQWxsZWxlQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBzZXhMYWJlbHMsIGRyYWtlLCBoaWRkZW5BbGxlbGVzIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdsZWZ0JyBjbGFzc05hbWU9J2NvbHVtbic+XG4gICAgICAgIDxHZW5pQmxvY2tzLkNoYW5nZVNleEJ1dHRvbnMgaWQ9J2NoYW5nZS1zZXgtYnV0dG9ucydcbiAgICAgICAgICBzZXg9e3NleExhYmVsc1tkcmFrZS5zZXhdfSBvbkNoYW5nZT17dGhpcy5wcm9wcy5vblNleENoYW5nZX1cbiAgICAgICAgICBzcGVjaWVzPVwiRHJha2VcIiBzaG93TGFiZWw9e3RydWV9Lz5cbiAgICAgICAgPEdlbmlCbG9ja3MuR2Vub21lVmlldyBpZD0nZHJha2UtZ2Vub21lJ1xuICAgICAgICAgIG9yZz17ZHJha2V9IGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9IG9uQWxsZWxlQ2hhbmdlPXt0aGlzLnByb3BzLm9uQWxsZWxlQ2hhbmdlfVxuICAgICAgICAgIHN0eWxlPXt7bWFyZ2luVG9wOiA1MCwgdG9wOiA1MH19Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY2xhc3MgQ2FzZTFQbGF5Z3JvdW5kUmlnaHQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZHJha2U6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBvbkFkdmFuY2VDaGFsbGVuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGRyYWtlIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwicmlnaHRcIiBjbGFzc05hbWU9XCJjb2x1bW5cIj5cbiAgICAgICAgPEdlbmlCbG9ja3MuT3JnYW5pc21HbG93VmlldyBpZD0nZHJha2UtaW1hZ2UnIG9yZz17ZHJha2V9IGNvbG9yPScjRkZGRkFBJyBzaXplPXsyMDB9Lz5cbiAgICAgICAgPEdlbmlCbG9ja3MuQnV0dG9uIGlkPSdhZHZhbmNlLWJ1dHRvbicgbGFiZWw9XCJCcmluZyBJdCBPbiFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub25BZHZhbmNlQ2hhbGxlbmdlfS8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNsYXNzIENhc2UxUGxheWdyb3VuZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBzZXhMYWJlbHM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLmlzUmVxdWlyZWQsXG4gICAgY2hhbGxlbmdlU3BlYzogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBpc0RyYWtlSGlkZGVuOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgICAgdHJpYWxDb3VudDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgZHJha2VBbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKVxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgY3VyckNoYWxsZW5nZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGxhc3RDaGFsbGVuZ2U6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBvbkFkdmFuY2VDaGFsbGVuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgY29uc3QgeyBkcmFrZUFsbGVsZXMgfSA9IHByb3BzLmNoYWxsZW5nZVNwZWMsXG4gICAgICAgICAgZHJha2VTZXggPSBNYXRoLmZsb29yKDIgKiBNYXRoLnJhbmRvbSgpKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZHJha2U6IG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsIGRyYWtlQWxsZWxlcywgZHJha2VTZXgpXG4gICAgfTtcbiAgfVxuXG4gIGhhbmRsZVNleENoYW5nZSA9IChpU2V4KSA9PiB7XG4gICAgY29uc3QgeyBzZXhMYWJlbHMgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgeyBkcmFrZUFsbGVsZXMgfSA9IHRoaXMucHJvcHMuY2hhbGxlbmdlU3BlYztcbiAgICBsZXQgeyBkcmFrZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICAvLyByZXBsYWNlIGFsbGVsZXMgbG9zdCB3aGVuIHN3aXRjaGluZyB0byBtYWxlIGFuZCBiYWNrXG4gICAgY29uc3QgYWxsZWxlU3RyaW5nID0gR2VuaUJsb2Nrcy5HZW5ldGljc1V0aWxzLmZpbGxJbk1pc3NpbmdBbGxlbGVzRnJvbUFsbGVsZVN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHJha2UuZ2VuZXRpY3MsIGRyYWtlLmdldEFsbGVsZVN0cmluZygpLCBkcmFrZUFsbGVsZXMpLFxuICAgICAgICAgIHNleE9mRHJha2UgPSBzZXhMYWJlbHMuaW5kZXhPZihpU2V4KTtcbiAgICBkcmFrZSA9IG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsIGFsbGVsZVN0cmluZywgc2V4T2ZEcmFrZSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGRyYWtlIH0pO1xuICB9XG5cbiAgaGFuZGxlQWxsZWxlQ2hhbmdlID0gKGNocm9tLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpID0+IHtcbiAgICBsZXQgeyBkcmFrZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICBkcmFrZS5nZW5ldGljcy5nZW5vdHlwZS5yZXBsYWNlQWxsZWxlQ2hyb21OYW1lKGNocm9tLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpO1xuICAgIGRyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgZHJha2UuZ2V0QWxsZWxlU3RyaW5nKCksIGRyYWtlLnNleCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGRyYWtlIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgc2V4TGFiZWxzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIHsgaGlkZGVuQWxsZWxlcyB9ID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VTcGVjO1xuICAgIGNvbnN0IHsgZHJha2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9XCJwbGF5Z3JvdW5kLXdyYXBwZXJcIj5cbiAgICAgICAgPENhc2UxUGxheWdyb3VuZExlZnQgZHJha2U9e2RyYWtlfSBzZXhMYWJlbHM9e3NleExhYmVsc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2V4Q2hhbmdlPXt0aGlzLmhhbmRsZVNleENoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17dGhpcy5oYW5kbGVBbGxlbGVDaGFuZ2V9Lz5cbiAgICAgICAgPENhc2UxUGxheWdyb3VuZFJpZ2h0IGRyYWtlPXtkcmFrZX0gb25BZHZhbmNlQ2hhbGxlbmdlPXt0aGlzLnByb3BzLm9uQWR2YW5jZUNoYWxsZW5nZX0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5DYXNlMVBsYXlncm91bmQ7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
