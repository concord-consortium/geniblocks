import ReactDOM from "react-dom";
import React from "react";
import { OrganismView } from "geniblocks";

var org = new BioLogica.Organism(BioLogica.Species.Drake, "");

ReactDOM.render(
  <div>
    <h1>Hello world</h1>
    <OrganismView org={org} />
  </div>,
  document.getElementById('gv')
);
