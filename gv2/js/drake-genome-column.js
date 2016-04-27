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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2RyYWtlLWdlbm9tZS1jb2x1bW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFJTSxpQjs7Ozs7Ozs7Ozs7NkJBcUJLO0FBQUEsbUJBRTBDLEtBQUssS0FGL0M7QUFBQSxVQUNDLEVBREQsVUFDQyxFQUREO0FBQUEsVUFDSyxRQURMLFVBQ0ssUUFETDtBQUFBLFVBQ2UsV0FEZixVQUNlLFdBRGY7QUFBQSxVQUM0QixLQUQ1QixVQUM0QixLQUQ1QjtBQUFBLFVBQ21DLFNBRG5DLFVBQ21DLFNBRG5DO0FBQUEsVUFDOEMsUUFEOUMsVUFDOEMsUUFEOUM7QUFBQSxVQUVDLGFBRkQsVUFFQyxhQUZEO0FBQUEsVUFFZ0IsUUFGaEIsVUFFZ0IsUUFGaEI7QUFDRCxVQUMyQixXQUQzQixVQUMyQixXQUQzQjtBQUVBLHlCQUFrQixRQUFsQjtBQUNBLHVCQUFnQixRQUFoQjtBQUNBLHVCQUFhLFlBQ0csb0JBQUMsVUFBRCxDQUFZLGdCQUFaLElBQTZCLElBQUksVUFBakMsRUFBNkMsV0FBVSxjQUF2RDtBQUNFLGFBQUssS0FEUCxFQUNjLE9BQU0sU0FEcEIsRUFDOEIsTUFBTSxHQURwQyxHQURILEdBR0csSUFIaEI7QUFJQSxtQkFBUyxXQUNHLG9CQUFDLFVBQUQsQ0FBWSxNQUFaLElBQW1CLElBQUksUUFBdkIsRUFBaUMsT0FBTyxXQUF4QztBQUNvQixpQkFBUyxLQUFLLEtBQUwsQ0FBVyxhQUR4QyxHQURILEdBR0csSUFIWjtBQUlOLGFBQ0U7QUFBQTtRQUFBLEVBQUssSUFBSSxFQUFULEVBQWEsV0FBVSxRQUF2QjtRQUdFO0FBQUE7VUFBQSxFQUFLLElBQUksWUFBVCxFQUF1QixXQUFVLGNBQWpDO1VBQWlEO0FBQWpELFNBSEY7UUFNRyxVQU5IO1FBU0Usb0JBQUMsVUFBRCxDQUFZLFVBQVo7QUFDRSxxQkFBVSxlQURaLEVBQzRCLEtBQUssS0FEakMsRUFDd0MsZUFBZSxhQUR2RDtBQUVFLG9CQUFVLFFBRlosRUFFc0IsZ0JBQWdCLEtBQUssS0FBTCxDQUFXLGNBRmpELEdBVEY7UUFjRztBQWRILE9BREY7QUFrQkQ7Ozs7RUFwRDZCLE1BQU0sUzs7QUFBaEMsaUIsQ0FFRyxTLEdBQVk7QUFDakIsTUFBSSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFEVjtBQUVqQixZQUFVLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUZoQjtBQUdqQixlQUFhLE1BQU0sU0FBTixDQUFnQixNQUhaO0FBSWpCLFNBQU8sTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBSmI7QUFLakIsYUFBVyxNQUFNLFNBQU4sQ0FBZ0IsSUFMVjtBQU1qQixZQUFVLE1BQU0sU0FBTixDQUFnQixJQUFoQixDQUFxQixVQU5kO0FBT2pCLGlCQUFlLE1BQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixNQUFNLFNBQU4sQ0FBZ0IsTUFBeEMsQ0FQRTtBQVFqQixrQkFBZ0IsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBUnBCO0FBU2pCLFlBQVUsTUFBTSxTQUFOLENBQWdCLE1BVFQ7QUFVakIsZUFBYSxNQUFNLFNBQU4sQ0FBZ0IsTUFWWjtBQVdqQixpQkFBZSxNQUFNLFNBQU4sQ0FBZ0I7QUFYZCxDO0FBRmYsaUIsQ0FnQkcsWSxHQUFlO0FBQ3BCLGVBQWEsRUFETztBQUVwQixhQUFXO0FBRlMsQzs7O0FBdUN4QiIsImZpbGUiOiJqcy9kcmFrZS1nZW5vbWUtY29sdW1uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEcmFrZUdlbm9tZUNvbHVtbiAtIHNob3dzIGRyYWtlIGltYWdlIGFuZCBnZW5vbWVcbiAqL1xuLyogZXhwb3J0ZWQgRHJha2VHZW5vbWVDb2x1bW4gKi9cbmNsYXNzIERyYWtlR2Vub21lQ29sdW1uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgaWRQcmVmaXg6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBjb2x1bW5MYWJlbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkcmFrZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHNob3dEcmFrZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgZWRpdGFibGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZyksXG4gICAgb25BbGxlbGVDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYnV0dG9uSUQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgYnV0dG9uTGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgb25CdXR0b25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgY29sdW1uTGFiZWw6IFwiXCIsXG4gICAgc2hvd0RyYWtlOiB0cnVlXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBpZCwgaWRQcmVmaXgsIGNvbHVtbkxhYmVsLCBkcmFrZSwgc2hvd0RyYWtlLCBlZGl0YWJsZSxcbiAgICAgICAgICAgIGhpZGRlbkFsbGVsZXMsIGJ1dHRvbklELCBidXR0b25MYWJlbCB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICBkcmFrZUxhYmVsSUQgPSBgJHtpZFByZWZpeH0tZHJha2UtbGFiZWxgLFxuICAgICAgICAgIGRyYWtlT3JnSUQgPSBgJHtpZFByZWZpeH0tZHJha2VgLFxuICAgICAgICAgIGRyYWtlSW1hZ2UgPSBzaG93RHJha2VcbiAgICAgICAgICAgICAgICAgICAgICAgID8gPEdlbmlCbG9ja3MuT3JnYW5pc21HbG93VmlldyBpZD17ZHJha2VPcmdJRH0gY2xhc3NOYW1lPSdwYXJlbnQtZHJha2UnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZz17ZHJha2V9IGNvbG9yPScjRkZGRkFBJyBzaXplPXsyMDB9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgYnV0dG9uID0gYnV0dG9uSURcbiAgICAgICAgICAgICAgICAgICAgPyA8R2VuaUJsb2Nrcy5CdXR0b24gaWQ9e2J1dHRvbklEfSBsYWJlbD17YnV0dG9uTGFiZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQnV0dG9uQ2xpY2t9Lz5cbiAgICAgICAgICAgICAgICAgICAgOiBudWxsO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPSdjb2x1bW4nPlxuXG4gICAgICAgIHsvKiBjb2x1bW4gbGFiZWwgKi99XG4gICAgICAgIDxkaXYgaWQ9e2RyYWtlTGFiZWxJRH0gY2xhc3NOYW1lPVwiY29sdW1uLWxhYmVsXCI+e2NvbHVtbkxhYmVsfTwvZGl2PlxuXG4gICAgICAgIHsvKiBvcHRpb25hbCBkcmFrZSBpbWFnZSAqL31cbiAgICAgICAge2RyYWtlSW1hZ2V9XG5cbiAgICAgICAgey8qIGRyYWtlIGdlbm9tZSAqL31cbiAgICAgICAgPEdlbmlCbG9ja3MuR2Vub21lVmlld1xuICAgICAgICAgIGNsYXNzTmFtZT0ncGFyZW50LWdlbm9tZScgb3JnPXtkcmFrZX0gaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICBlZGl0YWJsZT17ZWRpdGFibGV9IG9uQWxsZWxlQ2hhbmdlPXt0aGlzLnByb3BzLm9uQWxsZWxlQ2hhbmdlfSAvPlxuXG4gICAgICAgIHsvKiBvcHRpb25hbCBidXR0b24gKi99XG4gICAgICAgIHtidXR0b259XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkRyYWtlR2Vub21lQ29sdW1uO1xuLy9leHBvcnQgZGVmYXVsdCBEcmFrZUdlbm9tZUNvbHVtbjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
