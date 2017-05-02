/*!
 * Spellfucker - Yet another text obfuscator and the biggest enemy of the spellchecker
 * https://github.com/igorpavlov/spellfucker
 * MIT License | (c) Igor Pavlov 2017
 */
 
/*!
 *
 * regexpMatrix expained:
 * ["("+sets.v+")f",     ["$1ff","$1ph"],     2,                              1],
 *    ^                         ^                  ^                               ^
 *    pattern to replace        replacements       length of final replacement *   how much symbols are not touched at the beginning **
 * 
 * * - let say the pattern is ([eyuioayei])c([yie]) and the replacement is $1ss$2, 
 * this means that actually the part ([eyuioayei])c will be replaced to $1ss, while ([yie]) will stay untouched. 
 * As 2nd symbol is affected, we should not touch it again, while 3rd symbol can still fall into next pattern.
 * This is needed for the algorithm to not touch this part again and do not fall into infinite loop.
 * ** - let say the pattern is ([eyuioayei])c([yie]) and the replacement is $1ss$2, 
 * this means that the ([eyuioayei]) is needed only for check, but not actual replacement.
 * We will say to the algorithm: you may shift the check of the pattern to 1 to the left of the current tick position.
 * This will help the algorithm to go though every possible pattern.
 *
 */
 
