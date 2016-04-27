'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Case 1
 *
 * The code in this module was written to support a recreation of the challenges
 * from Case 1 in Geniverse. The challenges are:
 *  Challenge 0: Match the phenotype of a visible test drake to that of a target drake
 *               (This challenge is not in Geniverse but it was deemed a useful addition.)
 *  Challenge 1: Match the phenotype of a hidden test drake to that of a target drake
 *  Challenge 2: Match the phenotype of three hidden test drakes to target drakes
 */
/* global Case1Playground, Case1Challenge */

var kSexLabels = ['male', 'female'],
    kInitialAlleles = "a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
    kHiddenAlleles = ['t', 'tk', 'h', 'c', 'a', 'b', 'd', 'bog', 'rh'],
    gChallengeSpecs = [{ label: 'playground', Component: Case1Playground, isDrakeHidden: false, trialCount: 1,
  drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles }, { label: 'challenge-0', Component: Case1Challenge, isDrakeHidden: false, trialCount: 1,
  drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles }, { label: 'challenge-1', Component: Case1Challenge, isDrakeHidden: true, trialCount: 1,
  drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles }, { label: 'challenge-2', Component: Case1Challenge, isDrakeHidden: true, trialCount: 3,
  drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles }];

var Case1 = function (_React$Component) {
  _inherits(Case1, _React$Component);

  function Case1() {
    _classCallCheck(this, Case1);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Case1).call(this));

    _this.handleAdvanceChallenge = function () {
      var lastChallenge = _this.getLastChallengeIndex();
      var currChallenge = _this.state.currChallenge;

      if (currChallenge < lastChallenge) _this.setState({ currChallenge: ++currChallenge });else _this.completeCase();
    };

    _this.state = {
      currChallenge: 0
    };
    return _this;
  }

  _createClass(Case1, [{
    key: 'getChallengeCount',
    value: function getChallengeCount() {
      return this.props.challengeSpecs.length;
    }
  }, {
    key: 'getLastChallengeIndex',
    value: function getLastChallengeIndex() {
      return this.props.challengeSpecs.length - 1;
    }
  }, {
    key: 'completeCase',
    value: function completeCase() {
      var url = window.location.href,
          nextUrl = void 0;
      var case1Index = url.indexOf('case-1');
      nextUrl = url.substr(0, case1Index);
      window.location.assign(nextUrl);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var challengeSpec = this.props.challengeSpecs[this.state.currChallenge];
      var currChallenge = this.state.currChallenge;
      var lastChallenge = this.getLastChallengeIndex();
      return React.createElement(
        'div',
        null,
        function () {
          if (challengeSpec.Component === Case1Playground) {
            return React.createElement(Case1Playground, {
              sexLabels: kSexLabels,
              challengeSpec: challengeSpec,
              currChallenge: currChallenge,
              lastChallenge: lastChallenge,
              onAdvanceChallenge: _this2.handleAdvanceChallenge });
          } else {
            return React.createElement(Case1Challenge, {
              sexLabels: kSexLabels,
              challengeSpec: challengeSpec,
              currChallenge: currChallenge,
              lastChallenge: lastChallenge,
              onAdvanceChallenge: _this2.handleAdvanceChallenge });
          }
        }()
      );
    }
  }]);

  return Case1;
}(React.Component);

Case1.propTypes = {
  challengeSpecs: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    Component: React.PropTypes.func.isRequired,
    isDrakeHidden: React.PropTypes.bool.isRequired,
    trialCount: React.PropTypes.number.isRequired,
    drakeAlleles: React.PropTypes.string.isRequired,
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  }))
};


