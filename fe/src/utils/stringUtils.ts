import { useResponsive } from "antd-style";

export const truncateMiddle = (str: string, startChars = 5, endChars = 8) => {
  if (str.length <= startChars + endChars) {
    return str;
  }

  const start = str.slice(0, startChars);
  const end = str.slice(-endChars);

  return `${start}...${end}`;
};

// Hook for responsive truncation
export const useTruncate = () => {
  const { mobile } = useResponsive();

  return (str: string) => {
    // Use fewer characters on mobile
    return truncateMiddle(str, mobile ? 3 : 5, mobile ? 6 : 8);
  };
};
