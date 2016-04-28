'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var caseSpecs = [{ title: "Case 1: Enter the Drake", className: 'case0', col: 1, path: 'case-1/', enabled: true }, { title: "Case 2: My, Oh Sis!", className: 'case1', col: 1, path: null, enabled: false }, { title: "Case 3: In the Clutches of Drakes", className: 'case2', col: 2, path: 'case-3/', enabled: true }, { title: "Case 4: Traits and Mates", className: 'case3', col: 2, path: null, enabled: false }, { title: "Case 5: Certification", className: 'case4', col: 2, path: 'case-5/', enabled: true }];

var CaseLog = function (_React$Component) {
  _inherits(CaseLog, _React$Component);

  function CaseLog() {
    _classCallCheck(this, CaseLog);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CaseLog).apply(this, arguments));
  }

  _createClass(CaseLog, [{
    key: 'render',
    value: function render() {

      var col1Cases = caseSpecs.filter(function (iCaseSpec) {
        return iCaseSpec.col === 1;
      }).map(mapCaseSpecToCaseLogEntry),
          col2Cases = caseSpecs.filter(function (iCaseSpec) {
        return iCaseSpec.col === 2;
      }).map(mapCaseSpecToCaseLogEntry);

      function mapCaseSpecToCaseLogEntry(iCaseSpec) {
        var onClick = iCaseSpec.path && iCaseSpec.enabled ? function () {
          window.location.href += iCaseSpec.path;
        } : null,
            disabledClass = iCaseSpec.enabled ? '' : 'case-disabled';
        return React.createElement(
          'div',
          { className: 'case caselog-active ' + iCaseSpec.className + ' ' + disabledClass,
            onClick: onClick },
          React.createElement(
            'div',
            { className: 'title' },
            React.createElement(
              'div',
              null,
              iCaseSpec.title
            )
          )
        );
      }

      return React.createElement(
        'div',
        { className: 'caselog-view' },
        React.createElement(
          'div',
          { id: 'caselog-wrap' },
          React.createElement(
            'div',
            { id: 'caselog-book' },
            React.createElement(
              'div',
              { id: 'col1' },
              React.createElement(
                'div',
                { id: 'title' },
                React.createElement(
                  'div',
                  { className: 'title' },
                  'Case Log'
                ),
                React.createElement(
                  'div',
                  { className: 'section' },
                  'Training'
                )
              ),
              col1Cases
            ),
            React.createElement(
              'div',
              { id: 'col2' },
              col2Cases
            )
          )
        )
      );
    }
  }]);

  return CaseLog;
}(React.Component);

function render() {
  ReactDOM.render(React.createElement(CaseLog, {}), document.getElementById('gv2'));
}

