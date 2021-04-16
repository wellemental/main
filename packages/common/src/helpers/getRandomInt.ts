// Get random number and rounds down to closest integer
// Does not include the max number
export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const getTwoRandomInt = (max: number): number[] => {
  const firstNumber = getRandomInt(max);
  let secondNumber = firstNumber;

  // run this loop until secondNumber is different than firstNumber
  do {
    secondNumber = getRandomInt(max);
  } while (firstNumber === secondNumber);

  return [firstNumber, secondNumber];
};
