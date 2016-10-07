window.GV2Authoring = [
  [
    {
      "template": "GenomePlayground",
      "initialDrake": {
        "alleles": "a:T,b:T,a:w,b:w,a:h,b:h,a:A1,b:A1,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 1
      },
      "hiddenAlleles": "t,tk,h,c,a,b,d,bog,rh"
    },
    {
      "template": "GenomeChallenge",
      "initialDrake": {
        "alleles": "a:T,b:T,a:h,b:h,a:A1,b:A1,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 1
      },
      "targetDrakes": [{
        "alleles": "a:w,a:m,b:m,a:fl,a:hl,a:T,b:T,a:h,b:h,a:C,b:C,a:A1,b:A1,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 1
      }],
      "hiddenAlleles": "t,tk,h,c,a,b,d,bog,rh"
    },
    {
      "template": "GenomeChallenge",
      "trialGenerator": {
        "type": "all-combinations",
        "baseDrake": "a:T,b:T,a:h,b:h,a:A1,b:A1,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "initialDrakeCombos": [
          ["a:M,b:M",   "a:M,b:m",   "a:m,b:M",   "a:m,b:m"],
          ["a:W,b:W",   "a:W,b:w",   "a:w,b:W",   "a:w,b:w"],
          ["a:Fl,b:Fl", "a:Fl,b:fl", "a:fl,b:Fl", "a:fl,b:fl"],
          ["a:Hl,b:Hl", "a:Hl,b:hl", "a:hl,b:Hl", "a:hl,b:hl"]
        ],
        "targetDrakeCombos": [
          ["a:M,b:M",   "a:m,b:m"],
          ["a:W,b:W",   "a:w,b:w"],
          ["a:Fl,b:Fl", "a:fl,b:fl"],
          ["a:Hl,b:Hl", "a:hl,b:hl"]
        ]
      },
      "targetDrakes": [{},{},{}],
      "hiddenAlleles": "t,tk,h,c,a,b,d,bog,rh"
    }
  ],
  [
    {
      "template": "EggGame",
      "challengeType": "create-unique",
      "showUserDrake": true,
      "mother":{
        "alleles": "a:w,b:W,a:M,b:m,a:fl,a:hl,a:T,b:T,a:h,b:h,a:C,b:C,a:A1,b:A1,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 1
      },
      "father": {
        "alleles": "a:w,b:W,a:m,b:m,a:T,b:T,a:h,b:h,a:A1,b:A1,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 0
      },
      "hiddenAlleles": "t,tk,h,c,a,b,d,bog,rh"
    },
    {
      "template": "EggGame",
      "challengeType": "match-target",
      "showUserDrake": true,
      "mother":{
        "alleles": "a:w,b:W,a:M,b:m,a:fl,a:hl,a:T,b:T,a:h,b:h,a:C,b:C,a:A1,b:A1,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 1
      },
      "father": {
        "alleles": "a:w,b:W,a:m,b:m,a:T,b:T,a:h,b:h,a:A1,b:A1,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 0
      },
      "targetDrakes": [{},{},{}],
      "hiddenAlleles": "t,tk,h,c,a,b,d,bog,rh"
    },
    {
      "template": "EggGame",
      "challengeType": "match-target",
      "showUserDrake": false,
      "mother":{
        "alleles": "a:w,b:W,a:M,b:m,a:fl,a:hl,a:T,b:T,a:h,b:h,a:C,b:C,a:A1,b:A1,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 1
      },
      "father": {
        "alleles": "a:w,b:W,a:m,b:m,a:T,b:T,a:h,b:h,a:A1,b:A1,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 0
      },
      "targetDrakes": [{},{},{}],
      "hiddenAlleles": "t,tk,h,c,a,b,d,bog,rh"
    }
  ],
  [
    {
      "template": "EggSortGame",
      "mother":{
        "alleles": "a:w,b:W,a:M,b:m,a:fl,a:hl,a:T,b:T,a:h,b:h,a:C,b:C,a:A1,b:A1,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 1
      },
      "father": {
        "alleles": "a:w,b:W,a:m,b:m,a:T,b:T,a:h,b:h,a:A1,b:A1,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 0
      },
      "hiddenAlleles": "t,m,h,c,b,fl,hl,a,d,bog,rh",
      "baskets": [
        { "label": "Male Drakes with Wings", "alleles": ["a:W","b:W"], "sex": 0 },
        { "label": "Female Drakes with Wings", "alleles": ["a:W","b:W"], "sex": 1 },
        { "label": "Male Drakes without Wings", "alleles": ["a:w,b:w"], "sex": 0 },
        { "label": "Female Drakes without Wings", "alleles": ["a:w,b:w"], "sex": 1 }
      ],
      "eggCount": 16
    },
    {
      "template": "EggSortGame",
      "mother":{
        "alleles": "a:w,b:W,a:M,b:m,a:fl,a:hl,a:T,b:T,a:h,b:h,a:C,b:C,a:A1,b:A1,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 1
      },
      "father": {
        "alleles": "a:w,b:W,a:m,b:m,a:T,b:T,a:h,b:h,a:A1,b:A1,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 0
      },
      "hiddenAlleles": "t,m,w,h,c,b,a,d,bog,rh",
      "baskets": [
        { "label": "Drakes with Forelimbs and Hindlimbs", "alleles": ["a:Fl,a:Hl","a:Fl,b:Hl","b:Fl,a:Hl","b:Fl,a:Hl"] },
        { "label": "Drakes without Forelimbs or Hindlimbs", "alleles": ["a:fl,b:fl,a:hl,b:hl"] }
      ],
      "eggCount": 16
    }
  ]
];
