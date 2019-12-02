#!/usr/bin/env node --no-warnings
import { getInput } from "./fetchAOC.js";

const solution = 19690720;
// what is 100 * noun + verb?

const run = (code, noun, verb) => {
  code[1] = noun;
  code[2] = verb;

  for (let pos = 0; code[pos] != 99 && pos < code.length; pos += 4) {
    const [opcode, a, b, loc] = code.slice(pos, pos + 4);
    let result;
    if (opcode === 1) {
      result = code[a] + code[b];
    } else if (opcode === 2) {
      result = code[a] * code[b];
    }
    code[loc] = result;
  }

  return [code, noun, verb];
};

(async () => {
  try {
    const input = (await getInput(2))
      .trim()
      .split(",")
      .map(i => parseInt(i));

    const [result] = run([...input], 12, 2);
    console.log("part 1:", result[0]);

    const options = Array.from({ length: 100 });
    const results = [];
    options.forEach((_, n) => {
      options.forEach((_, v) => {
        results.push(run([...input], n, v));
      });
    });

    const [_, noun, verb] = results.filter(
      ([result]) => result[0] === solution
    )[0];
    console.log("part 2:", 100 * noun + verb);
  } catch (e) {
    console.log(e);
  }
})();
