export const TOPIC_COLORS: Record<string, string> = {
  // Linear Algebra
  "eigenvalues": "#E8A020", // Amber
  "decomposition": "#5B8DD9", // Blue
  "structure": "#E05A7A", // Rose
  "connection": "#7F77DD", // Violet

  // Machine Learning
  "PART 1: FUNDAMENTALS": "#5DCAA5",    // Teal
  "PART 2: OPTIMIZATION": "#E8A020",    // Amber
  "PART 2.5: SCALING UP": "#60a5fa",     // Sky blue
  "PART 3: BENDING SPACE": "#9B7FDD",   // Purple
  "PART 3.5: NETWORK ANATOMY": "#c084fc", // Lighter purple
  "PART 4: FIRST NETWORK": "#f97316",   // Orange
  "PART 5: BACKPROPAGATION": "#E05A7A", // Rose
  "PART 6: TRAINING": "#a78bfa",        // Violet
  "PART 7: VANISHING GRADIENTS": "#5B8DD9", // Blue
  "PART 8: DEEP ARCHITECTURES": "#14b8a6",  // Green
  "PART 9: SIGNAL PROCESSING": "#f59e0b",   // Orange-amber
  "PREFACE": "#a1a1aa", // Zinc

  // Probability
  "PART 1: FOUNDATIONS": "#5B8DD9",
  "PART 2: DISTRIBUTIONS": "#5DCAA5",
  "PART 3: EXPECTATION": "#E8A020",
  "PART 4: VARIANCE": "#E05A7A",
  "PART 5: CONDITIONING": "#9B7FDD",
  "PART 6: SAMPLING": "#14b8a6",
  "PART 7: LIMITS": "#60a5fa",
  "PART 8: INFERENCE": "#f97316",
};

export function getThemeAccent(tag: string, defaultColor: string = "#7F77DD"): string {
  // Try to find an exact match first
  if (TOPIC_COLORS[tag]) {
    return TOPIC_COLORS[tag];
  }

  // Otherwise try checking if the string includes the tag in case of edge mismatches
  for (const [key, color] of Object.entries(TOPIC_COLORS)) {
    if (tag.includes(key)) {
      return color;
    }
  }

  return defaultColor;
}
