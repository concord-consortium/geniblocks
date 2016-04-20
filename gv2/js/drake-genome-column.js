"use strict";

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
    key: "render",
    value: function render() {
      var _props = this.props;
      var id = _props.id;
      var sex = _props.sex;
      var drake = _props.drake;
      var isDrakeEditable = _props.isDrakeEditable;
      var hiddenAlleles = _props.hiddenAlleles;
      var alleleChanged = _props.alleleChanged;
      var drakeLabelID = sex + "-drake-label";
      var columnLabel = sex.charAt(0).toUpperCase() + sex.slice(1) + " Drake";
      var drakeOrgID = sex + "-drake";
      return React.createElement(
        "div",
        { id: id, className: "column" },
        React.createElement(
          "div",
          { id: drakeLabelID, className: "column-label" },
          columnLabel
        ),
        React.createElement(GeniBlocks.OrganismGlowView, {
          id: drakeOrgID, className: "parent-drake", org: drake, color: "#FFFFAA", size: 200 }),
        React.createElement(GeniBlocks.GenomeView, {
          className: "parent-genome", org: drake, hiddenAlleles: hiddenAlleles,
          editable: isDrakeEditable, alleleChanged: alleleChanged })
      );
    }
  }]);

  return DrakeGenomeColumn;
}(React.Component);

DrakeGenomeColumn.propTypes = {
  id: React.PropTypes.string.isRequired,
  sex: React.PropTypes.string.isRequired,
  drake: React.PropTypes.object.isRequired,
  isDrakeEditable: React.PropTypes.bool.isRequired,
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  alleleChanged: React.PropTypes.func.isRequired
};


DrakeGenomeColumn;
//export default DrakeGenomeColumn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2RyYWtlLWdlbm9tZS1jb2x1bW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFJTTs7Ozs7Ozs7Ozs7NkJBV0s7bUJBQ21FLEtBQUssS0FBTCxDQURuRTtVQUNDLGVBREQ7VUFDSyxpQkFETDtVQUNVLHFCQURWO1VBQ2lCLHlDQURqQjtVQUNrQyxxQ0FEbEM7QUFDRCxVQUFrRCxvQ0FBbEQsQ0FEQztBQUVELHlCQUFrQixvQkFBbEIsQ0FGQztBQUdELHdCQUFpQixJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsV0FBZCxLQUE4QixJQUFJLEtBQUosQ0FBVSxDQUFWLENBQTlCLFdBQWpCLENBSEM7QUFJRCx1QkFBZ0IsY0FBaEIsQ0FKQztBQUtQLGFBQ0U7O1VBQUssSUFBSSxFQUFKLEVBQVEsV0FBVSxRQUFWLEVBQWI7UUFHRTs7WUFBSyxJQUFJLFlBQUosRUFBa0IsV0FBVSxjQUFWLEVBQXZCO1VBQWlELFdBQWpEO1NBSEY7UUFNRSxvQkFBQyxXQUFXLGdCQUFaO0FBQ0UsY0FBSSxVQUFKLEVBQWdCLFdBQVUsY0FBVixFQUF5QixLQUFLLEtBQUwsRUFBWSxPQUFNLFNBQU4sRUFBZ0IsTUFBTSxHQUFOLEVBRHZFLENBTkY7UUFVRSxvQkFBQyxXQUFXLFVBQVo7QUFDRSxxQkFBVSxlQUFWLEVBQTBCLEtBQUssS0FBTCxFQUFZLGVBQWUsYUFBZjtBQUN0QyxvQkFBVSxlQUFWLEVBQTJCLGVBQWUsYUFBZixFQUY3QixDQVZGO09BREYsQ0FMTzs7OztTQVhMO0VBQTBCLE1BQU0sU0FBTjs7QUFBMUIsa0JBRUcsWUFBWTtBQUNqQixNQUFJLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNKLE9BQUssTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ0wsU0FBTyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDUCxtQkFBaUIsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBQXJCO0FBQ2pCLGlCQUFlLE1BQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdkM7QUFDQSxpQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7Ozs7QUEyQm5CIiwiZmlsZSI6ImpzL2RyYWtlLWdlbm9tZS1jb2x1bW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERyYWtlR2Vub21lQ29sdW1uIC0gc2hvd3MgZHJha2UgaW1hZ2UgYW5kIGdlbm9tZVxuICovXG4vKiBleHBvcnRlZCBEcmFrZUdlbm9tZUNvbHVtbiAqL1xuY2xhc3MgRHJha2VHZW5vbWVDb2x1bW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBzZXg6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBkcmFrZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlzRHJha2VFZGl0YWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBhbGxlbGVDaGFuZ2VkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBpZCwgc2V4LCBkcmFrZSwgaXNEcmFrZUVkaXRhYmxlLCBoaWRkZW5BbGxlbGVzLCBhbGxlbGVDaGFuZ2VkIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGRyYWtlTGFiZWxJRCA9IGAke3NleH0tZHJha2UtbGFiZWxgLFxuICAgICAgICAgIGNvbHVtbkxhYmVsID0gYCR7c2V4LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc2V4LnNsaWNlKDEpfSBEcmFrZWAsXG4gICAgICAgICAgZHJha2VPcmdJRCA9IGAke3NleH0tZHJha2VgO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPVwiY29sdW1uXCI+XG5cbiAgICAgICAgey8qIHBhcmVudCBkcmFrZSBsYWJlbCAqL31cbiAgICAgICAgPGRpdiBpZD17ZHJha2VMYWJlbElEfSBjbGFzc05hbWU9XCJjb2x1bW4tbGFiZWxcIj57Y29sdW1uTGFiZWx9PC9kaXY+XG5cbiAgICAgICAgey8qIHBhcmVudCBkcmFrZSBpbWFnZSAqL31cbiAgICAgICAgPEdlbmlCbG9ja3MuT3JnYW5pc21HbG93Vmlld1xuICAgICAgICAgIGlkPXtkcmFrZU9yZ0lEfSBjbGFzc05hbWU9J3BhcmVudC1kcmFrZScgb3JnPXtkcmFrZX0gY29sb3I9JyNGRkZGQUEnIHNpemU9ezIwMH0gLz5cblxuICAgICAgICB7LyogcGFyZW50IGRyYWtlIGdlbm9tZSAqL31cbiAgICAgICAgPEdlbmlCbG9ja3MuR2Vub21lVmlld1xuICAgICAgICAgIGNsYXNzTmFtZT0ncGFyZW50LWdlbm9tZScgb3JnPXtkcmFrZX0gaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICBlZGl0YWJsZT17aXNEcmFrZUVkaXRhYmxlfSBhbGxlbGVDaGFuZ2VkPXthbGxlbGVDaGFuZ2VkfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5EcmFrZUdlbm9tZUNvbHVtbjtcbi8vZXhwb3J0IGRlZmF1bHQgRHJha2VHZW5vbWVDb2x1bW47XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
