const { loadJson } = require("./helpers");

// Load symbols data
const symbolsData = loadJson("baseReelSymbols");
const symbols = symbolsData.BaseSym;

// Load reel set data
const reelSetData = loadJson("baseGameReelSet");
const reels = reelSetData.baseReels;

// Initialize a dictionary to store symbol counts for each reel
const symbolCountsPerReel = {};

// Initialize counts for each symbol
for (const symbol of symbols) {
    symbolCountsPerReel[symbol] = Array(reels.length).fill(0);
}

// Count symbols for each reel
for (let reelIndex = 0; reelIndex < reels.length; reelIndex++) {
    const reel = reels[reelIndex];
    for (const symbol of reel) {
        symbolCountsPerReel[symbol][reelIndex]++;
    }
}

// Print the symbol counts for each reel
for (const symbol of symbols) {
    console.log(`Symbol ${symbol}: ${symbolCountsPerReel[symbol]}`);
}
