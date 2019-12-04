#!/usr/bin/env node --no-warnings
import { getInput } from "./fetchAOC.js";

const valid = (pass, part2) => {
  const string = pass.toString();
  const chars = string.split("").map(c => parseInt(c));
  if (
    !chars.every((e, i, a) => e <= (a[i + 1] === undefined ? 10 : a[i + 1]))
  ) {
    return false;
  }
  if (!part2) {
    if (!/(.)\1/.test(string)) {
      return false;
    }
  }
  if (part2) {
    const occurances = Object.values(string.split("").reduce((a, v) => {
      a[v] = (a[v] || 0) + 1;
      return a;
    }, {}));
    const valid = occurances.some(i => i === 2);
    if (!valid) {
      return false;
    }
  }
  return true;
};

(async () => {
  try {
    const input = (await getInput(4))
      .trim()
      .split("-")
      .map(i => parseInt(i));
    let [min, max] = input;

    const possibilities1 = [];
    const possibilities2 = [];
    for (let p = min; p <= max; p++) {
      if (valid(p)) {
        possibilities1.push(p);
      }
      if (valid(p, true)) {
        possibilities2.push(p);
      }
    }

    console.log("part 1:", possibilities1.length);
    console.log("part 2:", possibilities2.length);
  } catch (e) {
    console.log(e);
  }
})();
