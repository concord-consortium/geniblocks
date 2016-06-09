import GeneticsUtils from '../../packages/geniblocks/src/code/utilities/genetics-utils';

describe("GeneticsUtils.filterAlleles()", function() {
  const initialAlleles = ['T', 't', 'A1', 'a'];

  it("should return the original array when not filtering", function() {
    const filteredAlleles = GeneticsUtils.filterAlleles(initialAlleles, [], BioLogica.Species.Drake);
    assert.deepEqual(filteredAlleles, initialAlleles, "result should be the original alleles");
  });

  it("should return the original array when filtering by alleles not present", function() {
    const filteredAlleles = GeneticsUtils.filterAlleles(initialAlleles, ['w'], BioLogica.Species.Drake);
    assert.deepEqual(filteredAlleles, initialAlleles, "result should be the original alleles");
  });

  it("should remove all alleles of a gene when hiding any allele of that gene", function() {
    const armorAlleles = GeneticsUtils.filterAlleles(initialAlleles, ['t'], BioLogica.Species.Drake);
    assert.deepEqual(armorAlleles, ['A1', 'a'], "should remove all tail alleles");
    const noAlleles = GeneticsUtils.filterAlleles(initialAlleles, ['t', 'a'], BioLogica.Species.Drake);
    assert.deepEqual(noAlleles, [], "should remove all tail alleles");
  });

});

describe("GeneticsUtils.computeTraitCountsForOrganisms()", function() {

  it("should return an empty map when passed an empty organisms array", function() {
    const traitsMap = GeneticsUtils.computeTraitCountsForOrganisms([]);
    assert.equal(traitsMap.size, 0, "result should be an empty map");
  });

  it("should return an empty map when passed an empty organisms array", function() {
    const traitsMap = GeneticsUtils.computeTraitCountsForOrganisms([]);
    assert.equal(traitsMap.size, 0, "result should be an empty map");
  });

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

  const oneClutchCounts = GeneticsUtils.computeTraitCountsForOrganisms(drakes),
        twoClutchCounts = GeneticsUtils.computeTraitCountsForOrganisms(drakes, drakes.length / 2);

  it("should have an entry for every trait in the traitRules", function() {
    const traitCount = Object.keys(BioLogica.Species.Drake.traitRules).length;
    assert.equal(oneClutchCounts.size, traitCount, "should have an entry for every trait");
    assert.equal(twoClutchCounts.size, traitCount, "should have an entry for every trait");
  });

  it("should have appropriate counts for tail and armor traits as a single clutch", function() {
    assert.deepEqual(oneClutchCounts.get('tail').get('Long tail'),
                      { clutch: [5, 5], total: [5, 5] }, "correct counts of long tails");
    assert.deepEqual(oneClutchCounts.get('tail').get('Kinked tail'),
                      { clutch: [3, 3], total: [3, 3] }, "correct counts of kinked tails");
    assert.deepEqual(oneClutchCounts.get('tail').get('Short tail'),
                      { clutch: [1, 1], total: [1, 1] }, "correct counts of short tails");
    assert.deepEqual(oneClutchCounts.get('armor').get('Five armor'),
                      { clutch: [3, 3], total: [3, 3] }, "correct counts of five armors");
    assert.deepEqual(oneClutchCounts.get('armor').get('Three armor'),
                      { clutch: [3, 3], total: [3, 3] }, "correct counts of three armors");
    assert.deepEqual(oneClutchCounts.get('armor').get('One armor'),
                      { clutch: [2, 2], total: [2, 2] }, "correct counts of one armors");
    assert.deepEqual(oneClutchCounts.get('armor').get('No armor'),
                      { clutch: [1, 1], total: [1, 1] }, "correct counts of no armors");
  });

  it("should have appropriate counts for tail and armor traits as two clutches", function() {
    assert.deepEqual(twoClutchCounts.get('tail').get('Long tail'),
                      { clutch: [0, 5], total: [5, 5] }, "correct counts of long tails");
    assert.deepEqual(twoClutchCounts.get('tail').get('Kinked tail'),
                      { clutch: [0, 3], total: [3, 3] }, "correct counts of kinked tails");
    assert.deepEqual(twoClutchCounts.get('tail').get('Short tail'),
                      { clutch: [0, 1], total: [1, 1] }, "correct counts of short tails");
    assert.deepEqual(twoClutchCounts.get('armor').get('Five armor'),
                      { clutch: [0, 3], total: [3, 3] }, "correct counts of five armors");
    assert.deepEqual(twoClutchCounts.get('armor').get('Three armor'),
                      { clutch: [0, 3], total: [3, 3] }, "correct counts of three armors");
    assert.deepEqual(twoClutchCounts.get('armor').get('One armor'),
                      { clutch: [0, 2], total: [2, 2] }, "correct counts of one armors");
    assert.deepEqual(twoClutchCounts.get('armor').get('No armor'),
                      { clutch: [0, 1], total: [1, 1] }, "correct counts of no armors");
  });

});
