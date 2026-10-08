/** Synthetic ECG-like beat (P, QRS, T) for decorative animation only. phase in [0,1). */
export function ecgSample(phase: number) {
  const g = (c: number, w: number, a: number) => a * Math.exp(-(((phase - c) / w) ** 2));
  return (
    g(0.16, 0.035, 0.12) + // P
    g(0.285, 0.009, -0.14) + // Q
    g(0.3, 0.011, 1) + // R
    g(0.318, 0.011, -0.28) + // S
    g(0.54, 0.055, 0.28) // T
  );
}

export const mod1 = (x: number) => ((x % 1) + 1) % 1;
