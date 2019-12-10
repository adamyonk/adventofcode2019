import fetch from "isomorphic-fetch";
import cookie from "./cookie.js";
import { promisify } from "util";
import { promises as fs } from "fs";

export const fetchAOC = path => {
  return fetch(path, {
    credentials: "include",
    headers: { cookie: `session=${cookie}` }
  });
};

export const getInput = async day => {
  let data;
  const file = `./input/${day}.input`;
  try {
    data = await fs.readFile(file, { encoding: "utf-8" });
  } catch (e) {}
  if (!data) {
    console.log("Fetching input data");
    const response = await fetchAOC(
      `https://adventofcode.com/2019/day/${day}/input`
    );
    data = await response.text();
    await fs.writeFile(file, data);
  }
  return data;
};
