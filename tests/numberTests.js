import { encodeNumber } from "../src/compressString.js";
import { decodeNumber } from "../src/decompressString.js";

const tests = [
    [0, " "],
    [1, "!"],
    [63, "_"],
    [64, "a"],
    [89, "z"],
    [90, "{ "],
    [184, "{~"],
];

function encodeNumberTest(num, txt) {
    const numStr = encodeNumber(num);
    if (numStr !== txt) {
        console.error(`Encode Number Test ${num} '${txt}' failed. Expected '${numStr}' to be equal '${txt}'.`);
    } else {
        console.log("pass!")
    }
}

function decodeNumberTest(num, txt) {
    const res = decodeNumber(txt,0);
    if (res !== num) {
        console.error(`Decode Number Test ${num} '${txt}' failed. Expected '${res}' to be equal '${num}'.`);
    } else {
        console.log("pass!")
    }
}

tests.forEach(x => encodeNumberTest(...x));
tests.forEach(x => decodeNumberTest(...x));

function testAllNumbers() {
    for(let i = 0; i <= 100_000; i++) {
        const numStr = encodeNumber(i);
        const res = decodeNumber(numStr, 0);
        if (i != res) {
            console.error(`Encode-Decode number test ${i} failed. Decode '${numStr}' result ${res} while ${i} was expected.`);
        }
    }
    console.log("Done");
}

testAllNumbers();