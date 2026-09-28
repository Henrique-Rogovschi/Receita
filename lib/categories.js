export const CATEGORIES = [
  { id: "massa", label: "Massa", emoji: "🍝", color: "#D99A1E" },
  { id: "carne", label: "Carne", emoji: "🥩", color: "#B23A3A" },
  { id: "frango", label: "Frango", emoji: "🍗", color: "#D26A28" },
  { id: "peixe", label: "Peixe", emoji: "🐟", color: "#2F7FA3" },
  { id: "vegetariano", label: "Vegetariano", emoji: "🥦", color: "#4E8A3E" },
  { id: "sobremesa", label: "Sobremesa", emoji: "🍰", color: "#C45A8C" },
  { id: "outros", label: "Outros", emoji: "🥣", color: "#76735F" },
];

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