render();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhc2UtbG9nL2Nhc2UtbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFlBQVksQ0FDaEIsRUFBRSxPQUFPLHlCQUFULEVBQW9DLFdBQVcsT0FBL0MsRUFBd0QsS0FBSyxDQUE3RCxFQUFnRSxNQUFNLFNBQXRFLEVBQWlGLFNBQVMsSUFBMUYsRUFEZ0IsRUFFaEIsRUFBRSxPQUFPLHFCQUFULEVBQWdDLFdBQVcsT0FBM0MsRUFBb0QsS0FBSyxDQUF6RCxFQUE0RCxNQUFNLElBQWxFLEVBQXdFLFNBQVMsS0FBakYsRUFGZ0IsRUFHaEIsRUFBRSxPQUFPLG1DQUFULEVBQThDLFdBQVcsT0FBekQsRUFBa0UsS0FBSyxDQUF2RSxFQUEwRSxNQUFNLFNBQWhGLEVBQTJGLFNBQVMsSUFBcEcsRUFIZ0IsRUFJaEIsRUFBRSxPQUFPLDBCQUFULEVBQXFDLFdBQVcsT0FBaEQsRUFBeUQsS0FBSyxDQUE5RCxFQUFpRSxNQUFNLElBQXZFLEVBQTZFLFNBQVMsS0FBdEYsRUFKZ0IsRUFLaEIsRUFBRSxPQUFPLHVCQUFULEVBQWtDLFdBQVcsT0FBN0MsRUFBc0QsS0FBSyxDQUEzRCxFQUE4RCxNQUFNLFNBQXBFLEVBQStFLFNBQVMsSUFBeEYsRUFMZ0IsQ0FBbEI7O0lBUU0sTzs7Ozs7Ozs7Ozs7NkJBRUs7O0FBRVAsVUFBTSxZQUFZLFVBQ0csTUFESCxDQUNVLFVBQVMsU0FBVCxFQUFvQjtBQUMxQixlQUFPLFVBQVUsR0FBVixLQUFrQixDQUF6QjtBQUNELE9BSEgsRUFJRyxHQUpILENBSU8seUJBSlAsQ0FBbEI7VUFLTSxZQUFZLFVBQ0csTUFESCxDQUNVLFVBQVMsU0FBVCxFQUFvQjtBQUMxQixlQUFPLFVBQVUsR0FBVixLQUFrQixDQUF6QjtBQUNELE9BSEgsRUFJRyxHQUpILENBSU8seUJBSlAsQ0FMbEI7O0FBV0EsZUFBUyx5QkFBVCxDQUFtQyxTQUFuQyxFQUE4QztBQUM1QyxZQUFNLFVBQVUsVUFBVSxJQUFWLElBQWtCLFVBQVUsT0FBNUIsR0FDSSxZQUFXO0FBQUUsaUJBQU8sUUFBUCxDQUFnQixJQUFoQixJQUF3QixVQUFVLElBQWxDO0FBQXlDLFNBRDFELEdBRUksSUFGcEI7WUFHTSxnQkFBZ0IsVUFBVSxPQUFWLEdBQW9CLEVBQXBCLEdBQXlCLGVBSC9DO0FBSUEsZUFDRTtBQUFBO1VBQUEsRUFBSyxvQ0FBa0MsVUFBVSxTQUE1QyxTQUF5RCxhQUE5RDtBQUNNLHFCQUFTLE9BRGY7VUFFRTtBQUFBO1lBQUEsRUFBSyxXQUFVLE9BQWY7WUFDRTtBQUFBO2NBQUE7Y0FBTSxVQUFVO0FBQWhCO0FBREY7QUFGRixTQURGO0FBUUQ7O0FBRUQsYUFDRTtBQUFBO1FBQUEsRUFBSyxXQUFVLGNBQWY7UUFDRTtBQUFBO1VBQUEsRUFBSyxJQUFHLGNBQVI7VUFDRTtBQUFBO1lBQUEsRUFBSyxJQUFHLGNBQVI7WUFDRTtBQUFBO2NBQUEsRUFBSyxJQUFHLE1BQVI7Y0FDRTtBQUFBO2dCQUFBLEVBQUssSUFBRyxPQUFSO2dCQUNFO0FBQUE7a0JBQUEsRUFBSyxXQUFVLE9BQWY7a0JBQUE7QUFBQSxpQkFERjtnQkFFRTtBQUFBO2tCQUFBLEVBQUssV0FBVSxTQUFmO2tCQUFBO0FBQUE7QUFGRixlQURGO2NBS0c7QUFMSCxhQURGO1lBUUU7QUFBQTtjQUFBLEVBQUssSUFBRyxNQUFSO2NBQ0c7QUFESDtBQVJGO0FBREY7QUFERixPQURGO0FBa0JEOzs7O0VBaERtQixNQUFNLFM7O0FBbUQ1QixTQUFTLE1BQVQsR0FBa0I7QUFDaEIsV0FBUyxNQUFULENBQ0UsTUFBTSxhQUFOLENBQW9CLE9BQXBCLEVBQTZCLEVBQTdCLENBREYsRUFFRSxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsQ0FGRjtBQUlEOztBQUVEIiwiZmlsZSI6ImNhc2UtbG9nL2Nhc2UtbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY2FzZVNwZWNzID0gW1xuICB7IHRpdGxlOiBcIkNhc2UgMTogRW50ZXIgdGhlIERyYWtlXCIsIGNsYXNzTmFtZTogJ2Nhc2UwJywgY29sOiAxLCBwYXRoOiAnY2FzZS0xLycsIGVuYWJsZWQ6IHRydWUgfSxcbiAgeyB0aXRsZTogXCJDYXNlIDI6IE15LCBPaCBTaXMhXCIsIGNsYXNzTmFtZTogJ2Nhc2UxJywgY29sOiAxLCBwYXRoOiBudWxsLCBlbmFibGVkOiBmYWxzZSB9LFxuICB7IHRpdGxlOiBcIkNhc2UgMzogSW4gdGhlIENsdXRjaGVzIG9mIERyYWtlc1wiLCBjbGFzc05hbWU6ICdjYXNlMicsIGNvbDogMiwgcGF0aDogJ2Nhc2UtMy8nLCBlbmFibGVkOiB0cnVlIH0sXG4gIHsgdGl0bGU6IFwiQ2FzZSA0OiBUcmFpdHMgYW5kIE1hdGVzXCIsIGNsYXNzTmFtZTogJ2Nhc2UzJywgY29sOiAyLCBwYXRoOiBudWxsLCBlbmFibGVkOiBmYWxzZSB9LFxuICB7IHRpdGxlOiBcIkNhc2UgNTogQ2VydGlmaWNhdGlvblwiLCBjbGFzc05hbWU6ICdjYXNlNCcsIGNvbDogMiwgcGF0aDogJ2Nhc2UtNS8nLCBlbmFibGVkOiB0cnVlIH1cbl07XG5cbmNsYXNzIENhc2VMb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHJlbmRlcigpIHtcblxuICAgIGNvbnN0IGNvbDFDYXNlcyA9IGNhc2VTcGVjc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihpQ2FzZVNwZWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlDYXNlU3BlYy5jb2wgPT09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChtYXBDYXNlU3BlY1RvQ2FzZUxvZ0VudHJ5KSxcbiAgICAgICAgICBjb2wyQ2FzZXMgPSBjYXNlU3BlY3NcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oaUNhc2VTcGVjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpQ2FzZVNwZWMuY29sID09PSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAobWFwQ2FzZVNwZWNUb0Nhc2VMb2dFbnRyeSk7XG5cbiAgICBmdW5jdGlvbiBtYXBDYXNlU3BlY1RvQ2FzZUxvZ0VudHJ5KGlDYXNlU3BlYykge1xuICAgICAgY29uc3Qgb25DbGljayA9IGlDYXNlU3BlYy5wYXRoICYmIGlDYXNlU3BlYy5lbmFibGVkXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uKCkgeyB3aW5kb3cubG9jYXRpb24uaHJlZiArPSBpQ2FzZVNwZWMucGF0aDsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgZGlzYWJsZWRDbGFzcyA9IGlDYXNlU3BlYy5lbmFibGVkID8gJycgOiAnY2FzZS1kaXNhYmxlZCc7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGNhc2UgY2FzZWxvZy1hY3RpdmUgJHtpQ2FzZVNwZWMuY2xhc3NOYW1lfSAke2Rpc2FibGVkQ2xhc3N9YH1cbiAgICAgICAgICAgICAgb25DbGljaz17b25DbGlja30+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RpdGxlJz5cbiAgICAgICAgICAgIDxkaXY+e2lDYXNlU3BlYy50aXRsZX08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nY2FzZWxvZy12aWV3Jz5cbiAgICAgICAgPGRpdiBpZD0nY2FzZWxvZy13cmFwJz5cbiAgICAgICAgICA8ZGl2IGlkPSdjYXNlbG9nLWJvb2snPlxuICAgICAgICAgICAgPGRpdiBpZD0nY29sMSc+XG4gICAgICAgICAgICAgIDxkaXYgaWQ9J3RpdGxlJz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndGl0bGUnPkNhc2UgTG9nPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlY3Rpb24nPlRyYWluaW5nPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICB7Y29sMUNhc2VzfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPSdjb2wyJz5cbiAgICAgICAgICAgICAge2NvbDJDYXNlc31cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyKCkge1xuICBSZWFjdERPTS5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChDYXNlTG9nLCB7fSksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2d2MicpXG4gICk7XG59XG5cbnJlbmRlcigpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
