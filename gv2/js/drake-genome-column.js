'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var /**
     * DrakeGenomeColumn - shows drake image and genome
     */
/* exported DrakeGenomeColumn */
DrakeGenomeColumn = function (_React$Component) {
  _inherits(DrakeGenomeColumn, _React$Component);

  function DrakeGenomeColumn() {
    _classCallCheck(this, DrakeGenomeColumn);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DrakeGenomeColumn).apply(this, arguments));
  }

  _createClass(DrakeGenomeColumn, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var id = _props.id;
      var idPrefix = _props.idPrefix;
      var columnLabel = _props.columnLabel;
      var drake = _props.drake;
      var showDrake = _props.showDrake;
      var editable = _props.editable;
      var hiddenAlleles = _props.hiddenAlleles;
      var buttonID = _props.buttonID;
      var buttonLabel = _props.buttonLabel;
      var drakeLabelID = idPrefix + '-drake-label';
      var drakeOrgID = idPrefix + '-drake';
      var drakeImage = showDrake ? React.createElement(GeniBlocks.OrganismGlowView, { id: drakeOrgID, className: 'parent-drake',
        org: drake, color: '#FFFFAA', size: 200 }) : null;
      var button = buttonID ? React.createElement(GeniBlocks.Button, { id: buttonID, label: buttonLabel,
        onClick: this.props.onButtonClick }) : null;
      return React.createElement(
        'div',
        { id: id, className: 'column' },
        React.createElement(
          'div',
          { id: drakeLabelID, className: 'column-label' },
          columnLabel
        ),
        drakeImage,
        React.createElement(GeniBlocks.GenomeView, {
          className: 'parent-genome', org: drake, hiddenAlleles: hiddenAlleles,
          editable: editable, onAlleleChange: this.props.onAlleleChange }),
        button
      );
    }
  }]);

  return DrakeGenomeColumn;
}(React.Component);

DrakeGenomeColumn.propTypes = {
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
};
DrakeGenomeColumn.defaultProps = {
  columnLabel: "",
  showDrake: true
};


