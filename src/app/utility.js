export const sortEvents = (a, b, counts) => {
  const countDiff = counts[b] - counts[a];
  if (countDiff === 0) {
    return a > b ? 1 : -1;
  }
  else {
    return countDiff;
  }  
};