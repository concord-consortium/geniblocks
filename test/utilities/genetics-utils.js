import GeneticsUtils from '../../src/code/utilities/genetics-utils';

describe("GeneticsUtils.convertDashAllelesToABAlleles()", function() {

  it("should return the empty string when passed an empty string", function() {
    const dashAlleles = "",
          abAlleles = GeneticsUtils.convertDashAllelesToABAlleles(dashAlleles);
    assert.equal(abAlleles, "", "should handle empty string");
  });

  it("should handle a simple allele string", function() {
    const dashAlleles = "W-w",
          abAlleles = GeneticsUtils.convertDashAllelesToABAlleles(dashAlleles);
    assert.equal(abAlleles, "a:W,b:w", "should handle single allele");
  });

  it("should handle left-only allele string", function() {
    const dashAlleles = "W-",
          abAlleles = GeneticsUtils.convertDashAllelesToABAlleles(dashAlleles);
    assert.equal(abAlleles, "a:W", "should handle left-only allele");
  });

  it("should handle right-only allele string", function() {
    const dashAlleles = "-w",
          abAlleles = GeneticsUtils.convertDashAllelesToABAlleles(dashAlleles);
    assert.equal(abAlleles, "b:w", "should handle right-only allele");
  });

  it("should handle multiple alleles", function() {
    const dashAlleles = "W-w,T-Tk,D-d,Hl-hl",
          abAlleles = GeneticsUtils.convertDashAllelesToABAlleles(dashAlleles);
    assert.equal(abAlleles, "a:W,b:w,a:T,b:Tk,a:D,b:d,a:Hl,b:hl", "should handle multiple alleles");
  });

  // it("should handle multiple alleles with extraneous spaces", function() {
  //   const dashAlleles = " W - w , T - Tk , dl - d , Hl - hl ",
  //         abAlleles = GeneticsUtils.convertDashAllelesToABAlleles(dashAlleles);
  //   assert.equal(abAlleles, "a:W,b:w,a:T,b:Tk,a:dl,b:d,a:Hl,b:hl", "should handle multiple alleles with spaces");
  // });
});

describe("GeneticsUtils.convertDashAllelesObjectToABAlleles()", function() {

  it("should return the original object when passed an empty string/object", function() {
    let input = "",
        result = GeneticsUtils.convertDashAllelesObjectToABAlleles(input, []);
    assert.equal(result, "", "should handle empty string");
    input = {};
    result = GeneticsUtils.convertDashAllelesObjectToABAlleles(input, []);
    assert.deepEqual(result, {}, "should handle empty object");
    input = "T-T";
    result = GeneticsUtils.convertDashAllelesObjectToABAlleles(input, []);
    assert.equal(result, "a:T,b:T", "should handle simple string");
    input = { alleles: "T-T" };
    result = GeneticsUtils.convertDashAllelesObjectToABAlleles(input, []);
    assert.deepEqual(result, { alleles: "T-T" }, "don't convert strings unless propName specified");
    input = { alleles: "T-T" };
    result = GeneticsUtils.convertDashAllelesObjectToABAlleles(input, ["alleles"]);
    assert.deepEqual(result, { alleles: "a:T,b:T" }, "convert strings when propName specified");
    input = { baskets: ["T-T"] };
    result = GeneticsUtils.convertDashAllelesObjectToABAlleles(input, ["alleles"]);
    assert.deepEqual(result, { baskets: ["T-T"] }, "don't convert arrays unless propName specified");
    input = { alleles: ["T-T"] };
    result = GeneticsUtils.convertDashAllelesObjectToABAlleles(input, ["alleles"]);
    assert.deepEqual(result, { alleles: ["a:T,b:T"] }, "convert arrays when propName specified");
    input = { objects: [{ alleles: "T-T" }] };
    result = GeneticsUtils.convertDashAllelesObjectToABAlleles(input, ["alleles"]);
    assert.deepEqual(result, { objects: [{ alleles: "a:T,b:T" }] }, "convert objects within arrays");
  });
});

describe("GeneticsUtils.alleleStringContainsAlleles()", function() {

  it("should return false for null/empty strings", function() {
    let result = GeneticsUtils.alleleStringContainsAlleles();
    assert.equal(result, false, "result should be false for null/undefined arguments");
    result = GeneticsUtils.alleleStringContainsAlleles("a:b");
    assert.equal(result, false, "result should be false for null/undefined arguments");
    result = GeneticsUtils.alleleStringContainsAlleles(null, "a:b");
    assert.equal(result, false, "result should be false for null/undefined arguments");
    result = GeneticsUtils.alleleStringContainsAlleles("", "");
    assert.equal(result, false, "result should be false for empty strings");
    result = GeneticsUtils.alleleStringContainsAlleles("a:b", "");
    assert.equal(result, false, "result should be false for empty strings");
    result = GeneticsUtils.alleleStringContainsAlleles("", "a:b");
    assert.equal(result, false, "result should be false for empty strings");
  });

  it("should return true if the alleles occur in the alleleString, false otherwise", function() {
    let result = GeneticsUtils.alleleStringContainsAlleles("a:W,b:w,a:T,b:Tk,a:dl,b:d,a:Hl,b:hl",
                                                           "a:W,b:w,a:T,b:Tk,a:dl,b:d,a:Hl,b:hl");
    assert.equal(result, true, "result should be true for matching strings");
    result = GeneticsUtils.alleleStringContainsAlleles("a:W,b:w,a:T,b:Tk,a:dl,b:d,a:Hl,b:hl", "a:w");
    assert.equal(result, false, "result should be false for non-matching strings");
    result = GeneticsUtils.alleleStringContainsAlleles("a:W,b:w,a:T,b:Tk,a:dl,b:d,a:Hl,b:hl", "b:h");
    assert.equal(result, false, "result should be false for non-matching strings");
    result = GeneticsUtils.alleleStringContainsAlleles("a:W,b:w,a:T,b:Tk,a:dl,b:d,a:Hl,b:hl", "h");
    assert.equal(result, false, "result should be false for invalid alleles");
  });
});

