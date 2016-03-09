'use strict';

var challengeLabels = ['challenge-0', 'challenge-1', 'challenge-2'],
    challengeCount = challengeLabels.length,
    sexLabels = ['male', 'female'],
    organismAlleles = "a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
    hiddenAlleles = ['t', 'tk', 'h', 'c', 'a', 'b', 'd', 'bog', 'rh'],
    hiddenGenes = getHiddenGenesSet(BioLogica.Species.Drake, hiddenAlleles);
var _possibleAllelesForTrait = {},
    sexOfTargetDrake = undefined,
    targetDrake = undefined,
    sexOfYourDrake = undefined,
    yourDrake = undefined,
    requiredMoveCount = undefined,
    showDrakeForConfirmation = false,
    trialCount = 1,
    trialIndex = 1,
    moveCount = 0;

function parseQueryString(queryString) {
  var params = {},
      queries = undefined,
      temp = undefined,
      i = undefined,
      l = undefined;

  // Split into key/value pairs
  queries = queryString.split('&');

  // Convert the array of strings into an object
  for (i = 0, l = queries.length; i < l; i++) {
    temp = queries[i].split('=');
    params[temp[0]] = temp[1];
  }

  return params;
}

var urlParams = parseQueryString(window.location.search.substring(1)),
    challengeParam = urlParams.challenge && Number(urlParams.challenge),
    challenge = challengeParam >= 0 && challengeParam < challengeCount ? challengeParam : 0;

if (challenge >= 2) trialCount = 3;

function getHiddenGenesSet(iSpecies, iHiddenAlleles) {
  var hiddenGenes = new Set();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = iHiddenAlleles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var allele = _step.value;

      var gene = BioLogica.Genetics.getGeneOfAllele(iSpecies, allele);
      if (gene && gene.name) hiddenGenes.add(gene.name);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return hiddenGenes;
}

function resetDrakes() {
  requiredMoveCount = 0;
  // regenerate if we generate two identical drakes
  while (requiredMoveCount === 0) {
    sexOfTargetDrake = Math.floor(2 * Math.random());
    targetDrake = new BioLogica.Organism(BioLogica.Species.Drake, organismAlleles, sexOfTargetDrake);
    sexOfYourDrake = Math.floor(2 * Math.random());
    yourDrake = new BioLogica.Organism(BioLogica.Species.Drake, organismAlleles, sexOfYourDrake);
    requiredMoveCount = numberOfMovesToReachPhenotype(yourDrake, targetDrake);
  }
  render();
}

function render() {
  // target drake
  ReactDOM.render(React.createElement(GeniBlocks.OrganismGlowView, { org: targetDrake, color: '#FFFFAA', size: 200 }), document.getElementById('target-drake'));

  // trial feedback
  ReactDOM.render(React.createElement(GeniBlocks.FeedbackView, {
    text: ["TRIAL", trialIndex + ' of ' + trialCount]
  }), document.getElementById('trial-feedback'));

  // goal feedback
  ReactDOM.render(React.createElement(GeniBlocks.FeedbackView, {
    text: ['GOAL is ' + requiredMoveCount + ' MOVES', 'Your moves: ' + moveCount]
  }), document.getElementById('goal-feedback'));

  // your drake
  ReactDOM.render(React.createElement(GeniBlocks.QuestionOrganismGlowView, { hidden: challenge > 0 && !showDrakeForConfirmation,
    org: yourDrake, color: '#FFFFAA', size: 200 }), document.getElementById('your-drake'));
  // ReactDOM.render(
  //   React.createElement(GeniBlocks.HidableOrganismGlowView,
  //                       {hidden: true, org: yourDrake, color: '#FFFFAA', size: 200}),
  //   document.getElementById('your-drake'));

  // change sex buttons
  ReactDOM.render(React.createElement(GeniBlocks.ChangeSexButtons, {
    sex: sexLabels[sexOfYourDrake],
    species: "Drake",
    onChange: function onChange(evt, iSex) {
      sexOfYourDrake = sexLabels.indexOf(iSex);
      yourDrake = new BioLogica.Organism(BioLogica.Species.Drake, yourDrake.getAlleleString(), sexOfYourDrake);
      ++moveCount;
      render();
    }
  }), document.getElementById('change-sex-buttons'));

  // genome
  ReactDOM.render(React.createElement(GeniBlocks.GenomeView, {
    org: yourDrake,
    hiddenAlleles: hiddenAlleles,
    style: { marginTop: 50, top: 50 },
    alleleChanged: function alleleChanged(chrom, side, prevAllele, newAllele) {
      yourDrake.genetics.genotype.chromosomes[chrom][side].alleles.replaceFirst(prevAllele, newAllele);
      yourDrake = new BioLogica.Organism(BioLogica.Species.Drake, yourDrake.getAlleleString(), sexOfYourDrake);
      ++moveCount;
      render();
    }
  }), document.getElementById('drake-genome'));
}

function numberOfMovesToReachPhenotype(testDrake, targetDrake) {
  var requiredMoveCount = numberOfAlleleChangesToReachPhenotype(testDrake.phenotype.characteristics, targetDrake.phenotype.characteristics, testDrake.genetics.genotype.allAlleles, testDrake.species.traitRules);
  if (testDrake.sex !== targetDrake.sex) ++requiredMoveCount;

  return requiredMoveCount;
}

