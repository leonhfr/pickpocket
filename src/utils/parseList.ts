export const parseList = (value: string): string[] => {
  if (!value) {
    return [];
  }
  return value.split(',');
};