describe("GeneticsUtils.isValidAlleleString()", function() {
  it("should return true for valid allele strings, false for invalid ones", function() {
    let result = GeneticsUtils.isValidAlleleString();
    assert.equal(result, false, "should handle nulls");
    result = GeneticsUtils.isValidAlleleString("a:ZZZ,b:ZZZ");
    assert.equal(result, false, "should handle invalid alleles");
    result = GeneticsUtils.isValidAlleleString("a:T,b:T");
    assert.equal(result, true, "should handle incomplete allele strings");
    const incompleteAlleleString = "a:M,b:M,a:W,b:W,a:H,b:H,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:Hl,a:A1,b:A1,a:D,b:D,a:Bog,b:Bog,a:Rh,b:Rh";
    result = GeneticsUtils.isValidAlleleString(incompleteAlleleString);
    assert.equal(result, true, "should handle incomplete allele strings");
    const completeAlleleString = "a:T,b:T,a:M,b:M,a:W,b:W,a:H,b:H,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:Hl,a:A1,b:A1,a:D,b:D,a:Bog,b:Bog,a:Rh,b:Rh";
    result = GeneticsUtils.isValidAlleleString(completeAlleleString);
    assert.equal(result, true, "should handle complete allele strings");
  });
});

describe("GeneticsUtils.isCompleteAlleleString()", function() {
  it("should return true for complete allele strings, false for incomplelete ones", function() {
    let result = GeneticsUtils.isCompleteAlleleString();
    assert.equal(result, false, "should handle nulls");
    result = GeneticsUtils.isCompleteAlleleString("a:ZZZ,b:ZZZ");
    assert.equal(result, false, "should handle invalid alleles");
    result = GeneticsUtils.isCompleteAlleleString("a:T,b:T");
    assert.equal(result, false, "should handle incomplete allele strings");
    const incompleteAlleleString = "a:M,b:M,a:W,b:W,a:H,b:H,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:Hl,a:A1,b:A1,a:D,b:D,a:Bog,b:Bog,a:Rh,b:Rh";
    result = GeneticsUtils.isCompleteAlleleString(incompleteAlleleString);
    assert.equal(result, false, "should handle incomplete allele strings");
    const maleCompleteAlleleString = "a:T,b:T,a:M,b:M,a:W,b:W,a:H,b:H,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:Hl,a:A1,b:A1,a:D,a:Bog,a:Rh";
    result = GeneticsUtils.isCompleteAlleleString(maleCompleteAlleleString);
    assert.equal(result, true, "should handle complete male allele strings (missing some X genes)");
    const completeAlleleString = "a:T,b:T,a:M,b:M,a:W,b:W,a:H,b:H,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:Hl,a:A1,b:A1,a:D,b:D,a:Bog,b:Bog,a:Rh,b:Rh";
    result = GeneticsUtils.isCompleteAlleleString(completeAlleleString);
    assert.equal(result, true, "should handle complete allele strings");
  });
});

describe("GeneticsUtils.filterVisibleAlleles()", function() {
  const initialAlleles = ['Tk', 'A1', 'w'];

  it("should return all alleles, each as non-editable, when not filtering", function() {
    const filteredAlleles = GeneticsUtils.filterVisibleAlleles(initialAlleles, [], [], BioLogica.Species.Drake);
    assert.deepEqual(filteredAlleles, [{allele: 'Tk', editable: false}, {allele: 'A1', editable: false}, {allele: 'w', editable: false}], "result should be the original alleles");
  });

  it("should return correct editable and non-editable alleles when filtering", function() {
    const filteredAlleles = GeneticsUtils.filterVisibleAlleles(initialAlleles, ['tail'], ['armor'], BioLogica.Species.Drake);
    assert.deepEqual(filteredAlleles, [{allele: 'Tk', editable: true}, {allele: 'A1', editable: false}], "should remove all tail alleles");
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

describe("GeneticsUtils.convertGeneStringToPhenotype()", function() {

  it("should return the empty object when passed an empty string", function() {
    const geneString = "",
          phenotype = GeneticsUtils.convertGeneStringToPhenotype(geneString, 0);
    assert.deepEqual(phenotype, {}, "should handle empty string");
  });

  it("should handle a simple allele string", function() {
    const geneString2 = "a:w,b:w",
          phenotype = GeneticsUtils.convertGeneStringToPhenotype(geneString2, 0);
    assert.deepEqual(phenotype, {"wings": "No wings"}, "should handle simple allele");
  });
  
});
