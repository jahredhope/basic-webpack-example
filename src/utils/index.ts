/**
 * Used to stress the CPU for short periods
 * @param {number} pow - The level to stress the CPU. Values above 10 are not recommended. Default 7.
 * Great for emulating expensive renders to identify optimizations
 */
export const thinkForABit = (pow = 7) => {
  let j = 1;
  for (let i = 10; i < Math.pow(10, pow); i++) {
    j += (i * 2) / 2.5 + (i - 2);
  }
  return j;
};
