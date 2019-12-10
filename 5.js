#!/usr/bin/env node --no-warnings
import { getInput } from "./fetchAOC.js";
import { run } from "./intCode.js";

(async () => {
  try {
    const input = (await getInput(5))
      .trim()
      .split(",")
      .map(i => parseInt(i));

    console.log(
      "part 1:",
      run({ code: [...input], input: [1] }).output,
      "15314507"
    );
    console.log(
      "part 2:",
      run({ code: [...input], input: [5] }).output,
      "652726"
    );
  } catch (e) {
    console.log(e);
  }
})();
