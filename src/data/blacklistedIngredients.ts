
export interface Ingredient {
  ingredient_id: string;
  ingredient_name: string;
}

export interface BlacklistedCategory {
  name: string;
  ingredients: Ingredient[];
}

export interface BlacklistedIngredients {
  categories: BlacklistedCategory[];
}

const defaultBlacklist: BlacklistedIngredients = {
  categories: [
    {
      name: "Artificial Food Colorings",
      ingredients: [
        { ingredient_id: "E102", ingredient_name: "Tartrazine (yellow)" },
        { ingredient_id: "E104", ingredient_name: "Quinoline Yellow" },
        { ingredient_id: "E110", ingredient_name: "Sunset Yellow" },
      ]
    },
    {
      name: "Artificial Sweeteners",
      ingredients: [
        { ingredient_id: "E950", ingredient_name: "Acesulfame Potassium" },
        { ingredient_id: "E951", ingredient_name: "Aspartame" },
        { ingredient_id: "E955", ingredient_name: "Sucralose" },
      ]
    },
    {
      name: "Preservatives",
      ingredients: [
        { ingredient_id: "E211", ingredient_name: "Sodium Benzoate" },
        { ingredient_id: "E220", ingredient_name: "Sulfur Dioxide" },
      ]
    }
  ]
};

export default defaultBlacklist;