! function(root, name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(name, definition)
  else root[name] = definition()
}(this, 'spellfucker', function() {
  const sets = {
    hv: "uoa",
    sv: "eyi",
    v: "eyiuoa",
    c: "qwrtpsdfghjklzxcvbnm"
  };
  const regexpMatrix = [
    [ // b
      ["bb", ["b"], 2, 0],
    ],
    [ // d
      ["dd", ["d"], 2, 0],
    ],
    [ // f
      ["ff", ["f", "ph"], 2, 0],
      ["ph", ["ff", "f"], 2, 0],
      ["(" + sets.v + ")f", ["$1ff", "$1ph"], 2, 1],
      ["f", ["ph"], 1, 0],
    ],
    [ // g
      ["gh", ["g", "gg", "gue"], 2, 0],
      ["gue", ["g", "gh"], 3, 0],
      ["gg", ["g", "gh", "gue"], 2, 0],
      ["g$", ["gh", "gue"], 1, 0],
    ],
    [ // h
      ["wh", ["wu"], 2, 0],
      ["^h([" + sets.v.replace(/o/, "") + "])", ["kh$1"], 1, 0],
      ["^ho", ["who"], 1, 0],
    ],
    [ // j
      ["j([" + sets.sv + "])", ["g$1", "dg$1", "dj$1"], 1, 0],
    ],
    [ // k
      ["k([" + sets.hv + "])", ["c$1", "dg$1", "dj$1"], 1, 0],
    ],
    [ // l
      ["ll", ["l"], 2, 0],
    ],
    [ // m
      ["mm", ["m"], 2, 0],
      ["m$", ["mb", "mn", "lm"], 1, 0],
    ],
    [ // n
      ["nn", ["n"], 2, 0],
      ["^n", ["kn", "gn"], 1, 0],
      ["kn", ["n", "gn"], 2, 0],
      ["gn", ["n", "kn"], 2, 0],
    ],
    [ // ng
      ["ng$", ["ngue"], 2, 0],
      ["ngue$", ["ng"], 4, 0],
    ],
    [ // p
      ["pp", ["p"], 2, 0],
    ],
    [ // r
      ["rr", ["r"], 2, 0],
      ["^r", ["wr", "rh"], 1, 0],
    ],
    [ // s
      ["^s([" + sets.sv + "])", ["c$1", "sc$1"], 1, 0],
      ["([" + sets.c + "])s([" + sets.sv + "])", ["$1c$2", "$1sc$2", "$1ps$2"], 2, 1],
      ["s$", ["ce", "se", "z"], 1, 0],
      ["([" + sets.sv + "])ss([" + sets.sv + "])", ["$1sc$2"], 3, 1],
      ["ss$", ["s"], 2, 0],
      ["c([" + sets.sv + "])", ["ss$1"], 1, 0],
      ["([" + sets.c + "])se$", ["$1s", "$1ce"], 3, 1],
      ["ce$", ["s", "se"], 2, 0],
      ["([" + sets.sv + "])st([" + sets.sv + "])", ["$1ss$2", "$1sc$2"], 3, 1],
    ],
    [ // t
      ["tt", ["t"], 1, 0],
      ["^t([^h])", ["th$1"], 1, 0],
      ["t$", ["d", "ed"], 1, 0],
      ["([" + sets.v + "])t([" + sets.v + "])", ["$1t$2"], 2, 1],
    ],
    [ // v
      ["v$", ["f"], 1, 0],
    ],
    [ // w
      ["^w", ["wh"], 1, 0],
      ["qu", ["qw"], 2, 0]
    ],
    [ // y
      ["y([" + sets.v + "])", ["j$1"], 1, 0],
      ["([" + sets.c + "])y", ["$1i"], 2, 1],
    ],
    [ // z
      ["zz", ["z"], 2, 0],
      ["^x", ["z"], 1, 0],
      ["z$", ["ze"], 1, 0],
      ["([" + sets.sv + "])s([" + sets.sv + "])", ["$1s$2"], 2, 1],
    ],
    [ // zh
      ["(.)sure", ["$1zhure", "$1zure"], 5, 1],
      ["sion", ["zhn", "zhion"], 4, 0],
      ["(.)zure", ["$1zhure", "$1sure"], 5, 1],
    ],
    [ // ch - BUG
      ["ch", ["tch"], 2, 0],
      ["tch", ["ch"], 3, 0],
      ["(.)ture", ["$1tchure", "$1tshure", "$1chur"], 5, 1],
      ["(.)tion", ["$1tchion", "$1tshion", "$1chn"], 5, 1],
    ],
    [ // sh
      ["(.)tion", ["$1shion", "$1shen", "$1shn"], 5, 1],
    ],
    [ // th (unvoiced)
    ],
    [ // th (voiced)
    ],
    /*[ // a 
      ["([" + sets.c + "])a([" + sets.c + "])([" + sets.c + "])", ["$1e$2$3"], 2, 1],
      ["^a([" + sets.c + "])([" + sets.c + "])", ["e$1$2"], 1, 0],
    ],*/
    [ // e
    ],
    [ // i
      ["^i([" + sets.c + "])", ["ee$1", "ea$1"], 1, 0],
      ["([" + sets.c + "])i([" + sets.c + "])([" + sets.c + "])", ["$1y$2$3"], 2, 1],
    ],
    [ // o
      ["^o([" + sets.c + "])", ["ho$1"], 1, 0],
      ["([" + sets.c + "])wa([" + sets.c + "])", ["$1wo$2"], 3, 1],
      ["([" + sets.c + "])wo([" + sets.c + "])", ["$1wa$2"], 3, 1],
      ["ow", ["aw"], 2, 0],
      ["aw", ["ow"], 2, 0],
    ],
    [ // u
    ],
    [ // ā
      ["([" + sets.c + "])ai([" + sets.c + "])", ["$1ei$2"], 3, 1],
      ["([" + sets.c + "])ei([" + sets.c + "])", ["$1ai$2"], 3, 1],
      ["a([" + sets.c + "])e", ["ei$1e", "ey$1e", "ae$1e"], 3, 0],
      ["ei([" + sets.c + "])e", ["a$1e", "ey$1e", "ae$1e"], 4, 0],
      ["ey([" + sets.c + "])e", ["a$1e", "ei$1e", "ae$1e"], 4, 0],
      ["ea([" + sets.c + "])e", ["a$1e", "ei$1e", "ey$1e"], 4, 0],
      ["ei$", ["ay", "ey", "ai"], 2, 0],
      ["ay$", ["ey", "ei", "ai"], 2, 0],
      ["ey$", ["ei", "ay", "ai"], 2, 0],
      ["ai$", ["ei", "ay", "ey"], 2, 0]
    ],
    [ // ē
      ["ee", ["y", "ie"], 2, 0],
      ["ie", ["y", "ee"], 2, 0],
    ],
    [ // ī
      ["([" + sets.c + "])i([" + sets.c + "])([" + sets.v + "])", ["$1y$2$3"], 2, 1],
    ],
    [ // ō
      ["([" + sets.c + "])o([" + sets.c + "])([" + sets.v + "])", ["$1ou$2$3", "$1ow$2$3", "$1oa$2$3"], 2, 1],
      ["ow", ["ou", "oa"], 2, 0],
      ["o$", ["oe"], 1, 0],
      ["oa", ["ou", "ow"], 2, 0],
    ],
    [ // ü | oo
      ["ew$", ["oe"], 2, 0],
      ["oo", ["ou"], 2, 0],
    ],
    [ // /yü/ 
      ["iew$", ["ue", "ew", "iu"], 3, 0],
      ["ew$", ["ue", "iew", "iu"], 2, 0],
      ["ue$", ["iew", "ew", "iu"], 2, 0],
      ["iu$", ["iew", "ew", "ue"], 2, 0],
    ],
    [ // oi
      ["oi", ["oy", "uoy"], 2, 0],
      ["oy", ["oi", "uoy"], 2, 0],
      ["ouy", ["oi", "oy"], 3, 0],
    ],
    [ // io
      ["io", ["yo", "eeo"], 2, 0],
    ],
    [ // ә
      ["ar$", ["our", "or", "er"], 2, 0],
      ["or$", ["our", "ar", "er"], 2, 0],
      ["our$", ["er", "or", "ar"], 3, 0],
      ["er$", ["our", "or", "ar"], 2, 0],
    ],
    [ // ã
      ["air", ["are", "ear", "ere", "eir"], 3, 0],
      ["are", ["air", "ear", "ere", "eir"], 3, 0],
      ["ear", ["are", "air", "ere", "eir"], 3, 0],
      ["ere", ["are", "ear", "air", "eir"], 3, 0],
      ["eir", ["are", "ear", "ere", "air"], 3, 0],
    ],
    [ // ä
      ["ar$", ["ah"], 2, 0],
    ],
    [ // û
      ["([" + sets.c + "])ir([" + sets.c + "])$", ["ur", "er"], 3, 1],
      ["([" + sets.c + "])er([" + sets.c + "])$", ["ur", "ir"], 3, 1],
      ["([" + sets.c + "])ur([" + sets.c + "])$", ["ir", "er"], 3, 1],
    ],
    [ // ô
    ],
    [ // ēә - we already have it?
    ],
    [ // üә
      ["ure$", ["iour$"], 3, 0],
    ],
    [ // c/k
      ["c([" + sets.hv + "])", ["k$1", "ck$1"], 1, 0],
    ],
    [ // x
      ["([" + sets.v + "])x([" + sets.v + "])", ["$1kz$2", "$1gz$2"], 2, 1],
    ],
    [ // q/u
      ["qu", ["koo", "ku", "cu"], 2, 0],
    ],
    [ // u
      ["([" + sets.c + "])ome", ["$1um"], 4, 1],
    ],
    [ // u
      ["([" + sets.c + "])ove", ["$1uv"], 4, 1],
    ],
    [ // "you"
      ["you", ["ew", "eu", "yew","yu"], 3, 0],
    ]
  ];
  
  const shuffle_array = function(array) {
    var tmp, current, top = array.length;
    if(top) while(--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
    return array;
  }
  
  const obfuscate = function(string) {
    const lines = string.split(/\n/);
    const obfuscatedLines = [];
    for(var l = 0; l< lines.length; l++) {
      const line = lines[l];
      const words = line.split(/\s+/);

      const obfuscatedWords = words.map(function(word) {
        var notEarlierThanPosition = -1;
        var nothingMoreToObfuscate = false;
        var atLeastSomethingObfuscated = false;
        while (!nothingMoreToObfuscate) {
          var somethingToReplaceFound = false;
          var bestRegexp;
          var bestPosition = null;
          var isReplaced = false;
          const regexpMatrixShuffled = shuffle_array(regexpMatrix);
          for (var i = 0; i < regexpMatrixShuffled.length; i++) {
            const regexpSet = shuffle_array(regexpMatrix[i]);
            for (var j = 0; j < regexpSet.length; j++) {
              const regexp = regexpSet[j];
              const searchRegexp = new RegExp(regexp[0], "i");
              const searchedPosition = word.search(searchRegexp);
              if (
                searchedPosition !== -1 // the match actually happened
              ) {
                if (
                  searchedPosition > notEarlierThanPosition - regexp[3] // the position is later than the part that we have already processed
                  &&
                  (bestPosition === null || searchedPosition < bestPosition) // this is the first position found or the better position found
                ) {
                  bestPosition = searchedPosition;
                  bestRegexp = regexp;
                }
              }
            }
          }
          if (bestPosition !== null) {
            somethingToReplaceFound = true;
            const replaceWhat = new RegExp(bestRegexp[0], "i");
            const replacement = bestRegexp[1][Math.round(Math.random() * (bestRegexp[1].length - 1))];
            const partToChangeLength = bestRegexp[2];
            const lengthBefore = word.length;
            word = word.replace(replaceWhat, replacement);
            const lengthAfter = word.length;
            notEarlierThanPosition = bestPosition + (lengthAfter - lengthBefore) + (bestRegexp[2] - 1);
            isReplaced = true;
            atLeastSomethingObfuscated = true;
          }
          if (!somethingToReplaceFound) {
            nothingMoreToObfuscate = true;
            break;
          }
        }
        return word;
      });
      obfuscatedLines.push(obfuscatedWords.join(" "))
    };
    return obfuscatedLines.join("\n");
  }
  
  return function(string) {
    return obfuscate(string);
  };
  
});