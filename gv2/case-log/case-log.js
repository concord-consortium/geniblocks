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
            key: iCaseSpec.className, onClick: onClick },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhc2UtbG9nL2Nhc2UtbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFlBQVksQ0FDaEIsRUFBRSxPQUFPLHlCQUFULEVBQW9DLFdBQVcsT0FBL0MsRUFBd0QsS0FBSyxDQUE3RCxFQUFnRSxNQUFNLFNBQXRFLEVBQWlGLFNBQVMsSUFBMUYsRUFEZ0IsRUFFaEIsRUFBRSxPQUFPLHFCQUFULEVBQWdDLFdBQVcsT0FBM0MsRUFBb0QsS0FBSyxDQUF6RCxFQUE0RCxNQUFNLElBQWxFLEVBQXdFLFNBQVMsS0FBakYsRUFGZ0IsRUFHaEIsRUFBRSxPQUFPLG1DQUFULEVBQThDLFdBQVcsT0FBekQsRUFBa0UsS0FBSyxDQUF2RSxFQUEwRSxNQUFNLFNBQWhGLEVBQTJGLFNBQVMsSUFBcEcsRUFIZ0IsRUFJaEIsRUFBRSxPQUFPLDBCQUFULEVBQXFDLFdBQVcsT0FBaEQsRUFBeUQsS0FBSyxDQUE5RCxFQUFpRSxNQUFNLElBQXZFLEVBQTZFLFNBQVMsS0FBdEYsRUFKZ0IsRUFLaEIsRUFBRSxPQUFPLHVCQUFULEVBQWtDLFdBQVcsT0FBN0MsRUFBc0QsS0FBSyxDQUEzRCxFQUE4RCxNQUFNLFNBQXBFLEVBQStFLFNBQVMsSUFBeEYsRUFMZ0IsQ0FBbEI7O0lBUU0sTzs7Ozs7Ozs7Ozs7NkJBRUs7O0FBRVAsVUFBTSxZQUFZLFVBQ0csTUFESCxDQUNVLFVBQVMsU0FBVCxFQUFvQjtBQUMxQixlQUFPLFVBQVUsR0FBVixLQUFrQixDQUF6QjtBQUNELE9BSEgsRUFJRyxHQUpILENBSU8seUJBSlAsQ0FBbEI7VUFLTSxZQUFZLFVBQ0csTUFESCxDQUNVLFVBQVMsU0FBVCxFQUFvQjtBQUMxQixlQUFPLFVBQVUsR0FBVixLQUFrQixDQUF6QjtBQUNELE9BSEgsRUFJRyxHQUpILENBSU8seUJBSlAsQ0FMbEI7O0FBV0EsZUFBUyx5QkFBVCxDQUFtQyxTQUFuQyxFQUE4QztBQUM1QyxZQUFNLFVBQVUsVUFBVSxJQUFWLElBQWtCLFVBQVUsT0FBNUIsR0FDSSxZQUFXO0FBQUUsaUJBQU8sUUFBUCxDQUFnQixJQUFoQixJQUF3QixVQUFVLElBQWxDO0FBQXlDLFNBRDFELEdBRUksSUFGcEI7WUFHTSxnQkFBZ0IsVUFBVSxPQUFWLEdBQW9CLEVBQXBCLEdBQXlCLGVBSC9DO0FBSUEsZUFDRTtBQUFBO1VBQUEsRUFBSyxvQ0FBa0MsVUFBVSxTQUE1QyxTQUF5RCxhQUE5RDtBQUNNLGlCQUFLLFVBQVUsU0FEckIsRUFDZ0MsU0FBUyxPQUR6QztVQUVFO0FBQUE7WUFBQSxFQUFLLFdBQVUsT0FBZjtZQUNFO0FBQUE7Y0FBQTtjQUFNLFVBQVU7QUFBaEI7QUFERjtBQUZGLFNBREY7QUFRRDs7QUFFRCxhQUNFO0FBQUE7UUFBQSxFQUFLLFdBQVUsY0FBZjtRQUNFO0FBQUE7VUFBQSxFQUFLLElBQUcsY0FBUjtVQUNFO0FBQUE7WUFBQSxFQUFLLElBQUcsY0FBUjtZQUNFO0FBQUE7Y0FBQSxFQUFLLElBQUcsTUFBUjtjQUNFO0FBQUE7Z0JBQUEsRUFBSyxJQUFHLE9BQVI7Z0JBQ0U7QUFBQTtrQkFBQSxFQUFLLFdBQVUsT0FBZjtrQkFBQTtBQUFBLGlCQURGO2dCQUVFO0FBQUE7a0JBQUEsRUFBSyxXQUFVLFNBQWY7a0JBQUE7QUFBQTtBQUZGLGVBREY7Y0FLRztBQUxILGFBREY7WUFRRTtBQUFBO2NBQUEsRUFBSyxJQUFHLE1BQVI7Y0FDRztBQURIO0FBUkY7QUFERjtBQURGLE9BREY7QUFrQkQ7Ozs7RUFoRG1CLE1BQU0sUzs7QUFtRDVCLFNBQVMsTUFBVCxHQUFrQjtBQUNoQixXQUFTLE1BQVQsQ0FDRSxNQUFNLGFBQU4sQ0FBb0IsT0FBcEIsRUFBNkIsRUFBN0IsQ0FERixFQUVFLFNBQVMsY0FBVCxDQUF3QixLQUF4QixDQUZGO0FBSUQ7O0FBRUQiLCJmaWxlIjoiY2FzZS1sb2cvY2FzZS1sb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjYXNlU3BlY3MgPSBbXG4gIHsgdGl0bGU6IFwiQ2FzZSAxOiBFbnRlciB0aGUgRHJha2VcIiwgY2xhc3NOYW1lOiAnY2FzZTAnLCBjb2w6IDEsIHBhdGg6ICdjYXNlLTEvJywgZW5hYmxlZDogdHJ1ZSB9LFxuICB7IHRpdGxlOiBcIkNhc2UgMjogTXksIE9oIFNpcyFcIiwgY2xhc3NOYW1lOiAnY2FzZTEnLCBjb2w6IDEsIHBhdGg6IG51bGwsIGVuYWJsZWQ6IGZhbHNlIH0sXG4gIHsgdGl0bGU6IFwiQ2FzZSAzOiBJbiB0aGUgQ2x1dGNoZXMgb2YgRHJha2VzXCIsIGNsYXNzTmFtZTogJ2Nhc2UyJywgY29sOiAyLCBwYXRoOiAnY2FzZS0zLycsIGVuYWJsZWQ6IHRydWUgfSxcbiAgeyB0aXRsZTogXCJDYXNlIDQ6IFRyYWl0cyBhbmQgTWF0ZXNcIiwgY2xhc3NOYW1lOiAnY2FzZTMnLCBjb2w6IDIsIHBhdGg6IG51bGwsIGVuYWJsZWQ6IGZhbHNlIH0sXG4gIHsgdGl0bGU6IFwiQ2FzZSA1OiBDZXJ0aWZpY2F0aW9uXCIsIGNsYXNzTmFtZTogJ2Nhc2U0JywgY29sOiAyLCBwYXRoOiAnY2FzZS01LycsIGVuYWJsZWQ6IHRydWUgfVxuXTtcblxuY2xhc3MgQ2FzZUxvZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuXG4gICAgY29uc3QgY29sMUNhc2VzID0gY2FzZVNwZWNzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGlDYXNlU3BlYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaUNhc2VTcGVjLmNvbCA9PT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKG1hcENhc2VTcGVjVG9DYXNlTG9nRW50cnkpLFxuICAgICAgICAgIGNvbDJDYXNlcyA9IGNhc2VTcGVjc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihpQ2FzZVNwZWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlDYXNlU3BlYy5jb2wgPT09IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChtYXBDYXNlU3BlY1RvQ2FzZUxvZ0VudHJ5KTtcblxuICAgIGZ1bmN0aW9uIG1hcENhc2VTcGVjVG9DYXNlTG9nRW50cnkoaUNhc2VTcGVjKSB7XG4gICAgICBjb25zdCBvbkNsaWNrID0gaUNhc2VTcGVjLnBhdGggJiYgaUNhc2VTcGVjLmVuYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgID8gZnVuY3Rpb24oKSB7IHdpbmRvdy5sb2NhdGlvbi5ocmVmICs9IGlDYXNlU3BlYy5wYXRoOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgICBkaXNhYmxlZENsYXNzID0gaUNhc2VTcGVjLmVuYWJsZWQgPyAnJyA6ICdjYXNlLWRpc2FibGVkJztcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgY2FzZSBjYXNlbG9nLWFjdGl2ZSAke2lDYXNlU3BlYy5jbGFzc05hbWV9ICR7ZGlzYWJsZWRDbGFzc31gfVxuICAgICAgICAgICAgICBrZXk9e2lDYXNlU3BlYy5jbGFzc05hbWV9IG9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0aXRsZSc+XG4gICAgICAgICAgICA8ZGl2PntpQ2FzZVNwZWMudGl0bGV9PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2Nhc2Vsb2ctdmlldyc+XG4gICAgICAgIDxkaXYgaWQ9J2Nhc2Vsb2ctd3JhcCc+XG4gICAgICAgICAgPGRpdiBpZD0nY2FzZWxvZy1ib29rJz5cbiAgICAgICAgICAgIDxkaXYgaWQ9J2NvbDEnPlxuICAgICAgICAgICAgICA8ZGl2IGlkPSd0aXRsZSc+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RpdGxlJz5DYXNlIExvZzwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWN0aW9uJz5UcmFpbmluZzwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAge2NvbDFDYXNlc31cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD0nY29sMic+XG4gICAgICAgICAgICAgIHtjb2wyQ2FzZXN9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgUmVhY3RET00ucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2FzZUxvZywge30pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdndjInKVxuICApO1xufVxuXG5yZW5kZXIoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
