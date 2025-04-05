
import { Ingredient, BlacklistedIngredients } from "@/data/blacklistedIngredients";

export interface FoundIngredient {
  ingredient: Ingredient;
  category: string;
}


// Process detected text and find blacklisted ingredients
export const findBlacklistedIngredients = (
  detectedText: string,
  blacklist: BlacklistedIngredients
): FoundIngredient[] => {
  const foundIngredients: FoundIngredient[] = [];
  const text = detectedText.toLowerCase();

  blacklist.categories.forEach(category => {
    category.ingredients.forEach(ingredient => {
      // Check for matches with E-number or ingredient name
      if (
        text.includes(ingredient.ingredient_id.toLowerCase()) ||
        text.includes(ingredient.ingredient_name.toLowerCase())
      ) {
        foundIngredients.push({
          ingredient,
          category: category.name
        });
      }
    });
  });

  return foundIngredients;
};

// Highlight detected ingredients in the original text
export const highlightIngredients = (
  detectedText: string,
  foundIngredients: FoundIngredient[]
): string => {
  let highlightedText = detectedText;
  
  foundIngredients.forEach(({ ingredient }) => {
    // Create regex that's case insensitive
    const idRegex = new RegExp(ingredient.ingredient_id, 'gi');
    const nameRegex = new RegExp(ingredient.ingredient_name, 'gi');
    
    // Add highlight spans
    highlightedText = highlightedText
      .replace(idRegex, `<span class="highlight-found">${ingredient.ingredient_id}</span>`)
      .replace(nameRegex, `<span class="highlight-found">${ingredient.ingredient_name}</span>`);
  });
  
  return highlightedText;
};

// Parse text from the OCR result
export const parseOCRText = (text: string): string => {
  // Remove excessive whitespace and normalize line breaks
  return text.replace(/\s+/g, ' ').trim();
};
