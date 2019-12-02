#!/usr/bin/env node --no-warnings
import { getInput } from "./fetchAOC.js";

(async () => {
  try {
    const input = (await getInput(1)).trim();

    console.log("part 1:", input);
    // console.log("part 2:", sum(masses.map(fuelForMassAndFuel)));
  } catch (e) {
    console.log(e);
  }
})();
