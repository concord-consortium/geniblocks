/**
 * Class providing utility functions for BioLogica genetics operations.
 * In some cases these are adapted from corresponding code in Geniverse.
 */
export default class GeneticsUtils {

  /**
   * Converts an allele string in the new dash form (e.g. "W-w", "T-", "-a") to
   * an array of allele strings, providing validation at the same time.
   * Invalid allele strings and alleles that aren't from the same gene are
   * logged as console warnings.
   *
   * @param {string}  dashAlleles - the allele string to be converted
   * @returns {string}[2]  the validated allele strings
   */
  static parseDashAllelePair(dashAlleles) {
    const alleles = dashAlleles.trim().split('-'),
          genes = alleles.map((allele) => {
                    const gene = allele && BioLogica.Genetics.getGeneOfAllele(BioLogica.Species.Drake, allele);
                    if (allele && !gene)
                      console.error(`GeneticsUtils.convertDashAllelesToABAlleles encountered invalid allele: '${allele}'`);
                    return gene;
                  });
    // in a dash pair, both alleles should be from the same gene
    if (genes[0] && genes[1] && (genes[0] !== genes[1]))
      console.error(`GeneticsUtils.convertDashAllelesToABAlleles encountered invalid allele pair: '${alleles[0]}-${alleles[1]}'`);
    // replace invalid alleles with the empty string
    return alleles.map((allele, i) => allele && genes[i] ? allele : '');
  }

  /**
   * Converts allele strings in the new dash form (e.g. "W-w, T-, -a") to the original
   * BioLogica a:b: form (e.g. "a:W,b:w,a:T,b:a")
   *
   * @param {string}  dashAlleleString - the allele string to be converted
   * @returns {string}  the converted allele string
   */
  static convertDashAllelesToABAlleles(dashAlleleString) {
    if (!dashAlleleString || (dashAlleleString.indexOf(':') >= 0) || (dashAlleleString.indexOf('-') < 0))
      return dashAlleleString;
    const dashAlleles = dashAlleleString.split(',');
    return dashAlleles.reduce((prev, pair) => {
                        const alleles = GeneticsUtils.parseDashAllelePair(pair);
                        if (alleles[0]) prev += `${prev ? ',' : ''}a:${alleles[0].trim()}`;
                        if (alleles[1]) prev += `${prev ? ',' : ''}b:${alleles[1].trim()}`;
                        return prev;
                      }, "");
  }

  /**
   * Converts allele strings in the new dash form (e.g. "W-w, T-, -a") to the original
   * BioLogica a:b: form (e.g. "a:W,b:w,a:T,b:a") within objects and arrays.
   *
   * Recurses through nested objects/arrays converting dash allele strings in properties
   * whose names are white-listed in the propNames argument.
   *
   * @param {object}  object - the object to be converted
   * @returns {object}  the same object is returned with the specified fields modified
   */
  static convertDashAllelesObjectToABAlleles(object, propNames) {
    if (!object || !propNames || (propNames.length == null)) return object;

    function convertValue(key, value) {
      if (!value) return value;
      switch (typeof value) {
        case 'string':
          return (!key || (propNames.indexOf(key) >= 0))
                    ? GeneticsUtils.convertDashAllelesToABAlleles(value)
                    : value;
        case 'object':
          if (Array.isArray(value)) {
            // note that the key for strings in arrays is the key for the array
            return value.map((item) => convertValue(key, item));
          }
          else {
            for (let objKey in value) {
              value[objKey] = convertValue(objKey, value[objKey]);
            }
          }
          return value;
        default:
          return value;
      }
    }

    return convertValue(null, object);
  }

