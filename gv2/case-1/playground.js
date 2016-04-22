'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var kSexLabels = ['male', 'female'],
    kHiddenAlleles = ['t', 'tk', 'h', 'c', 'a', 'b', 'd', 'bog', 'rh'],
    kInitialAlleles = "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
    kInitialSex = BioLogica.FEMALE;

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
      var _props2 = this.props;
      var drake = _props2.drake;
      var handleProceedButton = _props2.handleProceedButton;

      return React.createElement(
        'div',
        { id: 'right', className: 'column' },
        React.createElement(GeniBlocks.OrganismGlowView, { id: 'drake-image', org: drake, color: '#FFFFAA', size: 200 }),
        React.createElement(GeniBlocks.Button, { id: 'advance-button', label: 'Bring It On!', onClick: handleProceedButton })
      );
    }
  }]);

  return Case1PlaygroundRight;
}(React.Component);

Case1PlaygroundRight.propTypes = {
  drake: React.PropTypes.object.isRequired,
  handleProceedButton: React.PropTypes.func.isRequired
};

var Case1Playground = function (_React$Component3) {
  _inherits(Case1Playground, _React$Component3);

  function Case1Playground(props) {
    _classCallCheck(this, Case1Playground);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Case1Playground).call(this, props));

    _this3.handleSexChange = function (iSex) {
      var _this3$props = _this3.props;
      var sexLabels = _this3$props.sexLabels;
      var initialAlleles = _this3$props.initialAlleles;
      var drake = _this3.state.drake;
      // replace alleles lost when switching to male and back

      var alleleString = GeniBlocks.GeneticsUtils.fillInMissingAllelesFromAlleleString(drake.genetics, drake.getAlleleString(), initialAlleles),
          sexOfDrake = sexLabels.indexOf(iSex);
      drake = new BioLogica.Organism(BioLogica.Species.Drake, alleleString, sexOfDrake);
      _this3.setState({ drake: drake });
    };

    _this3.handleAlleleChange = function (chrom, side, prevAllele, newAllele) {
      var drake = _this3.state.drake;

      drake.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
      drake = new BioLogica.Organism(BioLogica.Species.Drake, drake.getAlleleString(), drake.sex);
      _this3.setState({ drake: drake });
    };

    _this3.state = {
      drake: new BioLogica.Organism(BioLogica.Species.Drake, props.initialAlleles, props.initialSex)
    };
    return _this3;
  }

  _createClass(Case1Playground, [{
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var sexLabels = _props3.sexLabels;
      var hiddenAlleles = _props3.hiddenAlleles;
      var handleProceedButton = _props3.handleProceedButton;
      var drake = this.state.drake;

      return React.createElement(
        'div',
        { id: 'playground-wrapper' },
        React.createElement(Case1PlaygroundLeft, { drake: drake, sexLabels: sexLabels,
          hiddenAlleles: hiddenAlleles,
          onSexChange: this.handleSexChange,
          onAlleleChange: this.handleAlleleChange }),
        React.createElement(Case1PlaygroundRight, { drake: drake, handleProceedButton: handleProceedButton })
      );
    }
  }]);

  return Case1Playground;
}(React.Component);

Case1Playground.propTypes = {
  sexLabels: React.PropTypes.arrayOf(React.PropTypes.string),
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  initialAlleles: React.PropTypes.string.isRequired,
  initialSex: React.PropTypes.oneOf([BioLogica.MALE, BioLogica.FEMALE]).isRequired,
  handleProceedButton: React.PropTypes.func.isRequired
};


function handleProceedButton() {
  window.location.assign(window.location.href.replace("playground.html", "challenges.html?challenge=0"));
}

