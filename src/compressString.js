const refSymbol = "`";
const refSymbolCode = refSymbol.charCodeAt(0);
const minLen = 4;

export function checkOffsets(txt, i, offsets) {
  let longest = -1;
  let suffix = undefined;
  for (let offsetIndex = 0; offsetIndex < offsets.length; offsetIndex++) {
    let j = offsets[offsetIndex];
    let l = i;
    while (l < txt.length && txt.charAt(j) == txt.charAt(l)) {
      j++;
      l++;
    }
    const len = l - i;
    const dist = i - offsets[offsetIndex] - 1;
    const nsf = refSymbol + encodeNumber(len) + encodeNumber(dist);
    if (nsf.length <= len + minLen) {
      if (len >= longest) {
        longest = len;
        suffix = nsf;
      }
    }
  }
  return [suffix, longest];
}

export function escapeSubstring(txt, start, end) {
  end = Math.min(end, txt.length);
  let res = "";
  for(let i = start; i < end; i++) {
    const ch = txt.charAt(i);
    if (ch == refSymbol) {
      res += refSymbol;
    }
    res += ch;
  }
  return res;
}

export function compressString(txt) {
  if (typeof txt != "string") throw new Error("txt must be a string");
  let res = "";
  const indexes = new Map();
  for (let i = 0; i < txt.length; i++) {
    let prefix = txt.substring(i, i + minLen);
    let offsets = indexes.get(prefix);
    if (offsets) {
      let st = i;
      i += minLen;
      let [suffix, longest] = checkOffsets(txt, i, offsets);
      offsets.push(i);

      for (let t = 1; t < minLen; t++) {
        st++;
        let p = st;
        prefix = txt.substring(p, p + minLen);
        offsets = indexes.get(prefix);
        p += minLen;
        if (offsets) {
          let [suf2, long2] = checkOffsets(txt, p, offsets);
          if (suf2 && long2 > longest) {
            suffix = escapeSubstring(txt, st - t, st) + suf2;
            longest = long2 + t;
          }
        } else {
          offsets = [];
          indexes.set(prefix, offsets);
        }
        offsets.push(p);
      }

      if (suffix) {
        res += suffix;
        i += longest - 1;
        st++;
        for (; st <= i; st++) {
          prefix = txt.substring(st, st + minLen);
          offsets = indexes.get(prefix);
          if (!offsets) {
            offsets = [];
            indexes.set(prefix, offsets);
          }
          offsets.push(st + minLen);
        }
      } else {
        res += escapeSubstring(txt, i-minLen, i);
        i--;
      }
      continue;
    }

    offsets = [];
    indexes.set(prefix, offsets);
    offsets.push(i + minLen);

    const ch = txt.charAt(i);
    if (ch == refSymbol) {
      res += refSymbol + refSymbol;
    } else {
      res += ch;
    }
  }
  return res;
}

export function encodeNumber(num) {
  if (num < 0) {
    throw new Error("num should be greater or equal to 0.");
  }
  if (num < 90) {
    let code = 32 + num;
    if (code >= refSymbolCode) code++;
    return String.fromCharCode(code);
  }
  num -= 90;
  let res = "";
  do {
    let k = num % 95;
    num = ((num - k) / 95) | 0;
    let code = 32 + k;
    res = String.fromCharCode(code) + res;
  } while (num > 0);
  res = String.fromCharCode(122 + res.length) + res;
  return res;
}

export default compressString;
