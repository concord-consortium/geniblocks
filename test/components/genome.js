import GenomeView from '../../src/code/components/genome';

describe("<GenomeView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, '');

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<GenomeView org={drake}/>);
    assert(wrapper.find('div').at(0).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(0).hasClass('genome'), "Should create a <div> with 'genome' class");
  });

  it("should create a <div> tag for each chromosome pair", function() {
    const wrapper = shallow(<GenomeView org={drake}/>);
    assert.lengthOf(wrapper.find('div.chromosome-pair'), 3, "Should create three 'chromosome-pair' <div>s");
  });

  it("should create a <ChromosomeView> component for each chromosome", function() {
    const wrapper = shallow(<GenomeView org={drake}/>);
    assert.lengthOf(wrapper.find('ChromosomeView'), 6, "Should create six 'ChromosomeView' components");
  });

  describe ("When defined by individual chromosomes", function() {
    const chromosomeMap = {
        "1": {
          "a": drake.getGenotype().chromosomes[1]["a"],
          "b": drake.getGenotype().chromosomes[1]["a"]
        },
        "2": {
          "a": drake.getGenotype().chromosomes[2]["a"],
          "b": drake.getGenotype().chromosomes[2]["a"]
        },
        "XY": {
          "x1": drake.getGenotype().chromosomes["XY"]["x1"],
          "y": drake.getGenotype().chromosomes["XY"]["y"]
        }
      };

    it("should create a correct <GenomeView> component", function() {
      const wrapper = shallow(<GenomeView chromosomes={chromosomeMap} species={drake.species}/>);
      assert.lengthOf(wrapper.find('div.chromosome-pair'), 3, "Should create three 'chromosome-pair' <div>s");
      assert.lengthOf(wrapper.find('ChromosomeView'), 6, "Should create six 'ChromosomeView' components");
    });

  });

});
