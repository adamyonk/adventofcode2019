#!/usr/bin/env node --no-warnings
import { getInput } from "./fetchAOC.js";
import { promisify } from "util";
import child_process from "child_process";
import { promises as fs } from "fs";
import path from "path";
const exec = promisify(child_process.exec);

const makeCoord = input => {
  const direction = input[0];
  const distance = parseInt(input.substr(1));
  switch (direction) {
    case "U":
      return [0, distance];
    case "D":
      return [0, -distance];
    case "R":
      return [distance, 0];
    case "L":
      return [-distance, 0];
  }
};

const hydrate = input => {
  let x = 0;
  let y = 0;
  let dist = 0;
  return input.map(i => {
    const [xr, yr] = makeCoord(i);
    dist = dist + Math.abs(xr) + Math.abs(yr);
    x = x + xr;
    y = y + yr;
    const manhattan = Math.abs(x) + Math.abs(y);
    return { x, y, xr, yr, dist, manhattan };
  });
};

const makePath = (input, color = "blue") => {
  return `<path d="M0,0 ${input
    .map(({ x, y }) => `L${x},${y}`)
    .join(" ")}" style="stroke-width:5px;stroke:${color};fill:none;"/>`;
};

const annotateCoords = input => {
  return input
    .map(
      ({ x, y }, i) => `<text x="${x + 10}" y="${y + 10}">${x},${y} ${i}</text>`
    )
    .join("");
};

const makeSVG = children => {
  return `<svg width="15000px" height="20000px" viewBox="-10000 -8000 15000 20000">
    ${children}
</svg>`;
};

const distance = input => {
  return input.reduce((a, { x, y }) => a + Math.abs(x) + Math.abs(y), 0);
};

(async () => {
  try {
    const input = (await getInput(3))
      .trim()
      .split("\n")
      .map(wire => wire.split(","));
    const [a, b] = input.map(wire => hydrate(wire));

    const svg = makeSVG(
      makePath(a) + makePath(b, "red") + annotateCoords(a) + annotateCoords(b)
    );

    const intersections = [];
    for (const [ai, { x: ax1, y: ay1, dist: adist }] of a.entries()) {
      const anext = a[ai + 1];
      if (!anext) {
        continue;
      }
      const { x: ax2, y: ay2 } = anext;
      const aIsV = ax1 === ax2;
      for (const [bi, { x: bx1, y: by1, dist: bdist }] of b.entries()) {
        const bnext = b[bi + 1];
        if (!bnext) {
          continue;
        }
        const { x: bx2, y: by2 } = bnext;
        const bIsV = bx1 === bx2;
        if (bIsV === aIsV) {
          continue;
        }

        if (aIsV) {
          // vertical
          const intersectsY =
            (ay1 > by1 && ay2 < by1) || (ay1 < by1 && ay2 > by1);
          const intersectsX =
            (bx1 > ax1 && bx2 < ax1) || (bx1 < ax1 && bx2 > ax1);
          if (intersectsX && intersectsY) {
            intersections.push({
              intersection: [ax1, by1],
              dist: adist + bdist + Math.abs(ay1 - by1) + Math.abs(bx1 - ax1),
              manhattan: Math.abs(ax1) + Math.abs(by1)
            });
          }
        } else {
          // horizontal
          const intersectsX =
            (ax1 > bx1 && ax2 < bx1) || (ax1 < bx1 && ax2 > bx1);
          const intersectsY =
            (by1 > ay1 && by2 < ay1) || (by1 < ay1 && by2 > ay1);
          if (intersectsX && intersectsY) {
            intersections.push({
              intersection: [bx1, ay1],
              dist: adist + bdist + Math.abs(ax1 - bx1) + Math.abs(by1 - ay1),
              manhattan: Math.abs(bx1) + Math.abs(ay1)
            });
          }
        }
      }
    }

    const filename = "./3.html";
    await fs.writeFile(filename, svg, "utf-8");
    // await exec(`open -a Safari file://${path.resolve(filename)}`);

    console.log("part 1:", Math.min(...intersections.map(i => i.manhattan)));
    console.log("part 2:", Math.min(...intersections.map(i => i.dist)));
  } catch (e) {
    console.log(e);
  }
})();
