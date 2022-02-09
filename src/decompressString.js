const refSymbol = "`";
const refSymbolCode = refSymbol.charCodeAt(0);
const minLen = 4;

export function decompressString(txt) {
    let res = "";
    let i = txt.indexOf(refSymbol);
    let st = 0;
    while (i >= 0) {
      res += txt.substring(st, i);
      st = i;
      if (txt.charAt(i + 1) == refSymbol) {
        res += refSymbol;
        st = i + 2;
        i = txt.indexOf(refSymbol, st);
      } else {
        st = i + 1;
        let len = decodeNumber(txt, st) + minLen;
        st += numberLength(txt, st);
        const dist = decodeNumber(txt, st) + 1;
        st += numberLength(txt, st);
        let pos = res.length - dist;
        while (len > 0) {
          const l = Math.min(len, res.length - pos);
          res += res.substring(pos, pos + l);
          pos += l;
          len -= l;
        }
        i = txt.indexOf(refSymbol, st);
      }
    }
    if (st < txt.length) {
      res += txt.substring(st);
    }
    return res;
  }
  
export function decodeRLEData(txt) {
    let st = 0;
    if (txt.charAt(st) == refSymbol) st++;
    const len = decodeNumber(txt, st) + minLen;
    st += numberLength(txt, st);
    const dist = decodeNumber(txt, st) + 1;
    st += numberLength(txt, st);
    return { txt, dist, len, suffix: txt.substring(st) };
  }
  
export function decodeNumber(txt, i) {
    let n = txt.charCodeAt(i);
    if (n > refSymbolCode) n--;
    n -= 32;
    i++;
    if (n < 90) return n;
    const l = n - 89;
    let res = 0;
    for (let j = 0; j < l; j++) {
      n = txt.charCodeAt(i);
      i++;
      res = res * 95 + n - 32;
    }
    return res + 90;
  }
  
export function numberLength(txt, i) {
    let n = txt.charCodeAt(i);
    if (n > refSymbolCode) n--;
    n -= 32;
    i++;
    if (n <= 90) return 1;
    const l = n - 89;
    return l;
  }
  
export default decompressString;