  /**
   * Returns true if the specified alleles are present in the allele string.
   *
   * @param {string}  alleleString - organism allele string
   * @param (string)  alleles - alleles to match against the organism alleles
   * @returns {boolean} true if the alleles are present in the alleleString, false otherwise
   */
  static alleleStringContainsAlleles(alleleString, alleles) {
    // empty strings don't match
    if (!alleleString || !alleles) return false;
    // must match every one of the alleles ...
    return alleles.split(',').every((allele) => {
      // ... to the alleles of the alleleString
      return alleleString.search(`${allele}(,|$)`) >= 0;
    });
  }

  /**
   * Returns true if the specified allele string contains only valid alleles
   *
   * @param {string}  alleleString - the allele string (in a:b: form) to be validated
   * @param {object}  [species] - the species whose genome is used to determine completeness
   * @returns         true if the allele string is valid, false otherwise
   */
  static isValidAlleleString(alleleString, species=BioLogica.Species.Drake) {
    if (!species || !alleleString) return false;
    const alleleToGeneMap = Object.keys(species.geneList).reduce((prev, gene) => {
                              species.geneList[gene].alleles.forEach((allele) => {
                                prev[allele] = gene;
                              });
                              return prev;
                            }, {});
    return alleleString.split(',').every((alleleSide) => {
            const [side, allele] = alleleSide.split(':');
            return ((side.trim() === 'a') || (side.trim() === 'b')) &&
                    (alleleToGeneMap[allele.trim()] != null);
          });
  }

  /**
   * Returns true if the specified allele string completely specifies all alleles
   *
   * To be complete, every gene must be specified with a valid allele for each
   * side (except sex-linked genes, which need only be on one side), and no
   * invalid alleles or genes can be specified.
   *
   * @param {string}  alleleString - the allele string (in a:b: form) to be validated
   * @param {object}  [species] - the species whose genome is used to determine completeness
   * @returns         true if the allele string is complete, false otherwise
   */
  static isCompleteAlleleString(alleleString, species=BioLogica.Species.Drake) {
    if (!species || !alleleString) return false;
    const kUnknownGene = "__UNKNOWN__",
          alleleToGeneMap = Object.keys(species.geneList).reduce((prev, gene) => {
                              species.geneList[gene].alleles.forEach((allele) => {
                                prev[allele] = gene;
                              });
                              return prev;
                            }, {}),
          speciesGeneCount = Object.keys(species.geneList).length,
          geneSideMap = alleleString.split(',').reduce((prev, alleleSide) => {
                          const [side, allele] = alleleSide.split(':');
                          let gene = alleleToGeneMap[allele.trim()];
                          if (!gene) gene = kUnknownGene;
                          let geneEntry = prev[gene];
                          if (!geneEntry) geneEntry = prev[gene] = { a: 0, b: 0 };
                          ++ geneEntry[side.trim()];
                          return prev;
                        }, {}),
          alleleStringGeneCount = Object.keys(geneSideMap).length,
          isEveryGeneComplete = Object.keys(geneSideMap).every((gene) => {
                                  const geneEntry = geneSideMap[gene],
                                        isXYGene = species.chromosomeGeneMap.XY.some((allele) =>
                                                    gene === alleleToGeneMap[allele]);
                                  return geneEntry && ((geneEntry.a === 1) && (geneEntry.b === 1)) ||
                                          (isXYGene &&
                                            (geneEntry.a + geneEntry.b >= 1) && (geneEntry.a + geneEntry.b <= 2));
                                });
    // must have the correct number of genes, all genes must be complete, and no unknown genes
    return (speciesGeneCount === alleleStringGeneCount) && isEveryGeneComplete &&
            (geneSideMap[kUnknownGene] == null);
  }

