
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BlacklistedIngredients, BlacklistedCategory, Ingredient } from "@/data/blacklistedIngredients";
import { IngredientsList } from "./IngredientsList";
import { CategoryDialog } from "./BlacklistDialogs/CategoryDialog";
import { IngredientDialog } from "./BlacklistDialogs/IngredientDialog";

interface BlacklistManagerProps {
  blacklist: BlacklistedIngredients;
  onUpdateBlacklist: (newBlacklist: BlacklistedIngredients) => void;
}

type DialogType = "addCategory" | "editCategory" | "addIngredient" | "editIngredient" | null;

export const BlacklistManager: React.FC<BlacklistManagerProps> = ({ 
  blacklist, 
  onUpdateBlacklist 
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(-1);
  const [selectedIngredientIndex, setSelectedIngredientIndex] = useState<number>(-1);
  
  const openDialog = (
    type: DialogType, 
    categoryIndex: number = -1, 
    ingredientIndex: number = -1
  ) => {
    setDialogType(type);
    setSelectedCategoryIndex(categoryIndex);
    setSelectedIngredientIndex(ingredientIndex);
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
  };
  
  const handleDeleteCategory = (categoryIndex: number) => {
    if (confirm("Are you sure you want to delete this category and all its ingredients?")) {
      const newBlacklist = { ...blacklist };
      newBlacklist.categories.splice(categoryIndex, 1);
      
      onUpdateBlacklist(newBlacklist);
      toast.success("Category deleted");
    }
  };
  
  const handleDeleteIngredient = (categoryIndex: number, ingredientIndex: number) => {
    if (confirm("Are you sure you want to delete this ingredient?")) {
      const newBlacklist = { ...blacklist };
      newBlacklist.categories[categoryIndex].ingredients.splice(ingredientIndex, 1);
      
      onUpdateBlacklist(newBlacklist);
      toast.success("Ingredient deleted");
    }
  };
  
  return (
    <div className="h-full overflow-y-auto">
      <IngredientsList 
        categories={blacklist.categories}
        onAddCategory={() => openDialog("addCategory")}
        onEditCategory={(categoryIndex) => openDialog("editCategory", categoryIndex)}
        onDeleteCategory={handleDeleteCategory}
        onAddIngredient={(categoryIndex) => openDialog("addIngredient", categoryIndex)}
        onEditIngredient={(categoryIndex, ingredientIndex) => 
          openDialog("editIngredient", categoryIndex, ingredientIndex)
        }
        onDeleteIngredient={handleDeleteIngredient}
      />
      
      {dialogOpen && (dialogType === "addCategory" || dialogType === "editCategory") ? (
        <CategoryDialog
          isOpen={dialogOpen}
          onClose={closeDialog}
          isEditing={dialogType === "editCategory"}
          categoryIndex={selectedCategoryIndex}
          blacklist={blacklist}
          onUpdateBlacklist={onUpdateBlacklist}
        />
      ) : dialogOpen && (dialogType === "addIngredient" || dialogType === "editIngredient") ? (
        <IngredientDialog
          isOpen={dialogOpen}
          onClose={closeDialog}
          isEditing={dialogType === "editIngredient"}
          categoryIndex={selectedCategoryIndex}
          ingredientIndex={selectedIngredientIndex}
          blacklist={blacklist}
          onUpdateBlacklist={onUpdateBlacklist}
        />
      ) : null}
    </div>
  );
};
