import fs from 'fs';

let cachedFlagEntries = null;
let recentFlagCodes = [];

function loadFlagEntries() {
    if (!cachedFlagEntries) {
        const fileContents = fs.readFileSync('./data/flag_data.json', 'utf8');
        const parsed = JSON.parse(fileContents);
        cachedFlagEntries = Object.entries(parsed);
    }
    return cachedFlagEntries;
}

function pickRandomEntry(entries, excludedCodes) {
    const excludeSet = new Set(excludedCodes);
    const eligible = entries.filter(([code]) => !excludeSet.has(code));
    const pool = eligible.length > 0 ? eligible : entries;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const [code, name] = pool[randomIndex];
    return { code, name };
}

function shuffleArray(items) {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function generateFlagQuestion(optionCount = 4) {
    if (optionCount < 1) {
        throw new Error('optionCount must be at least 1');
    }

    const entries = loadFlagEntries();

    if (!entries.length) {
        throw new Error('No flag data available');
    }

    const maxOptions = Math.min(optionCount, entries.length);
    const primaryFlag = pickRandomEntry(entries, recentFlagCodes);

    recentFlagCodes.push(primaryFlag.code);
    if (recentFlagCodes.length > 7) {
        recentFlagCodes.shift();
    }

    const usedCodes = new Set([primaryFlag.code]);
    const optionNames = new Set([primaryFlag.name]);

    while (optionNames.size < maxOptions) {
        const { code, name } = pickRandomEntry(entries, usedCodes);
        usedCodes.add(code);
        optionNames.add(name);
    }

    const options = shuffleArray(Array.from(optionNames));

    return {
        code: primaryFlag.code,
        name: primaryFlag.name,
        options
    };
}
