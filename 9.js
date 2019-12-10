#!/usr/bin/env node --no-warnings
import { getInput } from "./fetchAOC.js";
import { run } from "./intCode.js";

(async () => {
  try {
    const input = (await getInput(9))
      .trim()
      .split(",")
      .map(i => parseInt(i));
    // const test = [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99];
    // const test = [1102, 34915192, 34915192, 7, 4, 7, 99, 0];
    // const test = [104,1125899906842624,99];

    console.log("part 1:", run({ code: input, input: [1] }).output);
    console.log("part 2:", run({ code: input, input: [2] }).output);
  } catch (e) {
    console.log(e);
  }
})();
