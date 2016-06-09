/* global ReactRedux, Redux */

var initialState = {
  dragon: {
    alleles: "a:T,b:t,a:m,b:M,a:w,b:W,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:a,b:a,a:D,b:D,a:Bog,b:Bog,a:rh,b:rh",
    sex: 1
  }
};

var rootReducer = function(state, action) {
  if (!state) state = initialState;
  switch (action.type) {
  case 'ALLELES_CHANGED':
    return {
      dragon: {
        alleles: action.alleles,
        sex: state.dragon.sex
      }
    };
  case 'SET_STATE':
    return action.state;
  default:
    return state;
  }
};

var hiztory = [];
var hiztoryPosition = 0;
var undoing = false;

var ACTIONS = {
  changedAllele: function(newAlleles) {
    return {
      type: "ALLELES_CHANGED",
      alleles: newAlleles,
      description: "User changed dragon allele"
    };
  },
  undo: function() {
    hiztoryPosition--;
    return {
      type: "SET_STATE",
      state: hiztory[hiztoryPosition]
    };
  },
  redo: function() {
    hiztoryPosition++;
    return {
      type: "SET_STATE",
      state: hiztory[hiztoryPosition]
    };
  }
};

var log = function(action) {
  console.log("==== ACTION ====");
  console.log("  " + action.description);
  delete action.description;
  console.log("  " + JSON.stringify(action));
};

var createAction = function(actionKey, props) {
  var action = ACTIONS[actionKey](props);
  log(action);
  return action;
};

var store = Redux.createStore(rootReducer, initialState);

var APP = function(props) {
  var dragon = props.dragon,
      org = new BioLogica.Organism(BioLogica.Species.Drake, dragon.alleles, dragon.sex);
  return React.createElement(
    'div',
    {},
    React.createElement(
      GeniBlocks.OrganismView,
      {org: org}
    ),
    React.createElement(
      GeniBlocks.GenomeView,
      {
        org: org,
        onAlleleChange: function(chrom, side, prevAllele, newAllele) {
          org.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
          props.dispatch(createAction("changedAllele", org.getAlleleString()));
        }
      }
    )
  );
};

APP.propTypes = {
  dragon: React.PropTypes.object,
  dispatch: React.PropTypes.func
};

function select(state) {
  return state;
}

ReactDOM.render(
  React.createElement(
    ReactRedux.Provider,
    {store: store},
    React.createElement(ReactRedux.connect(select)(APP), null)
  ),
  document.getElementById('app')
);

hiztory.push(store.getState());
store.subscribe(function() {
  if (!undoing) {
    hiztory.push(store.getState());
    hiztoryPosition++;
  }
});

document.getElementById("undo").onclick = function() {
  undoing = true;
  store.dispatch(ACTIONS.undo());
  undoing = false;
};
document.getElementById("redo").onclick = function() {
  undoing = true;
  store.dispatch(ACTIONS.redo());
  undoing = false;
};