function render() {

  ReactDOM.render(React.createElement(Case1, {
    challengeSpecs: gChallengeSpecs
  }), document.getElementById('wrapper'));
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

render();
//# sourceMappingURL=data:application/json;base64,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LHNCQUw3QixHQURGO0FBUUQ7QUFDRixTQXJCQTtBQURILE9BREY7QUEwQkQ7Ozs7RUE3RWlCLE1BQU0sUzs7QUFBcEIsSyxDQUVHLFMsR0FBWTtBQUNqQixrQkFBZ0IsTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQ0UsTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCO0FBQ3BCLFdBQU8sTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBRFY7QUFFcEIsZUFBVyxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFGWjtBQUdwQixtQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFIaEI7QUFJcEIsZ0JBQVksTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBSmY7QUFLcEIsa0JBQWMsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBTGpCO0FBTXBCLG1CQUFlLE1BQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixNQUFNLFNBQU4sQ0FBZ0IsTUFBeEMsRUFBZ0Q7QUFOM0MsR0FBdEIsQ0FERjtBQURDLEM7OztBQThFckIsU0FBUyxNQUFULEdBQWtCOztBQUVoQixXQUFTLE1BQVQsQ0FDRSxNQUFNLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7QUFDekIsb0JBQWdCO0FBRFMsR0FBM0IsQ0FERixFQUlFLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQUpGO0FBTUQ7O0FBRUQsV0FBVyxNQUFYLENBQWtCLG1DQUFsQjs7QUFFQSIsImZpbGUiOiJjYXNlLTEvY2FzZS0xLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDYXNlIDFcbiAqXG4gKiBUaGUgY29kZSBpbiB0aGlzIG1vZHVsZSB3YXMgd3JpdHRlbiB0byBzdXBwb3J0IGEgcmVjcmVhdGlvbiBvZiB0aGUgY2hhbGxlbmdlc1xuICogZnJvbSBDYXNlIDEgaW4gR2VuaXZlcnNlLiBUaGUgY2hhbGxlbmdlcyBhcmU6XG4gKiAgQ2hhbGxlbmdlIDA6IE1hdGNoIHRoZSBwaGVub3R5cGUgb2YgYSB2aXNpYmxlIHRlc3QgZHJha2UgdG8gdGhhdCBvZiBhIHRhcmdldCBkcmFrZVxuICogICAgICAgICAgICAgICAoVGhpcyBjaGFsbGVuZ2UgaXMgbm90IGluIEdlbml2ZXJzZSBidXQgaXQgd2FzIGRlZW1lZCBhIHVzZWZ1bCBhZGRpdGlvbi4pXG4gKiAgQ2hhbGxlbmdlIDE6IE1hdGNoIHRoZSBwaGVub3R5cGUgb2YgYSBoaWRkZW4gdGVzdCBkcmFrZSB0byB0aGF0IG9mIGEgdGFyZ2V0IGRyYWtlXG4gKiAgQ2hhbGxlbmdlIDI6IE1hdGNoIHRoZSBwaGVub3R5cGUgb2YgdGhyZWUgaGlkZGVuIHRlc3QgZHJha2VzIHRvIHRhcmdldCBkcmFrZXNcbiAqL1xuLyogZ2xvYmFsIENhc2UxUGxheWdyb3VuZCwgQ2FzZTFDaGFsbGVuZ2UgKi9cblxuY29uc3Qga1NleExhYmVscyA9IFsnbWFsZScsICdmZW1hbGUnXSxcbiAgICAgIGtJbml0aWFsQWxsZWxlcyA9IFwiYTpoLGI6aCxhOkMsYjpDLGE6YSxiOmEsYTpCLGI6QixhOkQsYjpELGE6VCxiOnQsYTpyaCxiOnJoLGE6Qm9nLGI6Qm9nXCIsXG4gICAgICBrSGlkZGVuQWxsZWxlcyA9IFsndCcsJ3RrJywnaCcsJ2MnLCdhJywnYicsJ2QnLCdib2cnLCdyaCddLFxuICAgICAgZ0NoYWxsZW5nZVNwZWNzID0gW1xuICAgICAgICB7IGxhYmVsOiAncGxheWdyb3VuZCcsIENvbXBvbmVudDogQ2FzZTFQbGF5Z3JvdW5kLCBpc0RyYWtlSGlkZGVuOiBmYWxzZSwgdHJpYWxDb3VudDogMSxcbiAgICAgICAgICBkcmFrZUFsbGVsZXM6IGtJbml0aWFsQWxsZWxlcywgaGlkZGVuQWxsZWxlczoga0hpZGRlbkFsbGVsZXMgfSxcbiAgICAgICAgeyBsYWJlbDogJ2NoYWxsZW5nZS0wJywgQ29tcG9uZW50OiBDYXNlMUNoYWxsZW5nZSwgaXNEcmFrZUhpZGRlbjogZmFsc2UsIHRyaWFsQ291bnQ6IDEsXG4gICAgICAgICAgZHJha2VBbGxlbGVzOiBrSW5pdGlhbEFsbGVsZXMsIGhpZGRlbkFsbGVsZXM6IGtIaWRkZW5BbGxlbGVzIH0sXG4gICAgICAgIHsgbGFiZWw6ICdjaGFsbGVuZ2UtMScsIENvbXBvbmVudDogQ2FzZTFDaGFsbGVuZ2UsIGlzRHJha2VIaWRkZW46IHRydWUsIHRyaWFsQ291bnQ6IDEsXG4gICAgICAgICAgZHJha2VBbGxlbGVzOiBrSW5pdGlhbEFsbGVsZXMsIGhpZGRlbkFsbGVsZXM6IGtIaWRkZW5BbGxlbGVzIH0sXG4gICAgICAgIHsgbGFiZWw6ICdjaGFsbGVuZ2UtMicsIENvbXBvbmVudDogQ2FzZTFDaGFsbGVuZ2UsIGlzRHJha2VIaWRkZW46IHRydWUsIHRyaWFsQ291bnQ6IDMsXG4gICAgICAgICAgZHJha2VBbGxlbGVzOiBrSW5pdGlhbEFsbGVsZXMsIGhpZGRlbkFsbGVsZXM6IGtIaWRkZW5BbGxlbGVzIH1cbiAgICAgIF07XG5cbmNsYXNzIENhc2UxIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoYWxsZW5nZVNwZWNzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbXBvbmVudDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRHJha2VIaWRkZW46IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlhbENvdW50OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFrZUFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLmlzUmVxdWlyZWRcbiAgICAgICAgICAgICAgICAgICAgICB9KSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY3VyckNoYWxsZW5nZTogMFxuICAgIH07XG4gIH1cblxuICBnZXRDaGFsbGVuZ2VDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGFsbGVuZ2VTcGVjcy5sZW5ndGg7XG4gIH1cblxuICBnZXRMYXN0Q2hhbGxlbmdlSW5kZXgoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuY2hhbGxlbmdlU3BlY3MubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGhhbmRsZUFkdmFuY2VDaGFsbGVuZ2UgPSAoKSA9PiB7XG4gICAgY29uc3QgbGFzdENoYWxsZW5nZSA9IHRoaXMuZ2V0TGFzdENoYWxsZW5nZUluZGV4KCk7XG4gICAgbGV0IHsgY3VyckNoYWxsZW5nZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoY3VyckNoYWxsZW5nZSA8IGxhc3RDaGFsbGVuZ2UpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VyckNoYWxsZW5nZTogKytjdXJyQ2hhbGxlbmdlIH0pO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuY29tcGxldGVDYXNlKCk7XG4gIH1cblxuICBjb21wbGV0ZUNhc2UoKSB7XG4gICAgbGV0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICBuZXh0VXJsO1xuICAgIGNvbnN0IGNhc2UxSW5kZXggPSB1cmwuaW5kZXhPZignY2FzZS0xJyk7XG4gICAgbmV4dFVybCA9IHVybC5zdWJzdHIoMCwgY2FzZTFJbmRleCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihuZXh0VXJsKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjaGFsbGVuZ2VTcGVjID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VTcGVjc1t0aGlzLnN0YXRlLmN1cnJDaGFsbGVuZ2VdLFxuICAgICAgICAgIHsgY3VyckNoYWxsZW5nZSB9ID0gdGhpcy5zdGF0ZSxcbiAgICAgICAgICBsYXN0Q2hhbGxlbmdlID0gdGhpcy5nZXRMYXN0Q2hhbGxlbmdlSW5kZXgoKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgaWYgKGNoYWxsZW5nZVNwZWMuQ29tcG9uZW50ID09PSBDYXNlMVBsYXlncm91bmQpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxDYXNlMVBsYXlncm91bmRcbiAgICAgICAgICAgICAgICAgIHNleExhYmVscz17a1NleExhYmVsc31cbiAgICAgICAgICAgICAgICAgIGNoYWxsZW5nZVNwZWM9e2NoYWxsZW5nZVNwZWN9XG4gICAgICAgICAgICAgICAgICBjdXJyQ2hhbGxlbmdlPXtjdXJyQ2hhbGxlbmdlfVxuICAgICAgICAgICAgICAgICAgbGFzdENoYWxsZW5nZT17bGFzdENoYWxsZW5nZX1cbiAgICAgICAgICAgICAgICAgIG9uQWR2YW5jZUNoYWxsZW5nZT17dGhpcy5oYW5kbGVBZHZhbmNlQ2hhbGxlbmdlfS8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxDYXNlMUNoYWxsZW5nZVxuICAgICAgICAgICAgICAgICAgc2V4TGFiZWxzPXtrU2V4TGFiZWxzfVxuICAgICAgICAgICAgICAgICAgY2hhbGxlbmdlU3BlYz17Y2hhbGxlbmdlU3BlY31cbiAgICAgICAgICAgICAgICAgIGN1cnJDaGFsbGVuZ2U9e2N1cnJDaGFsbGVuZ2V9XG4gICAgICAgICAgICAgICAgICBsYXN0Q2hhbGxlbmdlPXtsYXN0Q2hhbGxlbmdlfVxuICAgICAgICAgICAgICAgICAgb25BZHZhbmNlQ2hhbGxlbmdlPXt0aGlzLmhhbmRsZUFkdmFuY2VDaGFsbGVuZ2V9Lz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSgpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXIoKSB7XG5cbiAgUmVhY3RET00ucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2FzZTEsIHtcbiAgICAgIGNoYWxsZW5nZVNwZWNzOiBnQ2hhbGxlbmdlU3BlY3NcbiAgICB9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpXG4gICk7XG59XG5cbkdlbmlCbG9ja3MuQnV0dG9uLmVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0T25LZXlEb3duKCk7XG5cbnJlbmRlcigpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
