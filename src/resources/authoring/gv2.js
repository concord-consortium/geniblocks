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
    },
    {
      "template": "EggGame",
      "initialDrakes":[{
        "alleles": "a:w,a:m,b:m,a:fl,a:hl,a:T,b:T,a:h,b:h,a:C,b:C,a:A1,b:A1,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 1
      },{
        "alleles": "a:T,b:T,a:h,b:h,a:A1,b:A1,a:C,b:C,a:B,b:B,a:D,b:D,a:rh,b:rh,a:Bog,b:Bog",
        "sex": 0
      }],
      "hiddenAlleles": "t,tk,h,c,a,b,d,bog,rh"
    }
  ]
];
