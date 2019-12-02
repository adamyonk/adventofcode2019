import fetch from "isomorphic-fetch";
import cookie from "./cookie.js";

export const fetchAOC = path => {
  return fetch(path, {
    credentials: "include",
    headers: { cookie: `session=${cookie}` }
  });
};

export const getInput = async day => {
  const response = await fetchAOC(`https://adventofcode.com/2019/day/${day}/input`);
  return await response.text();
};
