
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
        { ingredient_id: "E122", ingredient_name: "Carmoisine" },
        { ingredient_id: "E124", ingredient_name: "Ponceau 4R (red)" },
        { ingredient_id: "E129", ingredient_name: "Allura Red" }
      ]
    },
    {
      name: "Preservatives",
      ingredients: [
        { ingredient_id: "E211", ingredient_name: "Sodium Benzoate" },
        { ingredient_id: "E210", ingredient_name: "Benzoic Acid" },
        { ingredient_id: "E213", ingredient_name: "Calcium Benzoate" },
        { ingredient_id: "E214", ingredient_name: "Parabens" },
        { ingredient_id: "E215", ingredient_name: "Parabens" },
        { ingredient_id: "E216", ingredient_name: "Parabens" },
        { ingredient_id: "E217", ingredient_name: "Parabens" },
        { ingredient_id: "E218", ingredient_name: "Parabens" },
        { ingredient_id: "E219", ingredient_name: "Parabens" }
      ]
    },
    {
      name: "Artificial Sweeteners",
      ingredients: [
        { ingredient_id: "E951", ingredient_name: "Aspartame" },
        { ingredient_id: "E950", ingredient_name: "Acesulfame K" },
        { ingredient_id: "E954", ingredient_name: "Saccharin" },
        { ingredient_id: "E955", ingredient_name: "Sucralose" }
      ]
    },
    {
      name: "Flavour Enhancers (possible sensitivity triggers)",
      ingredients: [
        { ingredient_id: "E621", ingredient_name: "Monosodium Glutamate (MSG)" },
        { ingredient_id: "E627", ingredient_name: "Disodium Guanylate" },
        { ingredient_id: "E631", ingredient_name: "Disodium Inosinate" }
      ]
    }
  ]
};

export default defaultBlacklist;
