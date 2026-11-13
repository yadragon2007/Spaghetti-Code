const { pow, sqrt, PI } = Math;

export const orbitPeriod = (R: number, h: number, g: number) => {
  const T = Math.sqrt((4 * pow(PI, 2) * pow(R + h, 3)) / (g * pow(R, 2)));
  return T;
};
