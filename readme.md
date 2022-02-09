# compress-string

Simple LZ77 string compressing/decompressing library that produces strings in result.
Suitable for JSON compression.

## How to use it

To compress a string:
``` JS
import { compressString } from 'compress-string';

const inputString = "Abc,Abc,Abc"
const compressedString = compressString(inputString);

// compressedString == 'Abc,`##';
```

To decompress the string:
``` JS
import { decompressString } from 'compress-string';

const compressedString = 'Abc,`##';
const originalString = decompressString(compressedString);

// originalString == 'Abc,Abc,Abc';
```

## How it works

`compress-string` uses LZ77 based algorithm that finds duplicated substrings, and encodes it with length/distance values prefixed by escape character GRAVE ACCENT (UTF `U+0060`).

### Length and Distance encoding

To minimize size of code next encoding scheme is used for numbers:
* Numbers less then `0` are not used, and can't be encoded.
* Any number `n < 89` encoded with one character in range from `U+0020` (Space bar) to `U+007A` lower case `'z'` excluding escape character.
* Any number `n >= 90` encoded as `n - 90` in base 95 with most significant char at the end. Number of chars is encoded as prefix char with code `0x7A + numberOfChars`.

Because minimal possible size of length/distance code with escape character equals 3 it makes no sense to encode any sequence shorter or equal to 3 characters and so length is encoded as `length - 4`.

Same for `distance` - since it can't be equal to 0, it is encoded as `distance - a`.

So the code from example above:
```
`##
```
Instructs decompressor to go back by 4 characters and copy 7 characters to output.
