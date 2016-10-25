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
    /*
     *  Case 3: Trial 1 - Egg Game III (wings)
     */
    {
      "template": "EggSortGame",
      "trialGenerator": {
        "type": "randomize-order",
        "baseDrake": "a:T,b:T,a:h,b:h,a:A1,b:A1,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "drakes": [
          { alleles: "a:W,b:W", sex: 0 },
          { alleles: "a:W,b:w", sex: 0 },
          { alleles: "a:w,b:W", sex: 0 },
          { alleles: "a:w,b:w", sex: 0 },
          { alleles: "a:W,b:W", sex: 1 },
          { alleles: "a:W,b:w", sex: 1 },
          { alleles: "a:w,b:W", sex: 1 },
          { alleles: "a:w,b:w", sex: 1 }
        ],
      },
      "hiddenAlleles": "t,m,h,c,b,fl,hl,a,d,bog,rh",
      "baskets": [
        { "label": "Males with wings", "alleles": ["a:W","b:W"], "sex": 0 },
        { "label": "Males without wings", "alleles": ["a:w,b:w"], "sex": 0 },
        { "label": "Females with wings", "alleles": ["a:W","b:W"], "sex": 1 },
        { "label": "Females without wings", "alleles": ["a:w,b:w"], "sex": 1 }
      ]
    },
    /*
     *  Case 3: Trial 2 - Egg Game III (forelimbs/hindlimbs)
     */
    {
      "template": "EggSortGame",
      "trialGenerator": {
        "type": "randomize-order",
        "baseDrake": "a:T,b:T,a:h,b:h,a:A1,b:A1,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "drakes": [
          { alleles: "a:Fl,b:fl,a:Hl,b:hl" },
          { alleles: "a:fl,b:fl,a:Hl,b:hl" },
          { alleles: "a:Fl,b:fl,a:hl,b:hl" },
          { alleles: "a:fl,b:Fl,a:Hl,b:Hl" },
          { alleles: "a:fl,b:fl,a:Hl,b:Hl" },
          { alleles: "a:fl,b:Fl,a:hl,b:hl" },
          { alleles: "a:Fl,b:Fl,a:hl,b:hl" },
          { alleles: "a:Fl,b:Fl,a:Hl,b:Hl" }
        ],
      },
      "hiddenAlleles": "t,m,w,h,c,b,a,d,bog,rh",
      "baskets": [
        { "label": "Drakes with only forelimbs", "alleles": ["a:Fl,a:hl,b:hl", "b:Fl,a:hl,b:hl"] },
        { "label": "Drakes with only hindlimbs", "alleles": ["a:fl,b:fl,a:Hl", "a:fl,b:fl,b:Hl"] },
        { "label": "Drakes with forelimbs and hindlimbs", "alleles": ["a:Fl,a:Hl","a:Fl,b:Hl","b:Fl,a:Hl","b:Fl,b:Hl"] }
      ]
    }
  ],
  [
    /*
     *  Case 4: Trial 1 - Egg Game III (horns)
     */
    {
      "template": "EggSortGame",
      "trialGenerator": {
        "type": "randomize-order",
        "baseDrake": "a:T,b:T,a:A1,b:A1,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "drakes": [
          { alleles: "a:H,b:H", sex: 0 },
          { alleles: "a:H,b:h", sex: 0 },
          { alleles: "a:h,b:H", sex: 0 },
          { alleles: "a:h,b:h", sex: 0 },
          { alleles: "a:H,b:H", sex: 1 },
          { alleles: "a:H,b:h", sex: 1 },
          { alleles: "a:h,b:H", sex: 1 },
          { alleles: "a:h,b:h", sex: 1 }
        ],
      },
      "hiddenAlleles": "w,t,m,c,b,fl,hl,a,d,bog,rh",
      "baskets": [
        { "label": "Males with horns", "alleles": ["a:h,b:h"], "sex": 0 },
        { "label": "Males without horns", "alleles": ["a:H","b:H"], "sex": 0 },
        { "label": "Females with horns", "alleles": ["a:h,b:h"], "sex": 1 },
        { "label": "Females without horns", "alleles": ["a:H","b:H"], "sex": 1 }
      ]
    },
    /*
     *  Case 4: Trial 2 - Egg Game III (armor)
     */
    {
      "template": "EggSortGame",
      "trialGenerator": {
        "type": "randomize-order",
        "baseDrake": "a:T,b:T,a:h,b:h,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "drakes": [
          { alleles: "a:A1,b:A1", sex: 0 },
          { alleles: "a:A1,b:a", sex: 0 },
          { alleles: "a:a,b:A1", sex: 0 },
          { alleles: "a:a,b:a", sex: 0 },
          { alleles: "a:A1,b:A1", sex: 1 },
          { alleles: "a:A1,b:a", sex: 1 },
          { alleles: "a:a,b:A1", sex: 1 },
          { alleles: "a:a,b:a", sex: 1 }
        ],
      },
      "hiddenAlleles": "t,m,w,h,c,b,fl,hl,d,bog,rh",
      "baskets": [
        { "label": "Drakes with no armor plates", "alleles": ["a:a,b:a"] },
        { "label": "Drakes with three armor plates", "alleles": ["a:A1,b:a", "a:a,b:A1"] },
        { "label": "Drakes with five armor plates", "alleles": ["a:A1,b:A1"] }
      ]
    },
    /*
     *  Case 4: Trial 3 - Egg Game III (horns,wings,armor)
     */
    {
      "template": "EggSortGame",
      "trialGenerator": {
        "type": "randomize-order",
        "baseDrake": "a:T,b:T,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "drakes": [
          { alleles: "a:h,b:h,a:w,b:w,a:a,b:a" },
          { alleles: "a:h,b:h,a:w,b:w,a:a,b:a" },
          { alleles: "a:H,b:h,a:W,b:w,a:a,b:a" },
          { alleles: "a:H,b:H,a:w,b:w,a:A1,b:a" },
          { alleles: "a:H,b:h,a:w,b:w,a:A1,b:A1" },
          { alleles: "a:H,b:H,a:W,b:W,a:a,b:a" },
          { alleles: "a:h,b:H,a:w,b:w,a:A1,b:A1" },
          { alleles: "a:H,b:H,a:w,b:W,a:a,b:a" }
        ],
      },
      "hiddenAlleles": "t,m,c,b,fl,hl,d,bog,rh",
      "baskets": [
        { "label": "Drakes with horns", "alleles": ["a:h,b:h"] },
        { "label": "Drakes with wings", "alleles": ["a:W", "b:W"] },
        { "label": "Drakes with armor", "alleles": ["a:A1","b:A1"] }
      ]
    }
  ]
];
