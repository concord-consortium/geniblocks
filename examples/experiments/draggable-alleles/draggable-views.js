/* global ReactDnD */
/* eslint react/prop-types:0 */
var DragSource = ReactDnD.DragSource,
    DropTarget = ReactDnD.DropTarget,

    shapeColorMap = {
      W:  {shape: "circle", color: "blue"},
      w:  {shape: "circle", color: "lightskyblue"},
      T:  {shape: "square", color: "forestgreen"},
      Tk: {shape: "square", color: "limegreen"},
      t:  {shape: "square", color: "mediumspringgreen"}
    },

    ItemTypes = {
      ALLELE: 'allele'
    },

    alleleSource = {
      beginDrag: function (props) {
        return {index: props.index, org: props.org, shape: shapeColorMap[props.allele].shape};
      }
    },

    collectSource = function(connect, monitor) {
      return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
      };
    },

    WrappedAllele = React.createClass({
      render: function () {
        var connectDragSource = this.props.connectDragSource,
            isDragging = this.props.isDragging,
            allele = this.props.allele;
        return connectDragSource(
          React.createElement('div', {},
            !isDragging ? React.createElement(GeniBlocks.AlleleView, {allele: allele, color: shapeColorMap[allele].color, shape: shapeColorMap[allele].shape}) : null
          )
        );
      }
    }),

    DraggableAllele = DragSource(ItemTypes.ALLELE, alleleSource, collectSource)(WrappedAllele),

    alleleTarget = {
      drop: function (props, monitor) {
        props.moveAllele(monitor.getItem().index, monitor.getItem().org, props.index, props.org);
      },
      canDrop: function (props, monitor) {
        //console.log("can drop??");
        //console.log(monitor.getItem());
        //console.log(props);
        return (monitor.getItem().shape === props.shape);
      }
    },

    collectTarget = function(connect, monitor) {
      return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      };
    },

    WrappedAlleleTarget = React.createClass({
      render: function () {
        var connectDropTarget = this.props.connectDropTarget,
            isOver = this.props.isOver,
            canDrop = this.props.canDrop,
            shape = this.props.shape,
            allele = this.props.allele;
        return connectDropTarget(
          React.createElement('div', {},
            React.createElement(GeniBlocks.AlleleView, {allele: allele, color: (allele ? shapeColorMap[allele].color : null), shape: (allele ? shapeColorMap[allele].shape : shape), target: true, hovering: (isOver && canDrop)})
          )
        );
      }
    }),

    AlleleDropTarget = DropTarget(ItemTypes.ALLELE, alleleTarget, collectTarget)(WrappedAlleleTarget),

    AlleleContainer = React.createClass({
      render: function () {
        var allelePool = this.props.pool,
            alleleTargets = this.props.targets,
            org = this.props.org,
            moveAllele = this.props.moveAllele;

        var pool = allelePool.map(function(allele, i) {
          if (!allele) return null;
          return React.createElement(DraggableAllele, {allele: allele, key: i, index: i, org: org});
        });

        var targets = alleleTargets.map(function(allele, i) {
          if (allele === "circle" || allele === "square") {
            var shape = allele;
            allele = null;
          } else {
            shape = shapeColorMap[allele].shape;
          }
          return React.createElement(AlleleDropTarget, {allele: allele, key: i, shape: shape, index: i, org: org, moveAllele: moveAllele});
        });

        return (
          React.createElement('div', {className: "allele-container"},
            React.createElement('div', {className: "allele-targets labelable"},
              targets
            ),
            React.createElement('div', {className: "allele-pool"},
              pool
            )
          )
        );
      }
    }),

    PunnettContainer = React.createClass({
      render: function () {
        var alleles = this.props.alleles,
            orgs = this.props.orgs,
            moveAllele = this.props.moveAllele,

            orgViews = orgs.map(function(org, index) {
              return org ?  React.createElement(GeniBlocks.OrganismView, {org: org, key: index}) : null;
            });

        return (
          React.createElement('div', {className: "punnett-square"},
            React.createElement('div', {className: "top"},
              React.createElement(AlleleDropTarget, {allele: alleles[0], shape: "circle", index: 0, moveAllele: moveAllele}),
              React.createElement(AlleleDropTarget, {allele: alleles[1], shape: "circle", index: 1, moveAllele: moveAllele})
            ),
            React.createElement('div', {className: "row"},
              React.createElement(AlleleDropTarget, {allele: alleles[2], shape: "circle", index: 2, moveAllele: moveAllele}),
              React.createElement('div', {className: "box org-1"}, orgViews[0]),
              React.createElement('div', {className: "box org-2"}, orgViews[2])
            ),
            React.createElement('div', {className: "row"},
              React.createElement(AlleleDropTarget, {allele: alleles[3], shape: "circle", index: 3, moveAllele: moveAllele}),
              React.createElement('div', {className: "box org-3"}, orgViews[1]),
              React.createElement('div', {className: "box org-4"}, orgViews[3])
            )
          )
        );
      }
    });

window.AlleleContainer = AlleleContainer;
window.PunnettContainer = PunnettContainer;
