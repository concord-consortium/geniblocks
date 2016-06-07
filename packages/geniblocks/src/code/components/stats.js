import React, {PropTypes} from 'react';
import GeneticsUtils from '../utilities/genetics-utils';

/**
 * Stateless functional React component for displaying breeding statistics for a set of Biologica organisms
 * @param {Object[]} orgs - array of Biologica organisms for which statistics are to be displayed
 * @param {Object} orgs[].phenotype - the phenotype of the Biologica organism
 * @param {number} [lastClutchSize=orgs.length] - the number of organisms at the end of the array that comprise the most recent clutch
 */
const StatsView = ({orgs, lastClutchSize}) => {

  let traits = GeneticsUtils.computeTraitCountsForOrganisms(orgs, lastClutchSize),
      clutchSize = lastClutchSize || orgs.length,
      rows = [];

  // build cumulative stats for table rows
  let traitNum = 0;
  for (const [trait, values] of traits) {
    for (const [value, counts] of values) {
      const cMales = counts.clutch[BioLogica.MALE],
            cFemales = counts.clutch[BioLogica.FEMALE],
            cTotal = cMales + cFemales,
            cPct = Math.round(100 * cTotal / clutchSize),
            tMales = counts.total[BioLogica.MALE],
            tFemales = counts.total[BioLogica.FEMALE],
            tTotal = tMales + tFemales,
            tPct = Math.round(100 * tTotal / orgs.length);
      rows.push({ trait, traitNum, value, cMales, cFemales, cTotal, cPct,
                                          tMales, tFemales, tTotal, tPct });
    }
    ++ traitNum;
  }

  return (
    <div className="geniblocks stats">
      <table id="stats-table" className={orgs.length > 0 ? "has-data" : "no-data"}>
        <thead>
          <tr>
            <th>Trait Value</th>
            <th colSpan="2">Clutch</th><th>F</th><th>M</th>
            <th colSpan="2">Total</th><th>F</th><th>M</th>
          </tr>
        </thead>
        <tbody>
        {
          rows.map(function(row, index) {
            return (
              <tr key={index} className={row.traitNum & 1 ? "odd-trait" : "even-trait"}
                              data-trait-value={row.value}>
                <td className="label">{row.value}</td>
                <td className="numeric">{row.cTotal}</td>
                <td className="numeric">{row.cPct}%</td>
                <td className="numeric">{row.cFemales}</td>
                <td className="numeric">{row.cMales}</td>
                <td className="numeric">{row.tTotal}</td>
                <td className="numeric">{row.tPct}%</td>
                <td className="numeric">{row.tFemales}</td>
                <td className="numeric">{row.tMales}</td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
    </div>
  );
};

StatsView.propTypes = {
  orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
  lastClutchSize: PropTypes.number
};

export default StatsView;
