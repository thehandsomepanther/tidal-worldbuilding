const randomNumbers = {};

export const seededRand = code => {
  randomNumbers[code] = randomNumbers[code] || Math.random();
  return randomNumbers[code];
};