  /**
   * Filters out hidden alleles, given a list of changeable and visible genes.
   * Returns array of objects with the allele and the editability
   *
   * @param {string[]} alleles - the set of alleles to be filtered
   * @param {string[]} userChangeableGenes - genes that the user can edit (if the template allows)
   * @param {string[]} visibleGenes - genes that the user can view (already includes the above list)
   * @param {BioLogica.species} species - the species that defines the genotype
   * @return {obj[]} - the filtered alleles, where each is an object with a name and whether it is editable
   */
  static filterVisibleAlleles(alleles, userChangeableGenes, visibleGenes, species) {
    let showAll = userChangeableGenes.length + visibleGenes.length === 0;
    return alleles.filter(a => {
      if (showAll) return true;

      const gene = BioLogica.Genetics.getGeneOfAllele(species, a),
            geneName = gene ? gene.name : null;
      return userChangeableGenes.indexOf(geneName) > -1 || visibleGenes.indexOf(geneName) > -1;
    }).map(a => ({
      allele: a,
      editable: userChangeableGenes.indexOf(BioLogica.Genetics.getGeneOfAllele(species, a).name) > -1
    }));
  }

  /**
   * Compute a map of traits -> traitValues -> traitCounts.
   *
   * @param {BioLogica.Organism[]} organisms - the set of organisms to compute stats for
   * @param {number} clutchSize - the last 'clutchSize' organisms are assumed to be the last clutch
   * @return {Map} - e.g. { "tail": { "long tail": { "clutch": [9, 11], "total": [53, 47] }}}
   */
  static computeTraitCountsForOrganisms(organisms, lastClutchSize) {
    let traits = new Map,
        clutchSize = lastClutchSize || organisms.length;

    // accumulate stats for each trait/value combination
    for (const [index, org] of organisms.entries()) {
      for (const trait of Object.keys(org.phenotype.characteristics)) {
        let value = org.phenotype.characteristics[trait],
            traitValues = traits.get(trait) || new Map,
            valueCounts = traitValues.get(value) || { clutch: [0, 0], total: [0, 0] };
        if (!traits.has(trait)) traits.set(trait, traitValues);
        if (!traitValues.has(value)) traitValues.set(value, valueCounts);
        // most recent clutch assumed to be at end of organisms array
        if (index >= organisms.length - clutchSize)
          ++ valueCounts.clutch[org.sex];
        ++ valueCounts.total[org.sex];
      }
    }
    return traits;
  }

  /**
   * Converts an allele string to a JavaScript object that maps genes to alleles.
   * This can be useful for comparison purposes, for instance.
   *
   * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
   * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
   * @return {object} - gene map of form { horns: {a:"h", b:"h"}, armor: {a:"a", b:"a"}, ...}
   */
  static buildGeneMapFromAlleleString(genetics, alleleString) {
    let geneMap = {},
        alleleSubstrings = alleleString.split(",");
    for (const alleleSubstr of alleleSubstrings) {
      const [side, allele] = alleleSubstr.split(":"),
            gene = genetics.geneForAllele(allele);
      if (side && allele && gene) {
        if (!geneMap[gene]) geneMap[gene] = {};
        geneMap[gene][side] = allele;
      }
    }
    return geneMap;
  }

  /**
   * Given an allele string and a gene map defining a set of base (default) alleles,
   * returns a new allele string with missing alleles replaced by their defaults.
   *
   * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
   * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
   * @param {object} baseGeneMap - gene map of form { horn: {a:"h", b:"h"}, armor: {a:"a", b:"a"}, ...}
   * @return {string} - updated allele string of form "a:h,b:h,a:a,b:a..."
   */
  static fillInMissingAllelesFromGeneMap(genetics, alleleString, baseGeneMap) {
    const dstGeneMap = GeneticsUtils.buildGeneMapFromAlleleString(genetics, alleleString);
    let   dstAlleleString = alleleString;
    for (const gene in dstGeneMap) {
      const geneValue = dstGeneMap[gene];
      // replace a missing 'a' side allele with the default if appropriate
      if (!geneValue.a && baseGeneMap[gene] && baseGeneMap[gene].a) {
        dstAlleleString = dstAlleleString.replace(`b:${geneValue.b}`, `a:${baseGeneMap[gene].a},$&`);
      }
      // replace a missing 'b' side allele with the default if appropriate
      if (!geneValue.b && baseGeneMap[gene] && baseGeneMap[gene].b) {
        dstAlleleString = dstAlleleString.replace(`a:${geneValue.a}`, `$&,b:${baseGeneMap[gene].b}`);
      }
    }
    return dstAlleleString;
  }

