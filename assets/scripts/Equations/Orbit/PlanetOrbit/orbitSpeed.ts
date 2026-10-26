const { pow, sqrt, PI } = Math;

export const orbitSpeed = (R: number, h: number, g: number) => {
  const V = sqrt((g * pow(R, 2)) / (R + h));
  return V;
};
