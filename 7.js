#!/usr/bin/env node --no-warnings
import { getInput } from "./fetchAOC.js";
import { run } from "./intCode.js";

// From: https://stackoverflow.com/a/39928535
function* permute(a, n = a.length) {
  if (n <= 1) yield a.slice();
  else
    for (let i = 0; i < n; i++) {
      yield* permute(a, n - 1);
      const j = n % 2 ? 0 : i;
      [a[n - 1], a[j]] = [a[j], a[n - 1]];
    }
}

// Part 1
(async () => {
  try {
    const prog = (await getInput(7))
      .trim()
      .split(",")
      .map(i => parseInt(i));
    // const prog = [ 3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0 ];
    // const prog = [ 3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0 ];
    // const prog = [ 3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33, 1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0 ];

    const signals = { bySeq: {}, byOut: {} };
    const permutations = Array.from(permute("01234".split(""))).map(s =>
      s.map(i => parseInt(i))
    );
    for (let seq of permutations) {
      const outputs = [[0]];
      for (const [si, s] of seq.entries()) {
        const result = run({ code: [...prog], input: [s, ...outputs[si]] });
        outputs.push(result.output);
      }
      const lastOut = outputs[outputs.length - 1];
      signals.bySeq[seq] = lastOut;
      signals.byOut[lastOut] = seq;
    }
    const maxOut = Math.max(...Object.values(signals.bySeq));

    console.log("part 1:", maxOut, signals.byOut[maxOut]);
  } catch (e) {
    console.log(e);
  }
})();

// Part 2
(async () => {
  try {
    const prog = (await getInput(7))
      .trim()
      .split(",")
      .map(i => parseInt(i));

    const signals = { bySeq: {}, byOut: {} };
    const permutations = Array.from(permute("56789".split(""))).map(s =>
      s.map(i => parseInt(i))
    );
    for (let seq of permutations) {
      const programs = seq.reduce((a, s) => {
        a[s] = { code: [...prog], input: [s] };
        return a;
      }, {});

      // Hack the loop so the first entrance has input `0`
      programs[seq[seq.length - 1]].output = [0];

      while (Object.values(programs).some(p => !p.finished)) {
        seq.forEach((s, si) => {
          const lastProgram = programs[seq[si === 0 ? seq.length - 1 : si - 1]];
          const { output: input = [] } = lastProgram;
          const program = programs[s];
          program.input = [...(program.input || []), ...input];
          programs[s] = run(program);
        });
      }
      const lastOut = programs[seq[seq.length - 1]].output[0];
      signals.bySeq[seq] = lastOut;
      signals.byOut[lastOut] = seq;
    }
    const maxOut = Math.max(...Object.values(signals.bySeq));

    console.log("part 2:", maxOut, signals.byOut[maxOut]);
  } catch (e) {
    console.log(e);
  }
})();