  /**
   * Given two allele strings, returns a new allele string in which missing alleles
   * in the first are replaced by defaults provided by the second allele string.
   *
   * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
   * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
   * @param {string} baseAlleleString - allele string of form "a:h,b:h,a:a,b:a..." to use as defaults
   * @return {string} - updated allele string of form "a:h,b:h,a:a,b:a..."
   */
  static fillInMissingAllelesFromAlleleString(genetics, alleleString, baseAlleleString) {
    const baseGeneMap = GeneticsUtils.buildGeneMapFromAlleleString(genetics, baseAlleleString);
    return GeneticsUtils.fillInMissingAllelesFromGeneMap(genetics, alleleString, baseGeneMap);
  }

  /**
   * Returns a string containing the alleles present in the fully specified organism, but not in
   * the partially specified organism. For example, if a female and male organism are given, the returned string
   * will represent the sex-linked chromosomes that the male organism lacks.
   *
   * @param {object} fullySpecifiedOrganism - the organism containing the extra alleles
   * @param {object} partiallySpecifiedOrganism - the organism lacking the extra alleles
   * @return {string} - a comma-separated string representing the extra alleles, e.g. "b:D,b:Bog,b:rh"
   */
  static computeExtraAlleles(fullySpecifiedOrganism, partiallySpecifiedOrganism) {
    let fullAlleles = fullySpecifiedOrganism.getAlleleString().split(",");
    let partialAlleles = partiallySpecifiedOrganism.getAlleleString().split(",");
    let extraAlleles = fullAlleles.filter(function(allele) { return partialAlleles.indexOf(allele) === -1; });
    return extraAlleles.join(",");
  }

  /**
   * Converts a Drake object into a Biologica organism.
   *
   * @param {object} drake - the drake to convert
   * @param {BioLogica.Organism} the drake as an Organism
   */
  static convertDrakeToOrg(drake) {
    return new BioLogica.Organism(BioLogica.Species.Drake, drake.alleleString, drake.sex);
  }

  /**
   * Returns an object of the form {geneStart, chromosomeHeight} describing where the gene associated with
   * the given allele is located.
   * @param {Object} species - the BioLogica species of the organism containing the given allele
   * @param {string} chromosomeName - the name of the chromosome containing the given allele
   * @param {string} allele - the name of the allele whose location is described by the returned object
   */
  static getGeneStripeInfoForAllele(species, chromosomeName, allele) {
    var geneStart;
    Object.keys(species.geneList).forEach((geneName) => {
      const gene = species.geneList[geneName];
      if (gene.alleles.indexOf(allele) > -1) {
        geneStart = gene.start;
      }
    });
    return {geneStart, chromosomeHeight: species.chromosomesLength[chromosomeName]};
  }

