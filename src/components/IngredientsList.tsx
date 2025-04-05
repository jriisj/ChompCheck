
import React from "react";
import { Pencil, Trash, PlusCircle } from "lucide-react";
import { BlacklistedCategory } from "@/data/blacklistedIngredients";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

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
        <Button 
          variant="default"
          onClick={onAddCategory}
          className="flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No categories added yet. Add a category to get started.
        </div>
      ) : (
        categories.map((category, categoryIndex) => (
          <CategoryCard 
            key={categoryIndex}
            category={category}
            categoryIndex={categoryIndex}
            onEditIngredient={onEditIngredient}
            onDeleteIngredient={onDeleteIngredient}
            onAddIngredient={onAddIngredient}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
          />
        ))
      )}
    </div>
  );
};

interface CategoryCardProps {
  category: BlacklistedCategory;
  categoryIndex: number;
  onEditIngredient: (categoryIndex: number, ingredientIndex: number) => void;
  onDeleteIngredient: (categoryIndex: number, ingredientIndex: number) => void;
  onAddIngredient: (categoryIndex: number) => void;
  onEditCategory: (categoryIndex: number) => void;
  onDeleteCategory: (categoryIndex: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  categoryIndex,
  onEditIngredient,
  onDeleteIngredient,
  onAddIngredient,
  onEditCategory,
  onDeleteCategory
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{category.name}</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEditCategory(categoryIndex)}
              className="h-8 w-8 hover:bg-white/20"
            >
              <Pencil size={16} />
              <span className="sr-only">Edit category</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteCategory(categoryIndex)}
              className="h-8 w-8 hover:bg-white/20"
            >
              <Trash size={16} />
              <span className="sr-only">Delete category</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3">
        {category.ingredients.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No ingredients added to this category.
          </div>
        ) : (
          <ul className="divide-y">
            {category.ingredients.map((ingredient, ingredientIndex) => (
              <IngredientItem
                key={ingredientIndex}
                ingredient={ingredient}
                categoryIndex={categoryIndex}
                ingredientIndex={ingredientIndex}
                onEditIngredient={onEditIngredient}
                onDeleteIngredient={onDeleteIngredient}
              />
            ))}
          </ul>
        )}
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <Button
          variant="outline"
          onClick={() => onAddIngredient(categoryIndex)}
          className="w-full flex items-center justify-center gap-2"
        >
          <PlusCircle size={16} />
          Add Ingredient
        </Button>
      </CardFooter>
    </Card>
  );
};

interface IngredientItemProps {
  ingredient: {
    ingredient_id: string;
    ingredient_name: string;
  };
  categoryIndex: number;
  ingredientIndex: number;
  onEditIngredient: (categoryIndex: number, ingredientIndex: number) => void;
  onDeleteIngredient: (categoryIndex: number, ingredientIndex: number) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({
  ingredient,
  categoryIndex,
  ingredientIndex,
  onEditIngredient,
  onDeleteIngredient
}) => {
  return (
    <li className="py-3 px-2 flex items-center justify-between">
      <div>
        <span className="font-medium text-destructive">
          {ingredient.ingredient_id}
        </span>
        <span className="mx-2">-</span>
        <span>{ingredient.ingredient_name}</span>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEditIngredient(categoryIndex, ingredientIndex)}
          className="h-8 w-8"
        >
          <Pencil size={16} />
          <span className="sr-only">Edit ingredient</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteIngredient(categoryIndex, ingredientIndex)}
          className="h-8 w-8"
        >
          <Trash size={16} />
          <span className="sr-only">Delete ingredient</span>
        </Button>
      </div>
    </li>
  );
};
