/**
 * Returns a promise that resolves after `time` seconds
 */
export const delay = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