function render() {
  ReactDOM.render(React.createElement(Case1Playground, {
    sexLabels: kSexLabels,
    hiddenAlleles: kHiddenAlleles,
    initialAlleles: kInitialAlleles,
    initialSex: kInitialSex,
    handleProceedButton: handleProceedButton }), document.getElementById('wrapper'));
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

render();
//# sourceMappingURL=data:application/json;base64,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QkFBckIsRUFBcEMsQ0FMRjtPQURGLENBSE87Ozs7U0FwQ0w7RUFBd0IsTUFBTSxTQUFOOztBQUF4QixnQkFFRyxZQUFZO0FBQ2pCLGFBQVcsTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUFuQztBQUNBLGlCQUFlLE1BQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdkM7QUFDQSxrQkFBZ0IsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ2hCLGNBQVksTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCLENBQUMsVUFBVSxJQUFWLEVBQWdCLFVBQVUsTUFBVixDQUF2QyxFQUEwRCxVQUExRDtBQUNaLHVCQUFxQixNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7Ozs7QUE0Q3pCLFNBQVMsbUJBQVQsR0FBK0I7QUFDN0IsU0FBTyxRQUFQLENBQWdCLE1BQWhCLENBQXVCLE9BQU8sUUFBUCxDQUFnQixJQUFoQixDQUFxQixPQUFyQixDQUE2QixpQkFBN0IsRUFBZ0QsNkJBQWhELENBQXZCLEVBRDZCO0NBQS9COztBQUlBLFNBQVMsTUFBVCxHQUFrQjtBQUNoQixXQUFTLE1BQVQsQ0FDRSxNQUFNLGFBQU4sQ0FBb0IsZUFBcEIsRUFBcUM7QUFDbkMsZUFBVyxVQUFYO0FBQ0EsbUJBQWUsY0FBZjtBQUNBLG9CQUFnQixlQUFoQjtBQUNBLGdCQUFZLFdBQVo7QUFDQSw0Q0FMbUMsRUFBckMsQ0FERixFQU9FLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQVBGLEVBRGdCO0NBQWxCOztBQVdBLFdBQVcsTUFBWCxDQUFrQixtQ0FBbEI7O0FBRUEiLCJmaWxlIjoiY2FzZS0xL3BsYXlncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBrU2V4TGFiZWxzID0gWydtYWxlJywgJ2ZlbWFsZSddLFxuICAgICAga0hpZGRlbkFsbGVsZXMgPSBbJ3QnLCd0aycsJ2gnLCdjJywnYScsJ2InLCdkJywnYm9nJywncmgnXSxcbiAgICAgIGtJbml0aWFsQWxsZWxlcyA9IFwiYTptLGI6TSxhOmgsYjpoLGE6QyxiOkMsYTphLGI6YSxhOkIsYjpCLGE6RCxiOkQsYTp3LGI6VyxhOkZsLGI6RmwsYTpIbCxiOmhsLGE6VCxiOnQsYTpyaCxiOnJoLGE6Qm9nLGI6Qm9nXCIsXG4gICAgICBrSW5pdGlhbFNleCA9IEJpb0xvZ2ljYS5GRU1BTEU7XG5cbmNsYXNzIENhc2UxUGxheWdyb3VuZExlZnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc2V4TGFiZWxzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBkcmFrZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLFxuICAgIG9uU2V4Q2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uQWxsZWxlQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBzZXhMYWJlbHMsIGRyYWtlLCBoaWRkZW5BbGxlbGVzIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdsZWZ0JyBjbGFzc05hbWU9J2NvbHVtbic+XG4gICAgICAgIDxHZW5pQmxvY2tzLkNoYW5nZVNleEJ1dHRvbnMgaWQ9J2NoYW5nZS1zZXgtYnV0dG9ucydcbiAgICAgICAgICBzZXg9e3NleExhYmVsc1tkcmFrZS5zZXhdfSBvbkNoYW5nZT17dGhpcy5wcm9wcy5vblNleENoYW5nZX1cbiAgICAgICAgICBzcGVjaWVzPVwiRHJha2VcIiBzaG93TGFiZWw9e3RydWV9Lz5cbiAgICAgICAgPEdlbmlCbG9ja3MuR2Vub21lVmlldyBpZD0nZHJha2UtZ2Vub21lJ1xuICAgICAgICAgIG9yZz17ZHJha2V9IGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9IG9uQWxsZWxlQ2hhbmdlPXt0aGlzLnByb3BzLm9uQWxsZWxlQ2hhbmdlfVxuICAgICAgICAgIHN0eWxlPXt7bWFyZ2luVG9wOiA1MCwgdG9wOiA1MH19Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY2xhc3MgQ2FzZTFQbGF5Z3JvdW5kUmlnaHQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZHJha2U6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBoYW5kbGVQcm9jZWVkQnV0dG9uOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBkcmFrZSwgaGFuZGxlUHJvY2VlZEJ1dHRvbiB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cInJpZ2h0XCIgY2xhc3NOYW1lPVwiY29sdW1uXCI+XG4gICAgICAgIDxHZW5pQmxvY2tzLk9yZ2FuaXNtR2xvd1ZpZXcgaWQ9J2RyYWtlLWltYWdlJyBvcmc9e2RyYWtlfSBjb2xvcj0nI0ZGRkZBQScgc2l6ZT17MjAwfS8+XG4gICAgICAgIDxHZW5pQmxvY2tzLkJ1dHRvbiBpZD0nYWR2YW5jZS1idXR0b24nIGxhYmVsPVwiQnJpbmcgSXQgT24hXCIgb25DbGljaz17aGFuZGxlUHJvY2VlZEJ1dHRvbn0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jbGFzcyBDYXNlMVBsYXlncm91bmQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc2V4TGFiZWxzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBpbml0aWFsQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGluaXRpYWxTZXg6IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbQmlvTG9naWNhLk1BTEUsIEJpb0xvZ2ljYS5GRU1BTEVdKS5pc1JlcXVpcmVkLFxuICAgIGhhbmRsZVByb2NlZWRCdXR0b246IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRyYWtlOiBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBwcm9wcy5pbml0aWFsQWxsZWxlcywgcHJvcHMuaW5pdGlhbFNleClcbiAgICB9O1xuICB9XG5cbiAgaGFuZGxlU2V4Q2hhbmdlID0gKGlTZXgpID0+IHtcbiAgICBjb25zdCB7IHNleExhYmVscywgaW5pdGlhbEFsbGVsZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgbGV0IHsgZHJha2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgLy8gcmVwbGFjZSBhbGxlbGVzIGxvc3Qgd2hlbiBzd2l0Y2hpbmcgdG8gbWFsZSBhbmQgYmFja1xuICAgIGNvbnN0IGFsbGVsZVN0cmluZyA9IEdlbmlCbG9ja3MuR2VuZXRpY3NVdGlscy5maWxsSW5NaXNzaW5nQWxsZWxlc0Zyb21BbGxlbGVTdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRyYWtlLmdlbmV0aWNzLCBkcmFrZS5nZXRBbGxlbGVTdHJpbmcoKSwgaW5pdGlhbEFsbGVsZXMpLFxuICAgICAgICAgIHNleE9mRHJha2UgPSBzZXhMYWJlbHMuaW5kZXhPZihpU2V4KTtcbiAgICBkcmFrZSA9IG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsIGFsbGVsZVN0cmluZywgc2V4T2ZEcmFrZSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGRyYWtlIH0pO1xuICB9XG5cbiAgaGFuZGxlQWxsZWxlQ2hhbmdlID0gKGNocm9tLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpID0+IHtcbiAgICBsZXQgeyBkcmFrZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICBkcmFrZS5nZW5ldGljcy5nZW5vdHlwZS5yZXBsYWNlQWxsZWxlQ2hyb21OYW1lKGNocm9tLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpO1xuICAgIGRyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgZHJha2UuZ2V0QWxsZWxlU3RyaW5nKCksIGRyYWtlLnNleCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGRyYWtlIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgc2V4TGFiZWxzLCBoaWRkZW5BbGxlbGVzLCBoYW5kbGVQcm9jZWVkQnV0dG9uIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgZHJha2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9XCJwbGF5Z3JvdW5kLXdyYXBwZXJcIj5cbiAgICAgICAgPENhc2UxUGxheWdyb3VuZExlZnQgZHJha2U9e2RyYWtlfSBzZXhMYWJlbHM9e3NleExhYmVsc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2V4Q2hhbmdlPXt0aGlzLmhhbmRsZVNleENoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17dGhpcy5oYW5kbGVBbGxlbGVDaGFuZ2V9Lz5cbiAgICAgICAgPENhc2UxUGxheWdyb3VuZFJpZ2h0IGRyYWtlPXtkcmFrZX0gaGFuZGxlUHJvY2VlZEJ1dHRvbj17aGFuZGxlUHJvY2VlZEJ1dHRvbn0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVQcm9jZWVkQnV0dG9uKCkge1xuICB3aW5kb3cubG9jYXRpb24uYXNzaWduKHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoXCJwbGF5Z3JvdW5kLmh0bWxcIiwgXCJjaGFsbGVuZ2VzLmh0bWw/Y2hhbGxlbmdlPTBcIikpO1xufVxuXG5mdW5jdGlvbiByZW5kZXIoKSB7XG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENhc2UxUGxheWdyb3VuZCwge1xuICAgICAgc2V4TGFiZWxzOiBrU2V4TGFiZWxzLFxuICAgICAgaGlkZGVuQWxsZWxlczoga0hpZGRlbkFsbGVsZXMsXG4gICAgICBpbml0aWFsQWxsZWxlczoga0luaXRpYWxBbGxlbGVzLFxuICAgICAgaW5pdGlhbFNleDoga0luaXRpYWxTZXgsXG4gICAgICBoYW5kbGVQcm9jZWVkQnV0dG9uIH0pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJykpO1xufVxuXG5HZW5pQmxvY2tzLkJ1dHRvbi5lbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodE9uS2V5RG93bigpO1xuXG5yZW5kZXIoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
