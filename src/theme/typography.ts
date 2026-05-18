export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const fontSize = {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 16,
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 13,
  caption: 11,
} as const;

// Absolute pixel line-heights (fontSize × ratio from design spec)
export const lineHeight = {
  h1: 38,   // 32 × 1.2
  h2: 31,   // 24 × 1.3
  h3: 26,   // 20 × 1.3
  h4: 22,   // 16 × 1.4
  bodyLarge: 26,  // 16 × 1.6
  bodyMedium: 22, // 14 × 1.6
  bodySmall: 21,  // 13 × 1.6
  caption: 15,    // 11 × 1.4
} as const;
