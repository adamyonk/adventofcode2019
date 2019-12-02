#!/usr/bin/env node --no-warnings
import { getInput } from "./fetchAOC.js";

(async () => {
  try {
    const masses = (await getInput(1))
      .trim()
      .split("\n")
      .map(m => parseFloat(m));

    const sum = array => array.reduce((a, v) => (a += v), 0);

    const fuelForMass = m => Math.floor(m / 3) - 2;

    const fuelForMassAndFuel = m => {
      const fuel = [];
      for (let f = fuelForMass(m); f > 0; f = fuelForMass(f)) {
        fuel.push(f);
      }
      return sum(fuel);
    };

    console.log("part 1:", sum(masses.map(fuelForMass)));
    console.log("part 2:", sum(masses.map(fuelForMassAndFuel)));
  } catch (e) {
    console.log(e);
  }
})();
