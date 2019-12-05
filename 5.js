#!/usr/bin/env node --no-warnings
import { getInput } from "./fetchAOC.js";

export const run = (code, input) => {
  let pos = 0;
  const output = [];
  let finished = false;

  while (!finished && pos < code.length) {
    let opcode = code[pos]
      .toString()
      .split("")
      .reverse();
    pos = pos + 1;
    const command = parseInt(
      [opcode.shift(), opcode.shift()].reverse().join("")
    );
    const [aMode = 0, bMode = 0, cMode = 0] = opcode.map(i => parseInt(i));

    switch (command) {
      case 1: // Add <a> to <b> and save to address <c>
      case 2: { // Multiply <a> to <b> and save to address <c>
        const [a, b, c] = code.slice(pos, pos + 3);
        const av = aMode ? a : code[a];
        const bv = bMode ? b : code[b];
        if (command === 1) {
          code[c] = av + bv;
        } else if (command === 2) {
          code[c] = av * bv;
        }
        pos = pos + 3;
        break;
      }
      case 3: // Save <input> to address <a>
      case 4: { // Send <a> to <output>
        const a = code[pos];
        const av = aMode ? a : code[a];
        if (command === 3) {
          code[a] = input;
        } else if (command === 4) {
          output.push(av);
        }
        pos = pos + 1;
        break;
      }
      case 5: // If <a> is not 0, jump to <b>
      case 6: { // If <a> is 0, jump to <b>
        const [a, b] = code.slice(pos, pos + 2);
        const av = aMode ? a : code[a];
        const bv = bMode ? b : code[b];
        if (command === 5) {
          if (av !== 0) {
            pos = bv;
            break;
          }
        } else if (command === 6) {
          if (av === 0) {
            pos = bv;
            break;
          }
        }

        pos = pos + 2;
        break;
      }
      case 7: // If <a> is less than <b>, store 1 at address <c>, else 0
      case 8: { // If <a> is equal to <b>, store 1 at address <c>, else 0
        const [a, b, c] = code.slice(pos, pos + 3);
        const av = aMode ? a : code[a];
        const bv = bMode ? b : code[b];
        if (command === 7) {
          code[c] = av < bv ? 1 : 0;
        } else if (command === 8) {
          code[c] = av === bv ? 1 : 0;
        }
        pos = pos + 3;
        break;
      }
      case 99: {
        finished = true;
        break;
      }
      default:
        throw new Error(`Command ${command} not found.`);
    }
  }
  return { code, output, finished };
};

(async () => {
  try {
    const input = (await getInput(5))
      .trim()
      .split(",")
      .map(i => parseInt(i));

    console.log("part 1:", run([...input], 1).output);
    console.log("part 2:", run([...input], 5).output);
  } catch (e) {
    console.log(e);
  }
})();