  /**
   * Given a gene string, returns an object representing the phenotypes expressed by that gene string. For example,
   * 'a:w,b:w' is converted to {'wings': 'No wings'}.
   *
   * TODO: baskets should be defined by phenotype instead, to simplify their description and avoid this step entirely
   */
  static convertGeneStringToPhenotype(genes, sex) {
    // First, create a drake from the given gene string. This drake has the correct phenotype, but we only want the
    // part of the phenotype specifically referenced in the gene string.
    const species = BioLogica.Species.Drake,
          geneDrake = new BioLogica.Organism(species, genes, sex),
          phenotype = geneDrake.phenotype.allCharacteristics;

    // To get the phenotype, we first go through all possible alleles, and pull out the ones used in the genome string
    let relevantAlleles = [];
    Object.keys(species.alleleLabelMap).forEach((alleleName) => {
      if (alleleName !== "" && RegExp(`:${alleleName}(,|$)`).test(genes)) {
        relevantAlleles.push(alleleName);
      }
    });

    // Now we determine all possible traits that could be created using at least one of the alleles in the gene string
    // We store these in an object mapping trait category to possible trait names. For example, a gene string of the form
    // 'a:w,b:W' would become {'wings': ['Wings', 'No wings']}
    let relevantTraitNames = {};
    Object.keys(species.traitRules).forEach((traitCategory) => {
      Object.keys(species.traitRules[traitCategory]).forEach((trait) => {
        let alleleCombinations = species.traitRules[traitCategory][trait];
        alleleCombinations.forEach((combination) => {
          relevantAlleles.forEach((relevantAllele) => {
            if (combination.indexOf(relevantAllele) > -1) {
              if (relevantTraitNames[traitCategory] === undefined) {
                relevantTraitNames[traitCategory] = [];
              }
              relevantTraitNames[traitCategory].push(trait);
            }
          });
        });
      });
    });

    // We now create a new object that maps from each trait category to the trait we actually see in the phenotype of
    // the drake created from the gene string. For example, if the previous step created an object {'wings': ['Wings', 'No wings']}
    // from the string 'a:w,b:W', we would create the final result {'wings': 'Wings'} here.
    let relevantPhenotypeFromGenes = {};
    phenotype.forEach((actualTrait) => {
      Object.keys(relevantTraitNames).forEach((traitCategory) => {
        if (relevantTraitNames[traitCategory].indexOf(actualTrait) > -1) {
          relevantPhenotypeFromGenes[traitCategory] = actualTrait;
        }
      });
    });

    return relevantPhenotypeFromGenes;
  }

  /**
   *  Returns dominant version of allele for this trait, e.g. "W"
   */
  static dominant(trait) {
    switch (trait) {
      // special-case any genes that aren't just two alleles differentiated by case
      case "armor":
        return "A1";
      case "dilute":
        return "D";
      case "tail":
        return "T";
      default: {
        const baseAllele = BioLogica.Species.Drake.geneList[trait].alleles[0];
        return baseAllele.charAt(0).toUpperCase() + baseAllele.slice(1);
      }
    }
  }

  /**
   *  Returns recessive version of allele for this trait, e.g. "w"
   */
  static recessive(trait) {
    switch (trait) {
      // special-case any genes that aren't just two alleles differentiated by case
      case "armor":
        return "a";
      case "dilute":
        return "d";
      case "tail":
        return "t";
      default: {
        const baseAllele = BioLogica.Species.Drake.geneList[trait].alleles[0];
        return baseAllele.charAt(0).toLowerCase() + baseAllele.slice(1);
      }
    }
  }

  /**
   * Returns allele string for this trait, based on type
   * @prop {string} trait - Name of trait, e.g. "wings"
   * @prop {string} type - Name of type, any of "dominant", "recessive" or "heterozygous"
   * @returns {string} allele string for both sides, e.g. "a:W,b:w"
   */
  static getAllelesForTrait(trait, type) {
    if (trait === "sex") {
      return "";
    }

    const dom = GeneticsUtils.dominant(trait);
    const rec = GeneticsUtils.recessive(trait);

    switch (type) {
      case "dominant":
        return `a:${dom},b:${dom}`;
      case "recessive":
        return `a:${rec},b:${rec}`;
      default:
        return Math.random() < 0.5 ? `a:${dom},b:${rec}` : `a:${rec},b:${dom}`;
    }
  }

  static commonName(trait) {
    const traitMap = {
      forelimbs: "arms",
      hindlimbs: "legs",
      black: "gray and orange",
      dilute: "deep color",
      nose: "nose spike",
      metallic: "shiny"
    };
    return traitMap[trait] || trait;
  }

}
