export const getTransformValue = (
  transform: string
): { x: number; y: number } => {
  const regex = /-?[0-9]*px/g;
  const match = transform.match(regex);
  if (match && match.length === 2) {
    const y = Number(match[0].split("px")[0]);
    const x = Number(match[1].split("px")[0]);

    return { y, x };
  }
  return { x: 0, y: 0 };
};

export const reorder = (
  list: any[],
  startIndex: number,
  endIndex: number
): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
