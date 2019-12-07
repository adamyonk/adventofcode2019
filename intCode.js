export const run = ({ code, input = [], pos = 0 }) => {
  const output = [];
  let finished = false;
  let waiting = false;

  while (!waiting && !finished && pos < code.length) {
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
      case 2: {
        // Multiply <a> to <b> and save to address <c>
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
      case 3: // Save next from <input> to address <a>
      case 4: {
        // Send <a> to <output>
        const a = code[pos];
        const av = aMode ? a : code[a];
        if (command === 3) {
          const nextInput = input.shift();
          if (nextInput === undefined) {
            pos = pos - 1;
            waiting = true;
            break;
          }
          code[a] = nextInput;
        } else if (command === 4) {
          output.push(av);
        }
        pos = pos + 1;
        break;
      }
      case 5: // If <a> is not 0, jump to <b>
      case 6: {
        // If <a> is 0, jump to <b>
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
      case 8: {
        // If <a> is equal to <b>, store 1 at address <c>, else 0
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
        throw new Error(`Command ${command} not found (position ${pos}).`);
    }
  }
  return { code, output, finished, pos, waiting };
};
