'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Case 3 Challenges
 *
 * The code in this module was written to support a recreation of the challenges
 * from Case 3 in Geniverse. The challenges are:
 *  Challenge 1: Modify mother drake so as to breed a particular target drake
 *  Challenge 2: Modify father drake so as to breed a pair of target drakes
 */
/* global Case3Challenge */
var _BioLogica = BioLogica;
var MALE = _BioLogica.MALE;
var FEMALE = _BioLogica.FEMALE;
var kInitialAlleles = "a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog";
var kHiddenAlleles = ['t', 'tk', 'h', 'c', 'a', 'b', 'd', 'bog', 'rh'];
var kEditableAlleles = ['m', 'w', 'fl', 'hl'];
var kChallengeSpecs = [{ // Challenge 1: female is editable, male is fixed, one target drake
  label: 'challenge-1',
  targetDrakeCount: 1,
  fixedParentSex: MALE,
  editableParentSex: FEMALE,
  initialAlleles: kInitialAlleles,
  hiddenAlleles: kHiddenAlleles,
  editableAlleles: kEditableAlleles
}, { // Challenge 2: male is editable, female is fixed, two target drakes
  label: 'challenge-2',
  targetDrakeCount: 2,
  fixedParentSex: FEMALE,
  editableParentSex: MALE,
  initialAlleles: kInitialAlleles,
  hiddenAlleles: kHiddenAlleles,
  editableAlleles: kEditableAlleles
}];
var kGlowColor = '#FFFFAA';
var kDropGlowColor = '#FFFF00';
var kCorrectGlowColor = '#88FF88';
var kIncorrectGlowColor = '#FF8888';
var kTargetDrakeSize = 150;
var kClutchSize = 20;

function handleCompleteCase() {
  // back to case log
  var url = window.location.href;
  var case3Index = url.indexOf('case-3'),
      nextUrl = url.substr(0, case3Index);
  window.location.assign(nextUrl);
}

var Case3 = function (_React$Component) {
  _inherits(Case3, _React$Component);

  function Case3() {
    _classCallCheck(this, Case3);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Case3).call(this));

    _this.handleNextChallenge = function () {
      var maxChallenge = _this.props.challengeSpecs.length - 1;
      if (_this.state.currChallenge < maxChallenge) {
        // advance to next challenge
        _this.setState({ currChallenge: _this.state.currChallenge + 1 });
      } else {
        // back to case log
        _this.props.onCompleteCase();
      }
    };

    _this.state = {
      currChallenge: 0
    };
    return _this;
  }

  _createClass(Case3, [{
    key: 'render',
    value: function render() {
      var challengeSpecs = this.props.challengeSpecs;
      var currChallenge = this.state.currChallenge;
      var challengeSpec = challengeSpecs[currChallenge];
      var maxChallenge = challengeSpecs.length - 1;
      return React.createElement(Case3Challenge, { currChallenge: currChallenge, maxChallenge: maxChallenge,
        challengeSpec: challengeSpec,
        targetDrakeSize: kTargetDrakeSize, clutchSize: kClutchSize,
        glowColor: kGlowColor, dropGlowColor: kDropGlowColor,
        correctGlowColor: kCorrectGlowColor, incorrectGlowColor: kIncorrectGlowColor,
        onNextChallenge: this.handleNextChallenge });
    }
  }]);

  return Case3;
}(React.Component);

Case3.propTypes = {
  challengeSpecs: React.PropTypes.arrayOf(React.PropTypes.object),
  onCompleteCase: React.PropTypes.func.isRequired
};