function numberOfAlleleChangesToReachPhenotype(testCharacteristics, targetCharacteristics, testAlleles, traitRules) {
  var alleles = testAlleles,
      moves = 0;

  for (var trait in traitRules) {
    if (traitRules.hasOwnProperty(trait)) {
      if (testCharacteristics[trait] !== targetCharacteristics[trait]) {
        // first we have to work out what alleles the original drake has that correspond to
        // their non-matching trait
        var possibleTraitAlleles = collectAllAllelesForTrait(trait, traitRules),
            characteristicAlleles = [];
        for (var i = 0, ii = alleles.length; i < ii; i++) {
          if (possibleTraitAlleles.indexOf(alleles[i]) >= 0) {
            characteristicAlleles.push(alleles[i]);
          }
        }
        // now work out the smallest number of steps to get from there to the desired characteristic
        var possibleSolutions = traitRules[trait][targetCharacteristics[trait]],
            shortestPathLength = Infinity;
        for (i = 0, ii = possibleSolutions.length; i < ii; i++) {
          var solution = possibleSolutions[i].slice(),
              pathLength = 0;
          for (var j = 0, jj = characteristicAlleles.length; j < jj; j++) {
            if (solution.indexOf(characteristicAlleles[j]) === -1) {
              pathLength++;
            } else {
              solution.splice(solution.indexOf(characteristicAlleles[j]), 1); // already matched this one, can't match it again
            }
          }
          shortestPathLength = pathLength < shortestPathLength ? pathLength : shortestPathLength;
        }
        moves += shortestPathLength;
      }
    }
  }
  return moves;
}

// Goes through the traitRules to find out what unique alleles are associated with each trait
// E.g. For "tail" it will return ["T", "Tk", "t"]
function collectAllAllelesForTrait(trait, traitRules) {
  if (_possibleAllelesForTrait[trait]) {
    return _possibleAllelesForTrait[trait];
  }

  var allelesHash = {},
      alleles = [];
  for (var characteristic in traitRules[trait]) {
    for (var possibileAllelesCombo in traitRules[trait][characteristic]) {
      if (traitRules[trait][characteristic].hasOwnProperty(possibileAllelesCombo)) {
        for (var i = 0, ii = traitRules[trait][characteristic][possibileAllelesCombo].length; i < ii; i++) {
          allelesHash[traitRules[trait][characteristic][possibileAllelesCombo][i]] = 1;
        }
      }
    }
  }

  for (var allele in allelesHash) {
    alleles.push(allele);
  }

  _possibleAllelesForTrait[trait] = alleles; // store so we don't need to recalculate it
  return alleles;
}

function checkDrake(iYourDrake, iTargetDrake, iHiddenGenes) {
  var characteristicToGeneMap = {
    "armor": "armor",
    "tail": "tail",
    "forelimbs": "forelimbs",
    "hindlimbs": "hindlimbs",
    "horns": "horns",
    "nose spike": "nose",
    "wings": "wings",
    "color": "color",
    "health": "bogbreath",
    "liveliness": "dilute"
  };
  if (iYourDrake.sex !== iTargetDrake.sex) return false;
  for (var ch in iYourDrake.phenotype.characteristics) {
    var yourValue = iYourDrake.phenotype.characteristics[ch],
        targetValue = iTargetDrake.phenotype.characteristics[ch],
        gene = characteristicToGeneMap[ch];
    if (!iHiddenGenes.has(gene) && yourValue !== targetValue) return false;
  }
  return true;
}

/*eslint no-unused-vars: [1, { "varsIgnorePattern": "resetChallenge|nextChallenge|advanceTrial" }]*/
var resetChallenge = function resetChallenge() {
  trialIndex = 1;
  moveCount = 0;
  resetDrakes();
};

var nextChallenge = function nextChallenge() {
  var url = window.location.href,
      nextUrl = undefined;
  if (challenge < 2) {
    nextUrl = url.replace('challenge=' + challenge, 'challenge=' + (challenge + 1));
  } else {
    var case1Index = url.indexOf('case-1');
    nextUrl = url.substr(0, case1Index);
  }
  window.location.assign(nextUrl);
};

var advanceTrial = function advanceTrial() {
  if (challenge >= 2) {
    if (trialIndex >= trialCount) {
      showAlert(true, {
        title: "Congratulations!",
        message1: "You've completed all the trials in this challenge.",
        okButton: "Go back to the Case Log",
        okCallback: "nextChallenge",
        tryButton: "Try Again",
        tryCallback: "resetChallenge"
      });
      return;
    }
    ++trialIndex;
  }
  moveCount = 0;
  resetDrakes();
};

function showAlert(iShow, iOptions) {
  var displayMode = iShow ? 'block' : 'none';
  if (iShow) {
    document.getElementById("alert-title").innerHTML = iOptions.title || "";
    document.getElementById("alert-message1").innerHTML = iOptions.message1 || "";
    document.getElementById("alert-message2").innerHTML = iOptions.message2 || "";
    document.getElementById("alert-ok-button").innerHTML = iOptions.okButton || "";
    document.getElementById("alert-ok-button").style.display = iOptions.okButton ? 'block' : 'none';
    document.getElementById("alert-ok-button").dataset.okCallback = iOptions.okCallback || '';
    document.getElementById("alert-try-button").innerHTML = iOptions.tryButton || "";
    document.getElementById("alert-try-button").style.display = iOptions.tryButton ? 'block' : 'none';
    document.getElementById("alert-try-button").dataset.tryCallback = iOptions.tryCallback || '';
  }
  document.getElementById("overlay").style.display = displayMode;
  document.getElementById("alert-wrapper").style.display = displayMode;
}

