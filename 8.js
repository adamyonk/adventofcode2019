#!/usr/bin/env node --no-warnings
import { getInput } from "./fetchAOC.js";
import chalk from "chalk";

(async () => {
  try {
    const input = (await getInput(8))
      .trim()
      .split("")
      .map(i => parseInt(i));

    const extractLayers = (data, x, y) => {
      const layers = [
        // layer 1 [
        //   row 1 [],
        //   row 2 [],
        // ]
      ];

      const extract = () => {
        for (let iy = 0; iy < y; iy++) {
          if (iy === 0) {
            layers.push([]);
          }
          const layer = layers[layers.length - 1];
          for (let ix = 0; ix < x; ix++) {
            if (ix === 0) {
              layer.push([]);
            }
            const row = layer[layer.length - 1];
            row.push(data.shift());
          }
        }
      };

      while (data.length) {
        extract(data);
      }

      return layers;
    };

    const layersWithRows = extractLayers([...input], 25, 6);

    const layers = layersWithRows.map(layer =>
      layer.reduce((a, row) => a.concat(row), [])
    );

    const counts = layers
      .map(layer => {
        return layer.reduce((a, v) => {
          a[v] = (a[v] || 0) + 1;
          return a;
        }, {});
      })
      .sort((a, b) => {
        return a["0"] - b["0"];
      });

    console.log("part 1:", counts[0]["1"] * counts[0]["2"]);

    const computedLayers = layers.reduce((a, layer) => {
      for (let i = 0; i < layer.length; i++) {
        if (a[i] === undefined || a[i] === 2) {
          a[i] = layer[i];
        }
      }
      return a;
    }, []);

    const renderedImage = extractLayers(computedLayers, 25, 6)[0].reduce(
      (a, row) => {
        return (
          a +
          "\n" +
          row
            .map(p =>
              p === 0
                ? chalk.bgBlack(" ")
                : p === 1
                ? chalk.bgWhite(" ")
                : chalk.bgTransparent(" ")
            )
            .join("")
        );
      },
      ""
    );
    console.log("part 2:", renderedImage);
  } catch (e) {
    console.log(e);
  }
})();
