import StatsView from '../../packages/geniblocks/src/code/components/stats';

describe("<StatsView />", function(){
  const tailAlleles = BioLogica.Species.Drake.geneList.tail.alleles,
        armorAlleles = BioLogica.Species.Drake.geneList.armor.alleles;
  let drakes = [];
  // first batch is all males, second batch is all females
  for (let sex = 0; sex < 2; ++sex) {
    for (let aIndex = 0; aIndex < 3; ++aIndex) {
      for (let bIndex = 0; bIndex < 3; ++bIndex) {
        const tailAlleleString = `a:${tailAlleles[aIndex]},b:${tailAlleles[bIndex]}`,
              armorAlleleString = `a:${armorAlleles[aIndex]},b:${armorAlleles[bIndex]}`;
        drakes.push(new BioLogica.Organism(BioLogica.Species.Drake,
                                          `${tailAlleleString},${armorAlleleString}`, sex));
      }
    }
  }

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<StatsView orgs={drakes}/>);
    assert(wrapper.find('div').at(0).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(0).hasClass('stats'), "Should create a <div> with 'stats' class");
  });

   function compareRow(iWrapper, iTraitValue, iDataValues) {
    const rowWrapper = iWrapper.render().find(`tr[data-trait-value="${iTraitValue}"]`),
          dataWrapper = rowWrapper.find('td'),
          dataLength = dataWrapper.length;
    assert.lengthOf(rowWrapper, 1, "row should have a single row with specified value");
    assert.lengthOf(dataWrapper, 9, "row should have correct number of columns");
    for (let i = 0; i < dataLength; ++i) {
      if (i === 0) {
        assert.equal(dataWrapper.eq(i).text(), iTraitValue, "trait value should be correct");
      }
      else {
        assert.equal(dataWrapper.eq(i).text(), String(iDataValues[i-1]), `data value 'i' should be correct`);
      }
    }
  }

 it("should put appropriate values in the table when processed as a single clutch", function() {
    const wrapper = shallow(<StatsView orgs={drakes}/>),
          expected = {
                        "Long tail": [10, '56%', 5, 5, 10, '56%', 5, 5],
                        "Kinked tail": [6, '33%', 3, 3, 6, '33%', 3, 3],
                        "Short tail": [2, '11%', 1, 1, 2, '11%', 1, 1],
                        "Five armor": [6, '33%', 3, 3, 6, '33%', 3, 3],
                        "Three armor": [6, '33%', 3, 3, 6, '33%', 3, 3],
                        "One armor": [4, '22%', 2, 2, 4, '22%', 2, 2],
                        "No armor": [2, '11%', 1, 1, 2, '11%', 1, 1]
                      };

    for (const traitValue in expected) {
      const dataValues = expected[traitValue];
      compareRow(wrapper, traitValue, dataValues);
    }
  });

 it("should put appropriate values in the table when processed as two clutches", function() {
    const wrapper = shallow(<StatsView orgs={drakes} lastClutchSize={drakes.length/2}/>),
          expected = {
                        "Long tail": [5, '56%', 5, 0, 10, '56%', 5, 5],
                        "Kinked tail": [3, '33%', 3, 0, 6, '33%', 3, 3],
                        "Short tail": [1, '11%', 1, 0, 2, '11%', 1, 1],
                        "Five armor": [3, '33%', 3, 0, 6, '33%', 3, 3],
                        "Three armor": [3, '33%', 3, 0, 6, '33%', 3, 3],
                        "One armor": [2, '22%', 2, 0, 4, '22%', 2, 2],
                        "No armor": [1, '11%', 1, 0, 2, '11%', 1, 1]
                      };

    for (const traitValue in expected) {
      const dataValues = expected[traitValue];
      compareRow(wrapper, traitValue, dataValues);
    }
  });

});
