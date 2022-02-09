import compressString from "../src/compressString.js";
import decompressString from "../src/decompressString.js";

const tests =
[
    ["", ""],
    ["abcdefg","abcdefg"],
    ["123","123"],
    ["`", "``"],
    ["AbcdAbcd","Abcd` #"],
    ["aaaaa","a`  "],
    ["Abc,Abc,Abc", "Abc,`##"],
    ["ABcdBcdefABcdef","ABcdBcdefA`!%"]
];

function compressStringTest(input, expected) {
    const compressed = compressString(input);
    if (compressed !== expected) {
        console.error(`Compress String '${input}' test failed. Expected '${compressed}' to be equal to '${expected}'.`);
    } else {
        console.log('pass!');
    }
}

function decompressStringTest(expected, input) {
    const decompressed = decompressString(input);
    if (decompressed !== expected) {
        console.error(`Decompress String '${input}' test failed. Expected '${decompressed}' to be equal to '${expected}'.`);
    } else {
        console.log('pass!');
    }

}

tests.forEach(x => compressStringTest(...x));
tests.forEach(x => decompressStringTest(...x));
