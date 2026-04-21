export const TOPIC_COLORS: Record<string, string> = {
  // Linear Algebra
  "eigenvalues": "#E8A020", // Amber
  "decomposition": "#5B8DD9", // Blue
  "structure": "#E05A7A", // Rose
  "connection": "#7F77DD", // Violet
  
  // Machine Learning
  "PART 1: FUNDAMENTALS": "#5DCAA5", // Teal
  "PART 2: OPTIMIZATION": "#E8A020", // Amber
  "PART 3: BENDING SPACE": "#9B7FDD", // Purple
  "PART 4: BACKPROPAGATION": "#E05A7A", // Rose
  "PART 5: VANISHING GRADIENTS": "#5B8DD9", // Blue
  "PART 6: DEEP ARCHITECTURES": "#14b8a6", // Green
  "PART 7: SIGNAL PROCESSING": "#f59e0b", // Orange
  "PREFACE": "#a1a1aa", // Zinc
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
