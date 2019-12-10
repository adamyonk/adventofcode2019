export const run = ({ code, input = [], pos = 0 }) => {
  const output = [];
  let finished = false;
  let waiting = false;
  let relativeBase = 0;

  const write = (pos, value) => {
    code[pos] = value === undefined ? 0 : value;
  };

  const read = pos => {
    return code[pos] === undefined ? 0 : code[pos];
  };

  const getParamValues = (params, paramModes, command) => {
    return params.map((p, i) => {
      // Cheat: I was really stumped and got help from:
      // https://www.reddit.com/r/adventofcode/comments/e8aw9j/2019_day_9_part_1_how_to_fix_203_error/
      // Totally missed "literal" mode for *write* parameters.
      // From day 5: "Parameters that an instruction writes to will never be in immediate mode."
      let literal = false;
      if (command === 3 && i === 0) {
        literal = true;
      }
      if ([1,2,7,8].includes(command) && i === 2) {
        literal = true;
      }

      switch (paramModes[i]) {
        case 1: // immediate
          return p;
        case 2: // relative
          const v = p + relativeBase
          return literal ? v : read(v);
        case 0: // position, default
        default:
          return literal ? p : read(p);
      }
    });
  };

  const movePointer = number => {
    pos = pos + number;
  };

  while (!waiting && !finished) {
    const getNextParams = number => {
      return code.slice(pos, pos + number);
    };

    let [opcode] = getNextParams(1);
    opcode = code[pos]
      .toString()
      .split("")
      .reverse();
    movePointer(1);
    const command = parseInt(
      [opcode.shift(), opcode.shift()].reverse().join("")
    );
    const [aMode = 0, bMode = 0, cMode = 0] = opcode.map(i => parseInt(i));
    const paramModes = [aMode, bMode, cMode];

    switch (command) {
      // Add <a> to <b> and write to address <c>
      case 1: {
        const [a, b, c] = getNextParams(3);
        const [av, bv, cv] = getParamValues([a, b, c], paramModes, command);
        write(cv, av + bv);
        movePointer(3);
        break;
      }
      // Multiply <a> to <b> and write to address <c>
      case 2: {
        const [a, b, c] = getNextParams(3);
        const [av, bv, cv] = getParamValues([a, b, c], paramModes, command);
        write(cv, av * bv);
        movePointer(3);
        break;
      }
      // Get next item from <input> and write to address <a>
      case 3: {
        const [a] = getNextParams(1);
        const [av] = getParamValues([a], paramModes, command);
        const nextInput = input.shift();
        if (nextInput === undefined) {
          movePointer(-1);
          waiting = true;
          break;
        }
        write(av, nextInput);
        movePointer(1);
        break;
      }
      // Send <a> to <output>
      case 4: {
        const [a] = getNextParams(1);
        const [av] = getParamValues([a], paramModes, command);
        output.push(av);
        movePointer(1);
        break;
      }
      // If <a> is not 0, jump to <b>
      case 5: {
        const [a, b] = getNextParams(2);
        const [av, bv] = getParamValues([a, b], paramModes, command);
        if (av !== 0) {
          pos = bv;
          break;
        }
        movePointer(2);
        break;
      }
      // If <a> is 0, jump to <b>
      case 6: {
        const [a, b] = getNextParams(2);
        const [av, bv] = getParamValues([a, b], paramModes, command);
        if (av === 0) {
          pos = bv;
          break;
        }
        movePointer(2);
        break;
      }
      // If <a> is less than <b>, write 1 at address <c>, else 0
      case 7: {
        const [a, b, c] = getNextParams(3);
        const [av, bv, cv] = getParamValues([a, b, c], paramModes, command);
        write(cv, av < bv ? 1 : 0);
        movePointer(3);
        break;
      }
      // If <a> is equal to <b>, write 1 at address <c>, else 0
      case 8: {
        const [a, b, c] = getNextParams(3);
        const [av, bv, cv] = getParamValues([a, b, c], paramModes, command);
        write(cv, av === bv ? 1 : 0);
        movePointer(3);
        break;
      }
      // Adjust <relativeBase> offset by <a>
      case 9: {
        const [a] = getNextParams(1);
        const [av] = getParamValues([a], paramModes, command);
        relativeBase += av;
        movePointer(1);
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
