export const truncateMiddle = (str: string, startChars = 5, endChars = 8) => {
  if (str.length <= startChars + endChars) {
    return str;
  }

  const start = str.slice(0, startChars);
  const end = str.slice(-endChars);

  return `${start}...${end}`;
};