document.getElementById("test-drake-button").onclick = function () {
  showDrakeForConfirmation = true;
  render();
  /* global imagesLoaded */
  if (checkDrake(yourDrake, targetDrake, hiddenGenes)) {
    imagesLoaded('#your-drake', function () {
      if (challenge <= 1) {
        showAlert(true, {
          title: "Good work!",
          message1: "The drake you have created matches the target drake.",
          okButton: "Next Challenge",
          okCallback: "nextChallenge",
          tryButton: "Try Again",
          tryCallback: "resetChallenge"
        });
      } else {
        showAlert(true, {
          title: "Good work!",
          message1: "The drake you have created matches the target drake.",
          okButton: "OK",
          okCallback: "advanceTrial"
        });
      }
    });
  } else {
    imagesLoaded('#your-drake', function () {
      showAlert(true, {
        title: "That's not the drake!",
        message1: "The drake you have created doesn't match the target drake.\nPlease try again.",
        tryButton: "Try Again"
      });
      render();
    });
  }
};

document.getElementById("alert-ok-button").onclick = function (evt) {
  showAlert(false);
  showDrakeForConfirmation = false;
  if (evt.target.dataset.okCallback && window[evt.target.dataset.okCallback]) window[evt.target.dataset.okCallback].call();
  render();
};

document.getElementById("alert-try-button").onclick = function (evt) {
  showAlert(false);
  showDrakeForConfirmation = false;
  if (evt.target.dataset.tryCallback && window[evt.target.dataset.tryCallback]) window[evt.target.dataset.tryCallback].call();
  render();
};

