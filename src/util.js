import md5 from "md5";

const randomNumbers = {};

export const seededRand = code => {
  randomNumbers[code] = randomNumbers[code] || Math.random();
  return randomNumbers[code];
};