DrakeGenomeColumn;
//export default DrakeGenomeColumn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2RyYWtlLWdlbm9tZS1jb2x1bW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFJTTs7Ozs7Ozs7Ozs7NkJBcUJLO21CQUUwQyxLQUFLLEtBQUwsQ0FGMUM7VUFDQyxlQUREO1VBQ0ssMkJBREw7VUFDZSxpQ0FEZjtVQUM0QixxQkFENUI7VUFDbUMsNkJBRG5DO1VBQzhDLDJCQUQ5QztVQUVDLHFDQUZEO1VBRWdCLDJCQUZoQjtBQUNELFVBQzJCLGdDQUQzQixDQURDO0FBR0QseUJBQWtCLHlCQUFsQixDQUhDO0FBSUQsdUJBQWdCLG1CQUFoQixDQUpDO0FBS0QsdUJBQWEsWUFDRyxvQkFBQyxXQUFXLGdCQUFaLElBQTZCLElBQUksVUFBSixFQUFnQixXQUFVLGNBQVY7QUFDM0MsYUFBSyxLQUFMLEVBQVksT0FBTSxTQUFOLEVBQWdCLE1BQU0sR0FBTixFQUQ5QixDQURILEdBR0csSUFISCxDQUxaO0FBU0QsbUJBQVMsV0FDRyxvQkFBQyxXQUFXLE1BQVosSUFBbUIsSUFBSSxRQUFKLEVBQWMsT0FBTyxXQUFQO0FBQ2IsaUJBQVMsS0FBSyxLQUFMLENBQVcsYUFBWCxFQUQ3QixDQURILEdBR0csSUFISCxDQVRSO0FBYVAsYUFDRTs7VUFBSyxJQUFJLEVBQUosRUFBUSxXQUFVLFFBQVYsRUFBYjtRQUdFOztZQUFLLElBQUksWUFBSixFQUFrQixXQUFVLGNBQVYsRUFBdkI7VUFBaUQsV0FBakQ7U0FIRjtRQU1HLFVBTkg7UUFTRSxvQkFBQyxXQUFXLFVBQVo7QUFDRSxxQkFBVSxlQUFWLEVBQTBCLEtBQUssS0FBTCxFQUFZLGVBQWUsYUFBZjtBQUN0QyxvQkFBVSxRQUFWLEVBQW9CLGdCQUFnQixLQUFLLEtBQUwsQ0FBVyxjQUFYLEVBRnRDLENBVEY7UUFjRyxNQWRIO09BREYsQ0FiTzs7OztTQXJCTDtFQUEwQixNQUFNLFNBQU47O0FBQTFCLGtCQUVHLFlBQVk7QUFDakIsTUFBSSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDSixZQUFVLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNWLGVBQWEsTUFBTSxTQUFOLENBQWdCLE1BQWhCO0FBQ2IsU0FBTyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDUCxhQUFXLE1BQU0sU0FBTixDQUFnQixJQUFoQjtBQUNYLFlBQVUsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBQXJCO0FBQ1YsaUJBQWUsTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF2QztBQUNBLGtCQUFnQixNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7QUFDaEIsWUFBVSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEI7QUFDVixlQUFhLE1BQU0sU0FBTixDQUFnQixNQUFoQjtBQUNiLGlCQUFlLE1BQU0sU0FBTixDQUFnQixJQUFoQjs7QUFiYixrQkFnQkcsZUFBZTtBQUNwQixlQUFhLEVBQWI7QUFDQSxhQUFXLElBQVg7Ozs7QUFxQ0oiLCJmaWxlIjoianMvZHJha2UtZ2Vub21lLWNvbHVtbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRHJha2VHZW5vbWVDb2x1bW4gLSBzaG93cyBkcmFrZSBpbWFnZSBhbmQgZ2Vub21lXG4gKi9cbi8qIGV4cG9ydGVkIERyYWtlR2Vub21lQ29sdW1uICovXG5jbGFzcyBEcmFrZUdlbm9tZUNvbHVtbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGlkUHJlZml4OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY29sdW1uTGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgZHJha2U6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBzaG93RHJha2U6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIGVkaXRhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLFxuICAgIG9uQWxsZWxlQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGJ1dHRvbklEOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGJ1dHRvbkxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIG9uQnV0dG9uQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNvbHVtbkxhYmVsOiBcIlwiLFxuICAgIHNob3dEcmFrZTogdHJ1ZVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgaWQsIGlkUHJlZml4LCBjb2x1bW5MYWJlbCwgZHJha2UsIHNob3dEcmFrZSwgZWRpdGFibGUsXG4gICAgICAgICAgICBoaWRkZW5BbGxlbGVzLCBidXR0b25JRCwgYnV0dG9uTGFiZWwgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgZHJha2VMYWJlbElEID0gYCR7aWRQcmVmaXh9LWRyYWtlLWxhYmVsYCxcbiAgICAgICAgICBkcmFrZU9yZ0lEID0gYCR7aWRQcmVmaXh9LWRyYWtlYCxcbiAgICAgICAgICBkcmFrZUltYWdlID0gc2hvd0RyYWtlXG4gICAgICAgICAgICAgICAgICAgICAgICA/IDxHZW5pQmxvY2tzLk9yZ2FuaXNtR2xvd1ZpZXcgaWQ9e2RyYWtlT3JnSUR9IGNsYXNzTmFtZT0ncGFyZW50LWRyYWtlJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmc9e2RyYWtlfSBjb2xvcj0nI0ZGRkZBQScgc2l6ZT17MjAwfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgIGJ1dHRvbiA9IGJ1dHRvbklEXG4gICAgICAgICAgICAgICAgICAgID8gPEdlbmlCbG9ja3MuQnV0dG9uIGlkPXtidXR0b25JRH0gbGFiZWw9e2J1dHRvbkxhYmVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5vbkJ1dHRvbkNsaWNrfS8+XG4gICAgICAgICAgICAgICAgICAgIDogbnVsbDtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD17aWR9IGNsYXNzTmFtZT0nY29sdW1uJz5cblxuICAgICAgICB7LyogY29sdW1uIGxhYmVsICovfVxuICAgICAgICA8ZGl2IGlkPXtkcmFrZUxhYmVsSUR9IGNsYXNzTmFtZT1cImNvbHVtbi1sYWJlbFwiPntjb2x1bW5MYWJlbH08L2Rpdj5cblxuICAgICAgICB7Lyogb3B0aW9uYWwgZHJha2UgaW1hZ2UgKi99XG4gICAgICAgIHtkcmFrZUltYWdlfVxuXG4gICAgICAgIHsvKiBkcmFrZSBnZW5vbWUgKi99XG4gICAgICAgIDxHZW5pQmxvY2tzLkdlbm9tZVZpZXdcbiAgICAgICAgICBjbGFzc05hbWU9J3BhcmVudC1nZW5vbWUnIG9yZz17ZHJha2V9IGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgZWRpdGFibGU9e2VkaXRhYmxlfSBvbkFsbGVsZUNoYW5nZT17dGhpcy5wcm9wcy5vbkFsbGVsZUNoYW5nZX0gLz5cblxuICAgICAgICB7Lyogb3B0aW9uYWwgYnV0dG9uICovfVxuICAgICAgICB7YnV0dG9ufVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5EcmFrZUdlbm9tZUNvbHVtbjtcbi8vZXhwb3J0IGRlZmF1bHQgRHJha2VHZW5vbWVDb2x1bW47XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
