// version 0.1

// use: spellfucker("some text")
// returns: {result:"sum tekst",rating:"82%"}

// regexpMatrix expained:
// ["("+sets.vowels+")f",     ["$1ff","$1ph"],     2,                              1],
//    ^                         ^                  ^                               ^
//    pattern to replace        replacements       length of final replacement *   how much symbols are not touched at the beginning **
// 
// * - let say the pattern is ([eyuioayei])c([yie]) and the replacement is $1ss$2, 
// this means that actually the part ([eyuioayei])c will be replaced to $1ss, while ([yie]) will stay untouched. 
// As 2nd symbol is affected, we should not touch it again, while 3rd symbol can still fall into next pattern.
// This is needed for the algorithm to not touch this part again and do not fall into infinite loop.
// ** - let say the pattern is ([eyuioayei])c([yie]) and the replacement is $1ss$2, 
// this means that the ([eyuioayei]) is needed only for check, but not actual replacement.
// We will say to the algorithm: you may shift the check of the pattern to 1 to the left of the current tick position.
// This will help the algorithm to go though every possible pattern.

var spellfucker = function(string){
	var sets = {
		strongVowels: "uoa",
		softVowels: "eyi",
		vowels: "eyiuoa",
		consonants: "qwrtpsdfghjklzxcvbnm"
	};
	var regexpMatrix = [
		[ // b
			["bb",["b"],2,0],
			//["(["+sets.vowels+"])b(["+sets.vowels+"])",["$1bb$2"],2]
		],
		[ // d
			["dd",["d"],2,0],
			//["(["+sets.vowels+"])d(["+sets.vowels+"])",["$1dd$2"],2]
		],
		[ // f
			["ff",["f","ph"],2,0],
			["ph",["ff","f"],2,0],
			["("+sets.vowels+")f",["$1ff","$1ph"],2,1],
			["f",["ph"],1,0]
		],
		[ // g
			["gh",["g","gg","gue"],2,0],
			["gue",["g","gh"],3,0],
			["gg",["g","gh","gue"],2,0],
			//["(["+sets.vowels+"])g(["+sets.vowels+"])",["$1gg$2"],2],
			["g$",["gh","gue"],1,0]
		],
		[ // h
			["wh",["wu"],2,0],
			["^h(["+sets.vowels.replace(/o/,"")+"])",["kh$1"],1,0],
			["^ho",["who"],1,0]
		],
		[ // j
			["j(["+sets.softVowels+"])",["g$1","dg$1","dj$1"],1,0]
		],
		[ // k
			["k(["+sets.strongVowels+"])",["c$1","dg$1","dj$1"],1,0]
		],
		[ // l
			["ll",["l"],2,0],
			//["(["+sets.vowels+"])l(["+sets.vowels+"])",["$1ll$2"],2]
		],
		[ // m
			["mm",["m"],2,0],
			//["(["+sets.vowels+"])m(["+sets.vowels+"])",["$1mm$2"],2],
			["m$",["mb","mn","lm"],1,0]
		],
		[ // n
			["nn",["n"],2,0],
			["^n",["kn","gn"],1,0],
			["kn",["n","gn"],2,0],
			["gn",["n","kn"],2,0],
			//["(["+sets.vowels+"])n(["+sets.vowels+"])",["$1nn$2"],2]
		],
		[ // ng
			["ng$",["ngue"],2,0],
			["ngue$",["ng"],4,0]
		],
		[ // p
			["pp",["p"],2,0],
			//["(["+sets.vowels+"])p(["+sets.vowels+"])",["$1pp$2"],2]
		],
		[ // r
			["rr",["r"],2,0],
			//["(["+sets.vowels+"])r(["+sets.vowels+"])",["$1rr$2"],2],
			["^r",["wr","rh"],1,0]
		],
		[ // s
			["^s(["+sets.softVowels+"])",["c$1","sc$1"],1,0],
			["(["+sets.consonants+"])s(["+sets.softVowels+"])",["$1c$2","$1sc$2","$1ps$2"],2,1],
			//["([^^])s(["+sets.strongVowels+"])",["$1ss$2"],2],
			//["(["+sets.vowels+"])s$",["$1ss"],2],
			["s$",["ce","se","z"],1,0],
			["(["+sets.softVowels+"])ss(["+sets.softVowels+"])",["$1sc$2"],3,1],
			["ss$",["s"],2,0],
			["c(["+sets.softVowels+"])",["ss$1"],1,0],
			["(["+sets.consonants+"])se$",["$1s","$1ce"],3,1],
			["ce$",["s","se"],2,0],
			["(["+sets.softVowels+"])st(["+sets.softVowels+"])",["$1ss$2","$1sc$2"],3,1]
		],
		[ // t
			["tt",["t"],1,0],
			["^t([^h])",["th$1"],1,0],
			["t$",["d","ed"],1,0],
			["(["+sets.vowels+"])t(["+sets.vowels+"])",["$1t$2"],2,1]
		],
		[ // v
			["v$",["f"],1,0]
		],
		[ // w
			["^w",["wh"],1,0],
			["qu",["qw"],2,0]
		],
		[ // y
			["y(["+sets.vowels+"])",["j$1"],1,0],
			["(["+sets.consonants+"])y",["$1i"],2,1]
		],
		[ // z
			["zz",["z"],2,0],
			["^x",["z"],1,0],
			["z$",["ze"],1,0],
			["(["+sets.softVowels+"])s(["+sets.softVowels+"])",["$1s$2"],2,1]
		],
		[ // zh
			["(.)sure",["$1zhure","$1zure"],5,1],
			["sion",["zhn","zhion"],4,0],
			["(.)zure",["$1zhure","$1sure"],5,1]
		],
		[ // ch - BUG
			["ch",["tch"],2,0],
			["tch",["ch"],3,0],
			["(.)ture",["$1tchure","$1tshure","$1chur"],5,1],
			["(.)tion",["$1tchion","$1tshion","$1chn"],5,1]
		],
		[ // sh
			["(.)tion",["$1shion","$1shen","$1shn"],5,1]
		],
		[ // th (unvoiced)
		],
		[ // th (voiced)
		],
		[ // a 
			["(["+sets.consonants+"])a(["+sets.consonants+"])(["+sets.consonants+"])",["$1e$2$3"],2,1],
			["^a(["+sets.consonants+"])(["+sets.consonants+"])",["e$1$2"],1,0]
		],
		[ // e
			//["^e(["+sets.consonants+"])",["ea"],1]
		],
		[ // i
			["^i(["+sets.consonants+"])",["ee$1"],["ea$1"],1,0],
			["(["+sets.consonants+"])i(["+sets.consonants+"])(["+sets.consonants+"])",["$1y$2$3"],2,1]
		],
		[ // o
			["^o(["+sets.consonants+"])",["ho$1"],1,0],
			["(["+sets.consonants+"])wa(["+sets.consonants+"])",["$1wo$2"],3,1],
			["(["+sets.consonants+"])wo(["+sets.consonants+"])",["$1wa$2"],3,1],
			["ow",["aw"],2,0],
			["aw",["ow"],2,0]
		],
		[ // u
		],
		[ // ā
			["(["+sets.consonants+"])ai(["+sets.consonants+"])",["$1ei$2"],3,1],
			["(["+sets.consonants+"])ei(["+sets.consonants+"])",["$1ai$2"],3,1],
			["a(["+sets.consonants+"])e",["ei$1e","ey$1e","ae$1e"],3,0],
			["ei(["+sets.consonants+"])e",["a$1e","ey$1e","ae$1e"],4,0],
			["ey(["+sets.consonants+"])e",["a$1e","ei$1e","ae$1e"],4,0],
			["ea(["+sets.consonants+"])e",["a$1e","ei$1e","ey$1e"],4,0],
			["ei$",["ay","ey","ai"],2,0],
			["ay$",["ey","ei","ai"],2,0],
			["ey$",["ei","ay","ai"],2,0],
			["ai$",["ei","ay","ey"],2,0]
		],
		[ // ē
			["ee",["y","ie"],2,0],
			["ie",["y","ee"],2,0]
		],
		[ // ī
			["(["+sets.consonants+"])i(["+sets.consonants+"])(["+sets.vowels+"])",["$1y$2$3"],2,1]
		],
		[ // ō
			["(["+sets.consonants+"])o(["+sets.consonants+"])(["+sets.vowels+"])",["$1ou$2$3","$1ow$2$3","$1oa$2$3"],2,1],
			["ow",["ou","oa"],2,0],
			["o$",["oe"],1,0],
			["oa",["ou","ow"],2,0]
		],
		[ // ü | oo
			["ew$",["oe"],2,0],
			["oo",["ou"],2,0],
			//["ou",["oo"],2]
		],
		[ // /yü/ 
			//["u(["+sets.consonants+"])",["joo$1","yoo$1"],1],
			["iew$",["ju","ew"],3,0],
			["ew$",["ju","iew"],2,0],
			["you",["ew","jew"],3,0]
		],
		[ // oi
			["oi",["oy","uoy"],2,0],
			["oy",["oi","uoy"],2,0],
			["ouy",["oi","oy"],3,0]
		],
		[ // io
			["io",["yo","eeo"],2,0]
		],
		[ // ә
			["ar$",["our","or","er"],2,0],
			["or$",["our","ar","er"],2,0],
			["our$",["er","or","ar"],3,0],
			["er$",["our","or","ar"],2,0]
		],
		[ // ã
			["air",["are","ear","ere","eir"],3,0],
			["are",["air","ear","ere","eir"],3,0],
			["ear",["are","air","ere","eir"],3,0],
			["ere",["are","ear","air","eir"],3,0],
			["eir",["are","ear","ere","air"],3,0]
		],
		[ // ä
			["ar$",["ah"],2,0], // for British only? :)
		],
		[ // û
			["(["+sets.consonants+"])ir(["+sets.consonants+"])$",["ur","er"],3,1],
			["(["+sets.consonants+"])er(["+sets.consonants+"])$",["ur","ir"],3,1],
			["(["+sets.consonants+"])ur(["+sets.consonants+"])$",["ir","er"],3,1],
		],
		[ // ô
		],
		[ // ēә - we already have it?
		],
		[ // üә
			["ure$",["iour$"],3,0] // ??? is it good?
		],
		[ // c/k
			["c(["+sets.strongVowels+"])",["k$1","ck$1"],1,0] // ??? is it good?
		],
		[ // x
			["(["+sets.vowels+"])x(["+sets.vowels+"])",["$1kz$2","$1gz$2"],2,1] // ??? is it good?
		],
		[ // q/u
			["qu",["koo","ku","cu"],2,0]
		],
		[ // u
			["(["+sets.consonants+"])ome",["$1um"],4,1]
		],
		[ // u
			["(["+sets.consonants+"])ove",["$1uv"],4,1]
		]
	];
	var obfuscate = function(string){
		var lines = string.split(/\n/);
		var wordsAmount = 0;
		var wordsObfuscatedAmount = 0;
		var obfuscatedLines = [];
		lines.forEach(function(line){
			var words = line.split(/\s+/);
			wordsAmount+=words.length;
			
			var obfuscatedWords = words.map(function(word){
				//console.log("Analysing word \"" + word + "\"");
				var notEarlierThanPosition = -1;
				var nothingMoreToObfuscate = false;
				var atLeastSomethingObfuscated = false;
				var test = 0;
				while(!nothingMoreToObfuscate && test<100){
					test++;
					if(test===99){
						console.error("Stack overflow in the word above!")
					}
					var somethingToReplaceFound = false;
					var bestRegexp;
					var bestPosition = null;
					var isReplaced = false;
					// maybe shuffle the matrix every time?
					for(var i = 0; i < regexpMatrix.length; i++){
						var regexpSet = regexpMatrix[i];
						for(var j = 0; j < regexpSet.length; j++){
							var regexp = regexpSet[j];
							var searchRegexp = new RegExp(regexp[0],"i");
							var searchedPosition = word.search(searchRegexp);
							if(
								searchedPosition!==-1 // the match actually happened
							){
								//console.log("CHECK: Word \""+word+"\" contains " + searchRegexp + " at the position of " + searchedPosition + " (actual position "+(searchedPosition+regexp[3])+")");
								if(
									searchedPosition>notEarlierThanPosition - regexp[3] // the position is later than the part that we have already processed
									&& 
									(bestPosition === null || searchedPosition < bestPosition) // this is the first position found or the better position found
								){
									bestPosition = searchedPosition;
									bestRegexp = regexp;
								}
								
							}
							/**/
						}
						
					}
					if(bestPosition!==null){
						somethingToReplaceFound = true;
						var replaceWhat = new RegExp(bestRegexp[0],"i");
						var replacement = bestRegexp[1][Math.round(Math.random()*(bestRegexp[1].length-1))];
						var partToChangeLength = bestRegexp[2];
						//console.log("Word \""+word+"\" contains " + replaceWhat + " at the position of " + bestPosition + " (actual position "+(bestPosition+bestRegexp[3])+") and will be replaced with \""+replacement+"\"");
						var lengthBefore = word.length;
						var word = word.replace(replaceWhat,replacement);
						var lengthAfter = word.length;
						notEarlierThanPosition = bestPosition + (lengthAfter - lengthBefore) + (bestRegexp[2] - 1);
						isReplaced = true;
						atLeastSomethingObfuscated = true;
						//console.log(bestPosition + " : " + (lengthAfter - lengthBefore) + " : " + (bestRegexp[2] - 1) )
						//console.log("Position tick is now at " + notEarlierThanPosition)
					}
					if(!somethingToReplaceFound){
						nothingMoreToObfuscate = true;
						break;
					}
				}
				if(atLeastSomethingObfuscated){
					wordsObfuscatedAmount++;
				}
				return word;
			});
			obfuscatedLines.push(obfuscatedWords.join(" "))
		})
		var obfuscationRate = (Math.round((wordsObfuscatedAmount/wordsAmount)*100))+"%";
		return {
			result: obfuscatedLines.join("\n"),
			rating: obfuscationRate
		};
	}
	return obfuscate(string);
}