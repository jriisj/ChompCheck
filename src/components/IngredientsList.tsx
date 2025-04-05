
import React from "react";
import { Pencil, Trash, PlusCircle } from "lucide-react";
import { BlacklistedCategory, Ingredient } from "@/data/blacklistedIngredients";

interface IngredientsListProps {
  categories: BlacklistedCategory[];
  onEditIngredient: (categoryIndex: number, ingredientIndex: number) => void;
  onDeleteIngredient: (categoryIndex: number, ingredientIndex: number) => void;
  onAddIngredient: (categoryIndex: number) => void;
  onEditCategory: (categoryIndex: number) => void;
  onDeleteCategory: (categoryIndex: number) => void;
  onAddCategory: () => void;
}

export const IngredientsList: React.FC<IngredientsListProps> = ({
  categories,
  onEditIngredient,
  onDeleteIngredient,
  onAddIngredient,
  onEditCategory,
  onDeleteCategory,
  onAddCategory,
}) => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Blacklisted Ingredients</h2>
        <button 
          className="button-primary flex items-center gap-2"
          onClick={onAddCategory}
        >
          <PlusCircle size={18} />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-neuro-gray">
          No categories added yet. Add a category to get started.
        </div>
      ) : (
        categories.map((category, categoryIndex) => (
          <div 
            key={categoryIndex} 
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="bg-neuro-dark text-white p-3 flex items-center justify-between">
              <h3 className="font-medium">{category.name}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditCategory(categoryIndex)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDeleteCategory(categoryIndex)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-3">
              {category.ingredients.length === 0 ? (
                <div className="text-center py-4 text-neuro-gray">
                  No ingredients added to this category.
                </div>
              ) : (
                <ul className="divide-y">
                  {category.ingredients.map((ingredient, ingredientIndex) => (
                    <li 
                      key={ingredientIndex}
                      className="py-3 px-2 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-medium text-neuro-red">
                          {ingredient.ingredient_id}
                        </span>
                        <span className="mx-2">-</span>
                        <span>{ingredient.ingredient_name}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEditIngredient(categoryIndex, ingredientIndex)}
                          className="p-1 hover:bg-neuro-softBlue rounded"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteIngredient(categoryIndex, ingredientIndex)}
                          className="p-1 hover:bg-neuro-softPink rounded"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              
              <div className="mt-3">
                <button
                  onClick={() => onAddIngredient(categoryIndex)}
                  className="button-secondary w-full flex items-center justify-center gap-2"
                >
                  <PlusCircle size={16} />
                  Add Ingredient
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
