#!/usr/bin/env node --no-warnings
import { getInput } from "./fetchAOC.js";

(async () => {
  try {
    const input = (await getInput(6)).trim().split("\n");

    const map = input.reduce((a, v) => {
      const [object, satellite] = v
        .split(")")
        .map(id => ({ id, children: [] }));

      const leaf = a[object.id] || object;
      if (!a[satellite.id]) {
        a[satellite.id] = satellite;
      }
      leaf.children.push(satellite);
      a[object.id] = leaf;

      return a;
    }, {});
    const root = map.COM;

    let total = 0;
    const hydrate = (object, depth) => {
      object.depth = depth;
      object.children.forEach(satellite => {
        const ref = map[satellite.id];
        ref.ref = satellite;
        satellite.parent = object;
        satellite.children = ref.children;
      });

      const depths = [
        depth,
        ...object.children.map(c => hydrate(c, depth + 1))
      ];
      total += depth;
      return Math.max(...depths);
    };

    const maxDepth = hydrate(root, 0);

    const selfOrbits = [];
    for (
      let parent = map.YOU.ref.parent;
      parent.parent;
      parent = parent.parent
    ) {
      selfOrbits.push(parent.id);
    }

    const santaOrbits = [];
    for (
      let parent = map.SAN.ref.parent;
      parent.parent;
      parent = parent.parent
    ) {
      santaOrbits.push(parent.id);
    }

    const commonOrbit = selfOrbits.find(o => santaOrbits.includes(o));
    const transfers =
      selfOrbits.indexOf(commonOrbit) + santaOrbits.indexOf(commonOrbit);

    console.log("part 1:", total);
    console.log("part 2:", transfers);
  } catch (e) {
    console.log(e);
  }
})();