function render() {
  ReactDOM.render(React.createElement(Case3, {
    challengeSpecs: kChallengeSpecs,
    onCompleteCase: handleCompleteCase }), document.getElementById('wrapper'));
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

render();
//# sourceMappingURL=data:application/json;base64,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LFNBQVMsTUFBVCxHQUFrQjtBQUNoQixXQUFTLE1BQVQsQ0FDRSxNQUFNLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7QUFDekIsb0JBQWdCLGVBRFM7QUFFekIsb0JBQWdCLGtCQUZTLEVBQTNCLENBREYsRUFJRSxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FKRjtBQU1EOztBQUVELFdBQVcsTUFBWCxDQUFrQixtQ0FBbEI7O0FBRUEiLCJmaWxlIjoiY2FzZS0zL2Nhc2UtMy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2FzZSAzIENoYWxsZW5nZXNcbiAqXG4gKiBUaGUgY29kZSBpbiB0aGlzIG1vZHVsZSB3YXMgd3JpdHRlbiB0byBzdXBwb3J0IGEgcmVjcmVhdGlvbiBvZiB0aGUgY2hhbGxlbmdlc1xuICogZnJvbSBDYXNlIDMgaW4gR2VuaXZlcnNlLiBUaGUgY2hhbGxlbmdlcyBhcmU6XG4gKiAgQ2hhbGxlbmdlIDE6IE1vZGlmeSBtb3RoZXIgZHJha2Ugc28gYXMgdG8gYnJlZWQgYSBwYXJ0aWN1bGFyIHRhcmdldCBkcmFrZVxuICogIENoYWxsZW5nZSAyOiBNb2RpZnkgZmF0aGVyIGRyYWtlIHNvIGFzIHRvIGJyZWVkIGEgcGFpciBvZiB0YXJnZXQgZHJha2VzXG4gKi9cbi8qIGdsb2JhbCBDYXNlM0NoYWxsZW5nZSAqL1xuY29uc3QgeyBNQUxFLCBGRU1BTEUgfSA9IEJpb0xvZ2ljYSxcbiAgICAgIGtJbml0aWFsQWxsZWxlcyA9IFwiYTpoLGI6aCxhOkMsYjpDLGE6YSxiOmEsYTpCLGI6QixhOkQsYjpELGE6VCxiOnQsYTpyaCxiOnJoLGE6Qm9nLGI6Qm9nXCIsXG4gICAgICBrSGlkZGVuQWxsZWxlcyA9IFsndCcsJ3RrJywnaCcsJ2MnLCdhJywnYicsJ2QnLCdib2cnLCdyaCddLFxuICAgICAga0VkaXRhYmxlQWxsZWxlcyA9IFsnbScsJ3cnLCdmbCcsJ2hsJ10sXG4gICAgICBrQ2hhbGxlbmdlU3BlY3MgPSBbXG4gICAgICAgIHsgLy8gQ2hhbGxlbmdlIDE6IGZlbWFsZSBpcyBlZGl0YWJsZSwgbWFsZSBpcyBmaXhlZCwgb25lIHRhcmdldCBkcmFrZVxuICAgICAgICAgIGxhYmVsOiAnY2hhbGxlbmdlLTEnLFxuICAgICAgICAgIHRhcmdldERyYWtlQ291bnQ6IDEsXG4gICAgICAgICAgZml4ZWRQYXJlbnRTZXg6IE1BTEUsXG4gICAgICAgICAgZWRpdGFibGVQYXJlbnRTZXg6IEZFTUFMRSxcbiAgICAgICAgICBpbml0aWFsQWxsZWxlczoga0luaXRpYWxBbGxlbGVzLFxuICAgICAgICAgIGhpZGRlbkFsbGVsZXM6IGtIaWRkZW5BbGxlbGVzLFxuICAgICAgICAgIGVkaXRhYmxlQWxsZWxlczoga0VkaXRhYmxlQWxsZWxlc1xuICAgICAgICB9LFxuICAgICAgICB7IC8vIENoYWxsZW5nZSAyOiBtYWxlIGlzIGVkaXRhYmxlLCBmZW1hbGUgaXMgZml4ZWQsIHR3byB0YXJnZXQgZHJha2VzXG4gICAgICAgICAgbGFiZWw6ICdjaGFsbGVuZ2UtMicsXG4gICAgICAgICAgdGFyZ2V0RHJha2VDb3VudDogMixcbiAgICAgICAgICBmaXhlZFBhcmVudFNleDogRkVNQUxFLFxuICAgICAgICAgIGVkaXRhYmxlUGFyZW50U2V4OiBNQUxFLFxuICAgICAgICAgIGluaXRpYWxBbGxlbGVzOiBrSW5pdGlhbEFsbGVsZXMsXG4gICAgICAgICAgaGlkZGVuQWxsZWxlczoga0hpZGRlbkFsbGVsZXMsXG4gICAgICAgICAgZWRpdGFibGVBbGxlbGVzOiBrRWRpdGFibGVBbGxlbGVzXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBrR2xvd0NvbG9yID0gJyNGRkZGQUEnLFxuICAgICAga0Ryb3BHbG93Q29sb3IgPSAnI0ZGRkYwMCcsXG4gICAgICBrQ29ycmVjdEdsb3dDb2xvciA9ICcjODhGRjg4JyxcbiAgICAgIGtJbmNvcnJlY3RHbG93Q29sb3IgPSAnI0ZGODg4OCcsXG4gICAgICBrVGFyZ2V0RHJha2VTaXplID0gMTUwLFxuICAgICAga0NsdXRjaFNpemUgPSAyMDtcblxuZnVuY3Rpb24gaGFuZGxlQ29tcGxldGVDYXNlKCkge1xuICAvLyBiYWNrIHRvIGNhc2UgbG9nXG4gIGxldCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgY29uc3QgY2FzZTNJbmRleCA9IHVybC5pbmRleE9mKCdjYXNlLTMnKSxcbiAgICAgICAgbmV4dFVybCA9IHVybC5zdWJzdHIoMCwgY2FzZTNJbmRleCk7XG4gIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24obmV4dFVybCk7XG59XG5cbmNsYXNzIENhc2UzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoYWxsZW5nZVNwZWNzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KSxcbiAgICBvbkNvbXBsZXRlQ2FzZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjdXJyQ2hhbGxlbmdlOiAwXG4gICAgfTtcbiAgfVxuXG4gIGhhbmRsZU5leHRDaGFsbGVuZ2UgPSAoKSA9PiB7XG4gICAgY29uc3QgbWF4Q2hhbGxlbmdlID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VTcGVjcy5sZW5ndGggLSAxO1xuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJDaGFsbGVuZ2UgPCBtYXhDaGFsbGVuZ2UpIHtcbiAgICAgIC8vIGFkdmFuY2UgdG8gbmV4dCBjaGFsbGVuZ2VcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyQ2hhbGxlbmdlOiB0aGlzLnN0YXRlLmN1cnJDaGFsbGVuZ2UgKyAxIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIGJhY2sgdG8gY2FzZSBsb2dcbiAgICAgIHRoaXMucHJvcHMub25Db21wbGV0ZUNhc2UoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjaGFsbGVuZ2VTcGVjcyB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICB7IGN1cnJDaGFsbGVuZ2UgfSA9IHRoaXMuc3RhdGUsXG4gICAgICAgICAgY2hhbGxlbmdlU3BlYyA9IGNoYWxsZW5nZVNwZWNzW2N1cnJDaGFsbGVuZ2VdLFxuICAgICAgICAgIG1heENoYWxsZW5nZSA9IGNoYWxsZW5nZVNwZWNzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIChcbiAgICAgIDxDYXNlM0NoYWxsZW5nZSBjdXJyQ2hhbGxlbmdlPXtjdXJyQ2hhbGxlbmdlfSBtYXhDaGFsbGVuZ2U9e21heENoYWxsZW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICBjaGFsbGVuZ2VTcGVjPXtjaGFsbGVuZ2VTcGVjfVxuICAgICAgICAgICAgICAgICAgICAgIHRhcmdldERyYWtlU2l6ZT17a1RhcmdldERyYWtlU2l6ZX0gY2x1dGNoU2l6ZT17a0NsdXRjaFNpemV9XG4gICAgICAgICAgICAgICAgICAgICAgZ2xvd0NvbG9yPXtrR2xvd0NvbG9yfSBkcm9wR2xvd0NvbG9yPXtrRHJvcEdsb3dDb2xvcn1cbiAgICAgICAgICAgICAgICAgICAgICBjb3JyZWN0R2xvd0NvbG9yPXtrQ29ycmVjdEdsb3dDb2xvcn0gaW5jb3JyZWN0R2xvd0NvbG9yPXtrSW5jb3JyZWN0R2xvd0NvbG9yfVxuICAgICAgICAgICAgICAgICAgICAgIG9uTmV4dENoYWxsZW5nZT17dGhpcy5oYW5kbGVOZXh0Q2hhbGxlbmdlfS8+XG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXIoKSB7XG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENhc2UzLCB7XG4gICAgICBjaGFsbGVuZ2VTcGVjczoga0NoYWxsZW5nZVNwZWNzLFxuICAgICAgb25Db21wbGV0ZUNhc2U6IGhhbmRsZUNvbXBsZXRlQ2FzZSB9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpXG4gICk7XG59XG5cbkdlbmlCbG9ja3MuQnV0dG9uLmVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0T25LZXlEb3duKCk7XG5cbnJlbmRlcigpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
