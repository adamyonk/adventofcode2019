#!/usr/bin/env node --no-warnings
import { getInput } from "./fetchAOC.js";
import { run } from "./intCode.js";

const solution = 19690720;
// what is 100 * noun + verb?

(async () => {
  try {
    const input = (await getInput(2))
      .trim()
      .split(",")
      .map(i => parseInt(i));

    const code = [...input];
    code[1] = 12;
    code[2] = 2;
    const result = run({ code });
    console.log("part 1:", result.code[0], "8017076");

    const options = Array.from({ length: 100 });
    const results = [];
    options.forEach((_, n) => {
      options.forEach((_, v) => {
        const code = [...input];
        code[1] = n;
        code[2] = v;
        results.push([run({ code }), n, v]);
      });
    });

    const result2 = results.filter(([{ code }]) => code[0] === solution)[0];
    console.log("part 2:", 100 * result2[1] + result2[2], "3146");
  } catch (e) {
    console.log(e);
  }
})();