resetDrakes();
//# sourceMappingURL=data:application/json;base64,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QUFJLE1BQUosQ0FBVyxPQUFYLENBQW1CLFdBQW5CLElBQWtDLE9BQU8sSUFBSSxNQUFKLENBQVcsT0FBWCxDQUFtQixXQUFuQixDQUF6QyxFQUNGLE9BQU8sSUFBSSxNQUFKLENBQVcsT0FBWCxDQUFtQixXQUFuQixDQUFQLENBQXVDLElBQXZDLEdBREY7QUFFQSxXQUxrRTtDQUFkOztBQVF0RCIsImZpbGUiOiJjYXNlLTEvY2hhbGxlbmdlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNoYWxsZW5nZUxhYmVscyA9IFsnY2hhbGxlbmdlLTAnLCAnY2hhbGxlbmdlLTEnLCAnY2hhbGxlbmdlLTInXSxcbiAgICAgIGNoYWxsZW5nZUNvdW50ID0gY2hhbGxlbmdlTGFiZWxzLmxlbmd0aCxcbiAgICAgIHNleExhYmVscyA9IFsnbWFsZScsICdmZW1hbGUnXSxcbiAgICAgIG9yZ2FuaXNtQWxsZWxlcyA9IFwiYTpoLGI6aCxhOkMsYjpDLGE6YSxiOmEsYTpCLGI6QixhOkQsYjpELGE6VCxiOnQsYTpyaCxiOnJoLGE6Qm9nLGI6Qm9nXCIsXG4gICAgICBoaWRkZW5BbGxlbGVzID0gWyd0JywndGsnLCdoJywnYycsJ2EnLCdiJywnZCcsJ2JvZycsJ3JoJ10sXG4gICAgICBoaWRkZW5HZW5lcyA9IGdldEhpZGRlbkdlbmVzU2V0KEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBoaWRkZW5BbGxlbGVzKTtcbmxldCAgIF9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdCA9IHt9LFxuICAgICAgc2V4T2ZUYXJnZXREcmFrZSxcbiAgICAgIHRhcmdldERyYWtlLFxuICAgICAgc2V4T2ZZb3VyRHJha2UsXG4gICAgICB5b3VyRHJha2UsXG4gICAgICByZXF1aXJlZE1vdmVDb3VudCxcbiAgICAgIHNob3dEcmFrZUZvckNvbmZpcm1hdGlvbiA9IGZhbHNlLFxuICAgICAgdHJpYWxDb3VudCA9IDEsXG4gICAgICB0cmlhbEluZGV4ID0gMSxcbiAgICAgIG1vdmVDb3VudCA9IDA7XG5cbmZ1bmN0aW9uIHBhcnNlUXVlcnlTdHJpbmcocXVlcnlTdHJpbmcpIHtcbiAgICBsZXQgcGFyYW1zID0ge30sIHF1ZXJpZXMsIHRlbXAsIGksIGw7XG5cbiAgICAvLyBTcGxpdCBpbnRvIGtleS92YWx1ZSBwYWlyc1xuICAgIHF1ZXJpZXMgPSBxdWVyeVN0cmluZy5zcGxpdCgnJicpO1xuXG4gICAgLy8gQ29udmVydCB0aGUgYXJyYXkgb2Ygc3RyaW5ncyBpbnRvIGFuIG9iamVjdFxuICAgIGZvciAoIGkgPSAwLCBsID0gcXVlcmllcy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG4gICAgICAgIHRlbXAgPSBxdWVyaWVzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgIHBhcmFtc1t0ZW1wWzBdXSA9IHRlbXBbMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtcztcbn1cblxubGV0IHVybFBhcmFtcyA9IHBhcnNlUXVlcnlTdHJpbmcoKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLnN1YnN0cmluZygxKSksXG4gICAgY2hhbGxlbmdlUGFyYW0gPSB1cmxQYXJhbXMuY2hhbGxlbmdlICYmIE51bWJlcih1cmxQYXJhbXMuY2hhbGxlbmdlKSxcbiAgICBjaGFsbGVuZ2UgPSAoY2hhbGxlbmdlUGFyYW0gPj0gMCkgJiYgKGNoYWxsZW5nZVBhcmFtIDwgY2hhbGxlbmdlQ291bnQpID8gY2hhbGxlbmdlUGFyYW0gOiAwO1xuXG5pZiAoY2hhbGxlbmdlID49IDIpXG4gIHRyaWFsQ291bnQgPSAzO1xuXG5mdW5jdGlvbiBnZXRIaWRkZW5HZW5lc1NldChpU3BlY2llcywgaUhpZGRlbkFsbGVsZXMpIHtcbiAgbGV0IGhpZGRlbkdlbmVzID0gbmV3IFNldDtcbiAgZm9yKGNvbnN0IGFsbGVsZSBvZiBpSGlkZGVuQWxsZWxlcykge1xuICAgIGNvbnN0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKGlTcGVjaWVzLCBhbGxlbGUpO1xuICAgIGlmIChnZW5lICYmIGdlbmUubmFtZSlcbiAgICAgIGhpZGRlbkdlbmVzLmFkZChnZW5lLm5hbWUpO1xuICB9XG4gIHJldHVybiBoaWRkZW5HZW5lcztcbn1cblxuZnVuY3Rpb24gcmVzZXREcmFrZXMoKSB7XG4gIHJlcXVpcmVkTW92ZUNvdW50ID0gMDtcbiAgLy8gcmVnZW5lcmF0ZSBpZiB3ZSBnZW5lcmF0ZSB0d28gaWRlbnRpY2FsIGRyYWtlc1xuICB3aGlsZSAocmVxdWlyZWRNb3ZlQ291bnQgPT09IDApIHtcbiAgICBzZXhPZlRhcmdldERyYWtlID0gTWF0aC5mbG9vcigyICogTWF0aC5yYW5kb20oKSk7XG4gICAgdGFyZ2V0RHJha2UgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBvcmdhbmlzbUFsbGVsZXMsIHNleE9mVGFyZ2V0RHJha2UpO1xuICAgIHNleE9mWW91ckRyYWtlID0gTWF0aC5mbG9vcigyICogTWF0aC5yYW5kb20oKSk7XG4gICAgeW91ckRyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgb3JnYW5pc21BbGxlbGVzLCBzZXhPZllvdXJEcmFrZSk7XG4gICAgcmVxdWlyZWRNb3ZlQ291bnQgPSBudW1iZXJPZk1vdmVzVG9SZWFjaFBoZW5vdHlwZSh5b3VyRHJha2UsIHRhcmdldERyYWtlKTtcbiAgfVxuICByZW5kZXIoKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyKCkge1xuICAvLyB0YXJnZXQgZHJha2VcbiAgUmVhY3RET00ucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2VuaUJsb2Nrcy5PcmdhbmlzbUdsb3dWaWV3LCB7b3JnOiB0YXJnZXREcmFrZSwgY29sb3I6ICcjRkZGRkFBJywgc2l6ZTogMjAwfSksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhcmdldC1kcmFrZScpKTtcblxuICAvLyB0cmlhbCBmZWVkYmFja1xuICBSZWFjdERPTS5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChHZW5pQmxvY2tzLkZlZWRiYWNrVmlldywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUUklBTFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3RyaWFsSW5kZXh9IG9mICR7dHJpYWxDb3VudH1gXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmlhbC1mZWVkYmFjaycpKTtcblxuICAvLyBnb2FsIGZlZWRiYWNrXG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuRmVlZGJhY2tWaWV3LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgR09BTCBpcyAke3JlcXVpcmVkTW92ZUNvdW50fSBNT1ZFU2AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYFlvdXIgbW92ZXM6ICR7bW92ZUNvdW50fWBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dvYWwtZmVlZGJhY2snKSk7XG5cbiAgLy8geW91ciBkcmFrZVxuICBSZWFjdERPTS5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChHZW5pQmxvY2tzLlF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtoaWRkZW46IChjaGFsbGVuZ2UgPiAwKSAmJiAhc2hvd0RyYWtlRm9yQ29uZmlybWF0aW9uLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnOiB5b3VyRHJha2UsIGNvbG9yOiAnI0ZGRkZBQScsIHNpemU6IDIwMH0pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd5b3VyLWRyYWtlJykpO1xuICAvLyBSZWFjdERPTS5yZW5kZXIoXG4gIC8vICAgUmVhY3QuY3JlYXRlRWxlbWVudChHZW5pQmxvY2tzLkhpZGFibGVPcmdhbmlzbUdsb3dWaWV3LFxuICAvLyAgICAgICAgICAgICAgICAgICAgICAge2hpZGRlbjogdHJ1ZSwgb3JnOiB5b3VyRHJha2UsIGNvbG9yOiAnI0ZGRkZBQScsIHNpemU6IDIwMH0pLFxuICAvLyAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd5b3VyLWRyYWtlJykpO1xuXG4gIC8vIGNoYW5nZSBzZXggYnV0dG9uc1xuICBSZWFjdERPTS5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChHZW5pQmxvY2tzLkNoYW5nZVNleEJ1dHRvbnMsIHtcbiAgICAgICAgICBzZXg6IHNleExhYmVsc1tzZXhPZllvdXJEcmFrZV0sXG4gICAgICAgICAgc3BlY2llczogXCJEcmFrZVwiLFxuICAgICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihldnQsIGlTZXgpIHtcbiAgICAgICAgICAgIHNleE9mWW91ckRyYWtlID0gc2V4TGFiZWxzLmluZGV4T2YoaVNleCk7XG4gICAgICAgICAgICB5b3VyRHJha2UgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW91ckRyYWtlLmdldEFsbGVsZVN0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V4T2ZZb3VyRHJha2UpO1xuICAgICAgICAgICAgKyttb3ZlQ291bnQ7XG4gICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFuZ2Utc2V4LWJ1dHRvbnMnKVxuICApO1xuXG4gIC8vIGdlbm9tZVxuICBSZWFjdERPTS5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChHZW5pQmxvY2tzLkdlbm9tZVZpZXcsIHtcbiAgICAgIG9yZzogeW91ckRyYWtlLFxuICAgICAgaGlkZGVuQWxsZWxlczogaGlkZGVuQWxsZWxlcyxcbiAgICAgIHN0eWxlOiB7bWFyZ2luVG9wOiA1MCwgdG9wOiA1MH0sXG4gICAgICBhbGxlbGVDaGFuZ2VkOiBmdW5jdGlvbihjaHJvbSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKSB7XG4gICAgICAgIHlvdXJEcmFrZS5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lc1tjaHJvbV1bc2lkZV0uYWxsZWxlcy5yZXBsYWNlRmlyc3QocHJldkFsbGVsZSwgbmV3QWxsZWxlKTtcbiAgICAgICAgeW91ckRyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW91ckRyYWtlLmdldEFsbGVsZVN0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXhPZllvdXJEcmFrZSk7XG4gICAgICAgICsrbW92ZUNvdW50O1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJha2UtZ2Vub21lJylcbiAgKTtcblxufVxuXG5mdW5jdGlvbiBudW1iZXJPZk1vdmVzVG9SZWFjaFBoZW5vdHlwZSh0ZXN0RHJha2UsIHRhcmdldERyYWtlKSB7XG4gIGxldCByZXF1aXJlZE1vdmVDb3VudCA9IG51bWJlck9mQWxsZWxlQ2hhbmdlc1RvUmVhY2hQaGVub3R5cGUodGVzdERyYWtlLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RHJha2UucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0RHJha2UuZ2VuZXRpY3MuZ2Vub3R5cGUuYWxsQWxsZWxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0RHJha2Uuc3BlY2llcy50cmFpdFJ1bGVzKTtcbiAgaWYgKHRlc3REcmFrZS5zZXggIT09IHRhcmdldERyYWtlLnNleClcbiAgICArK3JlcXVpcmVkTW92ZUNvdW50O1xuXG4gIHJldHVybiByZXF1aXJlZE1vdmVDb3VudDtcbn1cblxuZnVuY3Rpb24gbnVtYmVyT2ZBbGxlbGVDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZSh0ZXN0Q2hhcmFjdGVyaXN0aWNzLCB0YXJnZXRDaGFyYWN0ZXJpc3RpY3MsIHRlc3RBbGxlbGVzLCB0cmFpdFJ1bGVzKXtcbiAgdmFyIGFsbGVsZXMgPSB0ZXN0QWxsZWxlcyxcbiAgICAgIG1vdmVzICAgPSAwO1xuXG4gIGZvciAodmFyIHRyYWl0IGluIHRyYWl0UnVsZXMpIHtcbiAgICBpZiAodHJhaXRSdWxlcy5oYXNPd25Qcm9wZXJ0eSh0cmFpdCkpIHtcbiAgICAgIGlmICh0ZXN0Q2hhcmFjdGVyaXN0aWNzW3RyYWl0XSAhPT0gdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzW3RyYWl0XSkge1xuICAgICAgICAvLyBmaXJzdCB3ZSBoYXZlIHRvIHdvcmsgb3V0IHdoYXQgYWxsZWxlcyB0aGUgb3JpZ2luYWwgZHJha2UgaGFzIHRoYXQgY29ycmVzcG9uZCB0b1xuICAgICAgICAvLyB0aGVpciBub24tbWF0Y2hpbmcgdHJhaXRcbiAgICAgICAgdmFyIHBvc3NpYmxlVHJhaXRBbGxlbGVzID0gY29sbGVjdEFsbEFsbGVsZXNGb3JUcmFpdCh0cmFpdCwgdHJhaXRSdWxlcyksXG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY0FsbGVsZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gYWxsZWxlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgaWYgKHBvc3NpYmxlVHJhaXRBbGxlbGVzLmluZGV4T2YoYWxsZWxlc1tpXSkgPj0gMCl7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY0FsbGVsZXMucHVzaChhbGxlbGVzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm93IHdvcmsgb3V0IHRoZSBzbWFsbGVzdCBudW1iZXIgb2Ygc3RlcHMgdG8gZ2V0IGZyb20gdGhlcmUgdG8gdGhlIGRlc2lyZWQgY2hhcmFjdGVyaXN0aWNcbiAgICAgICAgdmFyIHBvc3NpYmxlU29sdXRpb25zID0gdHJhaXRSdWxlc1t0cmFpdF1bdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzW3RyYWl0XV0sXG4gICAgICAgICAgICBzaG9ydGVzdFBhdGhMZW5ndGggPSBJbmZpbml0eTtcbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgdmFyIHNvbHV0aW9uID0gcG9zc2libGVTb2x1dGlvbnNbaV0uc2xpY2UoKSxcbiAgICAgICAgICAgICAgcGF0aExlbmd0aCA9IDA7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpqID0gY2hhcmFjdGVyaXN0aWNBbGxlbGVzLmxlbmd0aDsgaiA8IGpqOyBqKyspe1xuICAgICAgICAgICAgaWYgKHNvbHV0aW9uLmluZGV4T2YoY2hhcmFjdGVyaXN0aWNBbGxlbGVzW2pdKSA9PT0gLTEpe1xuICAgICAgICAgICAgICBwYXRoTGVuZ3RoKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzb2x1dGlvbi5zcGxpY2Uoc29sdXRpb24uaW5kZXhPZihjaGFyYWN0ZXJpc3RpY0FsbGVsZXNbal0pLCAxKTsgICAgICAvLyBhbHJlYWR5IG1hdGNoZWQgdGhpcyBvbmUsIGNhbid0IG1hdGNoIGl0IGFnYWluXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNob3J0ZXN0UGF0aExlbmd0aCA9IChwYXRoTGVuZ3RoIDwgc2hvcnRlc3RQYXRoTGVuZ3RoKSA/IHBhdGhMZW5ndGggOiBzaG9ydGVzdFBhdGhMZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgbW92ZXMgKz0gc2hvcnRlc3RQYXRoTGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbW92ZXM7XG59XG5cbi8vIEdvZXMgdGhyb3VnaCB0aGUgdHJhaXRSdWxlcyB0byBmaW5kIG91dCB3aGF0IHVuaXF1ZSBhbGxlbGVzIGFyZSBhc3NvY2lhdGVkIHdpdGggZWFjaCB0cmFpdFxuLy8gRS5nLiBGb3IgXCJ0YWlsXCIgaXQgd2lsbCByZXR1cm4gW1wiVFwiLCBcIlRrXCIsIFwidFwiXVxuZnVuY3Rpb24gY29sbGVjdEFsbEFsbGVsZXNGb3JUcmFpdCh0cmFpdCwgdHJhaXRSdWxlcykge1xuICBpZiAoX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XSkge1xuICAgIHJldHVybiBfcG9zc2libGVBbGxlbGVzRm9yVHJhaXRbdHJhaXRdO1xuICB9XG5cbiAgdmFyIGFsbGVsZXNIYXNoID0ge30sXG4gICAgICBhbGxlbGVzICAgICA9IFtdO1xuICBmb3IgKHZhciBjaGFyYWN0ZXJpc3RpYyBpbiB0cmFpdFJ1bGVzW3RyYWl0XSl7XG4gICAgICBmb3IgKHZhciBwb3NzaWJpbGVBbGxlbGVzQ29tYm8gaW4gdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdKSB7XG4gICAgICAgIGlmICh0cmFpdFJ1bGVzW3RyYWl0XVtjaGFyYWN0ZXJpc3RpY10uaGFzT3duUHJvcGVydHkocG9zc2liaWxlQWxsZWxlc0NvbWJvKSl7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdW3Bvc3NpYmlsZUFsbGVsZXNDb21ib10ubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgYWxsZWxlc0hhc2hbdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdW3Bvc3NpYmlsZUFsbGVsZXNDb21ib11baV1dID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGFsbGVsZSBpbiBhbGxlbGVzSGFzaCl7XG4gICAgYWxsZWxlcy5wdXNoKGFsbGVsZSk7XG4gIH1cblxuICBfcG9zc2libGVBbGxlbGVzRm9yVHJhaXRbdHJhaXRdID0gYWxsZWxlczsgICAgICAvLyBzdG9yZSBzbyB3ZSBkb24ndCBuZWVkIHRvIHJlY2FsY3VsYXRlIGl0XG4gIHJldHVybiBhbGxlbGVzO1xufVxuXG5mdW5jdGlvbiBjaGVja0RyYWtlKGlZb3VyRHJha2UsIGlUYXJnZXREcmFrZSwgaUhpZGRlbkdlbmVzKSB7XG4gIGNvbnN0IGNoYXJhY3RlcmlzdGljVG9HZW5lTWFwID0ge1xuICAgICAgICAgIFwiYXJtb3JcIjogXCJhcm1vclwiLFxuICAgICAgICAgIFwidGFpbFwiOiBcInRhaWxcIixcbiAgICAgICAgICBcImZvcmVsaW1ic1wiOiBcImZvcmVsaW1ic1wiLFxuICAgICAgICAgIFwiaGluZGxpbWJzXCI6IFwiaGluZGxpbWJzXCIsXG4gICAgICAgICAgXCJob3Juc1wiOiBcImhvcm5zXCIsXG4gICAgICAgICAgXCJub3NlIHNwaWtlXCI6IFwibm9zZVwiLFxuICAgICAgICAgIFwid2luZ3NcIjogXCJ3aW5nc1wiLFxuICAgICAgICAgIFwiY29sb3JcIjogXCJjb2xvclwiLFxuICAgICAgICAgIFwiaGVhbHRoXCI6IFwiYm9nYnJlYXRoXCIsXG4gICAgICAgICAgXCJsaXZlbGluZXNzXCI6IFwiZGlsdXRlXCJcbiAgICAgICAgfTtcbiAgaWYoaVlvdXJEcmFrZS5zZXggIT09IGlUYXJnZXREcmFrZS5zZXgpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBmb3IoY29uc3QgY2ggaW4gaVlvdXJEcmFrZS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzKSB7XG4gICAgY29uc3QgeW91clZhbHVlID0gaVlvdXJEcmFrZS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzW2NoXSxcbiAgICAgICAgICB0YXJnZXRWYWx1ZSA9IGlUYXJnZXREcmFrZS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzW2NoXSxcbiAgICAgICAgICBnZW5lID0gY2hhcmFjdGVyaXN0aWNUb0dlbmVNYXBbY2hdO1xuICAgIGlmKCFpSGlkZGVuR2VuZXMuaGFzKGdlbmUpICYmICh5b3VyVmFsdWUgIT09IHRhcmdldFZhbHVlKSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyplc2xpbnQgbm8tdW51c2VkLXZhcnM6IFsxLCB7IFwidmFyc0lnbm9yZVBhdHRlcm5cIjogXCJyZXNldENoYWxsZW5nZXxuZXh0Q2hhbGxlbmdlfGFkdmFuY2VUcmlhbFwiIH1dKi9cbmNvbnN0IHJlc2V0Q2hhbGxlbmdlID0gZnVuY3Rpb24gcmVzZXRDaGFsbGVuZ2UoKSB7XG4gIHRyaWFsSW5kZXggPSAxO1xuICBtb3ZlQ291bnQgPSAwO1xuICByZXNldERyYWtlcygpO1xufTtcblxuY29uc3QgbmV4dENoYWxsZW5nZSA9IGZ1bmN0aW9uIG5leHRDaGFsbGVuZ2UoKSB7XG4gIGxldCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgIG5leHRVcmw7XG4gIGlmIChjaGFsbGVuZ2UgPCAyKSB7XG4gICAgbmV4dFVybCA9IHVybC5yZXBsYWNlKGBjaGFsbGVuZ2U9JHtjaGFsbGVuZ2V9YCwgYGNoYWxsZW5nZT0ke2NoYWxsZW5nZSsxfWApO1xuICB9XG4gIGVsc2Uge1xuICAgIGNvbnN0IGNhc2UxSW5kZXggPSB1cmwuaW5kZXhPZignY2FzZS0xJyk7XG4gICAgbmV4dFVybCA9IHVybC5zdWJzdHIoMCwgY2FzZTFJbmRleCk7XG4gIH1cbiAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihuZXh0VXJsKTtcbn07XG5cbmNvbnN0IGFkdmFuY2VUcmlhbCA9IGZ1bmN0aW9uIGFkdmFuY2VUcmlhbCgpIHtcbiAgaWYgKGNoYWxsZW5nZSA+PSAyKSB7XG4gICAgaWYgKHRyaWFsSW5kZXggPj0gdHJpYWxDb3VudCkge1xuICAgICAgc2hvd0FsZXJ0KHRydWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkNvbmdyYXR1bGF0aW9ucyFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UxOiBcIllvdSd2ZSBjb21wbGV0ZWQgYWxsIHRoZSB0cmlhbHMgaW4gdGhpcyBjaGFsbGVuZ2UuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBva0J1dHRvbjogXCJHbyBiYWNrIHRvIHRoZSBDYXNlIExvZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2tDYWxsYmFjazogXCJuZXh0Q2hhbGxlbmdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnlCdXR0b246IFwiVHJ5IEFnYWluXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnlDYWxsYmFjazogXCJyZXNldENoYWxsZW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgICsrdHJpYWxJbmRleDtcbiAgfVxuICBtb3ZlQ291bnQgPSAwO1xuICByZXNldERyYWtlcygpO1xufTtcblxuZnVuY3Rpb24gc2hvd0FsZXJ0KGlTaG93LCBpT3B0aW9ucykge1xuICBjb25zdCBkaXNwbGF5TW9kZSA9IGlTaG93ID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgaWYgKGlTaG93KSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC10aXRsZVwiKS5pbm5lckhUTUwgPSBpT3B0aW9ucy50aXRsZSB8fCBcIlwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtbWVzc2FnZTFcIikuaW5uZXJIVE1MID0gaU9wdGlvbnMubWVzc2FnZTEgfHwgXCJcIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LW1lc3NhZ2UyXCIpLmlubmVySFRNTCA9IGlPcHRpb25zLm1lc3NhZ2UyIHx8IFwiXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC1vay1idXR0b25cIikuaW5uZXJIVE1MID0gaU9wdGlvbnMub2tCdXR0b24gfHwgXCJcIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LW9rLWJ1dHRvblwiKS5zdHlsZS5kaXNwbGF5ID0gaU9wdGlvbnMub2tCdXR0b24gPyAnYmxvY2snIDogJ25vbmUnO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtb2stYnV0dG9uXCIpLmRhdGFzZXQub2tDYWxsYmFjayA9IGlPcHRpb25zLm9rQ2FsbGJhY2sgfHwgJyc7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC10cnktYnV0dG9uXCIpLmlubmVySFRNTCA9IGlPcHRpb25zLnRyeUJ1dHRvbiB8fCBcIlwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtdHJ5LWJ1dHRvblwiKS5zdHlsZS5kaXNwbGF5ID0gaU9wdGlvbnMudHJ5QnV0dG9uID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXRyeS1idXR0b25cIikuZGF0YXNldC50cnlDYWxsYmFjayA9IGlPcHRpb25zLnRyeUNhbGxiYWNrIHx8ICcnO1xuICB9XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheU1vZGU7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtd3JhcHBlclwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheU1vZGU7XG59XG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVzdC1kcmFrZS1idXR0b25cIikub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICBzaG93RHJha2VGb3JDb25maXJtYXRpb24gPSB0cnVlO1xuICByZW5kZXIoKTtcbiAgLyogZ2xvYmFsIGltYWdlc0xvYWRlZCAqL1xuICBpZiAoY2hlY2tEcmFrZSh5b3VyRHJha2UsIHRhcmdldERyYWtlLCBoaWRkZW5HZW5lcykpIHtcbiAgICBpbWFnZXNMb2FkZWQoJyN5b3VyLWRyYWtlJywgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoY2hhbGxlbmdlIDw9IDEpIHtcbiAgICAgICAgc2hvd0FsZXJ0KHRydWUsIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkdvb2Qgd29yayFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTE6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgbWF0Y2hlcyB0aGUgdGFyZ2V0IGRyYWtlLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBva0J1dHRvbjogXCJOZXh0IENoYWxsZW5nZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBva0NhbGxiYWNrOiBcIm5leHRDaGFsbGVuZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5QnV0dG9uOiBcIlRyeSBBZ2FpblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0cnlDYWxsYmFjazogXCJyZXNldENoYWxsZW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBzaG93QWxlcnQodHJ1ZSwgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiR29vZCB3b3JrIVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlMTogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBtYXRjaGVzIHRoZSB0YXJnZXQgZHJha2UuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9rQnV0dG9uOiBcIk9LXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9rQ2FsbGJhY2s6IFwiYWR2YW5jZVRyaWFsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGltYWdlc0xvYWRlZCgnI3lvdXItZHJha2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIHNob3dBbGVydCh0cnVlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJUaGF0J3Mgbm90IHRoZSBkcmFrZSFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UxOiBcIlRoZSBkcmFrZSB5b3UgaGF2ZSBjcmVhdGVkIGRvZXNuJ3QgbWF0Y2ggdGhlIHRhcmdldCBkcmFrZS5cXG5QbGVhc2UgdHJ5IGFnYWluLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5QnV0dG9uOiBcIlRyeSBBZ2FpblwiXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICByZW5kZXIoKTtcbiAgICB9KTtcbiAgfVxufTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC1vay1idXR0b25cIikub25jbGljayA9IGZ1bmN0aW9uKGV2dCkge1xuICBzaG93QWxlcnQoZmFsc2UpO1xuICBzaG93RHJha2VGb3JDb25maXJtYXRpb24gPSBmYWxzZTtcbiAgaWYgKGV2dC50YXJnZXQuZGF0YXNldC5va0NhbGxiYWNrICYmIHdpbmRvd1tldnQudGFyZ2V0LmRhdGFzZXQub2tDYWxsYmFja10pXG4gICAgd2luZG93W2V2dC50YXJnZXQuZGF0YXNldC5va0NhbGxiYWNrXS5jYWxsKCk7XG4gIHJlbmRlcigpO1xufTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC10cnktYnV0dG9uXCIpLm9uY2xpY2sgPSBmdW5jdGlvbihldnQpIHtcbiAgc2hvd0FsZXJ0KGZhbHNlKTtcbiAgc2hvd0RyYWtlRm9yQ29uZmlybWF0aW9uID0gZmFsc2U7XG4gIGlmIChldnQudGFyZ2V0LmRhdGFzZXQudHJ5Q2FsbGJhY2sgJiYgd2luZG93W2V2dC50YXJnZXQuZGF0YXNldC50cnlDYWxsYmFja10pXG4gICAgd2luZG93W2V2dC50YXJnZXQuZGF0YXNldC50cnlDYWxsYmFja10uY2FsbCgpO1xuICByZW5kZXIoKTtcbn07XG5cbnJlc2V0RHJha2VzKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
