import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BlacklistedIngredients, BlacklistedCategory, Ingredient } from "@/data/blacklistedIngredients";
import { IngredientsList } from "./IngredientsList";

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
  
  const [categoryName, setCategoryName] = useState<string>("");
  const [ingredientId, setIngredientId] = useState<string>("");
  const [ingredientName, setIngredientName] = useState<string>("");
  
  const openDialog = (
    type: DialogType, 
    categoryIndex: number = -1, 
    ingredientIndex: number = -1
  ) => {
    setDialogType(type);
    setSelectedCategoryIndex(categoryIndex);
    setSelectedIngredientIndex(ingredientIndex);
    
    if (type === "editCategory" && categoryIndex >= 0) {
      setCategoryName(blacklist.categories[categoryIndex].name);
    } else if (type === "editIngredient" && categoryIndex >= 0 && ingredientIndex >= 0) {
      const ingredient = blacklist.categories[categoryIndex].ingredients[ingredientIndex];
      setIngredientId(ingredient.ingredient_id);
      setIngredientName(ingredient.ingredient_name);
    } else {
      setCategoryName("");
      setIngredientId("");
      setIngredientName("");
    }
    
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
  };
  
  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    const newBlacklist = { ...blacklist };
    newBlacklist.categories.push({
      name: categoryName,
      ingredients: []
    });
    
    onUpdateBlacklist(newBlacklist);
    toast.success(`Category "${categoryName}" added`);
    closeDialog();
  };
  
  const handleEditCategory = () => {
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    const newBlacklist = { ...blacklist };
    newBlacklist.categories[selectedCategoryIndex].name = categoryName;
    
    onUpdateBlacklist(newBlacklist);
    toast.success(`Category updated`);
    closeDialog();
  };
  
  const handleDeleteCategory = (categoryIndex: number) => {
    if (confirm("Are you sure you want to delete this category and all its ingredients?")) {
      const newBlacklist = { ...blacklist };
      newBlacklist.categories.splice(categoryIndex, 1);
      
      onUpdateBlacklist(newBlacklist);
      toast.success("Category deleted");
    }
  };
  
  const handleAddIngredient = () => {
    if (!ingredientId.trim() || !ingredientName.trim()) {
      toast.error("Both ID and name are required");
      return;
    }
    
    const newIngredient: Ingredient = {
      ingredient_id: ingredientId,
      ingredient_name: ingredientName
    };
    
    const newBlacklist = { ...blacklist };
    newBlacklist.categories[selectedCategoryIndex].ingredients.push(newIngredient);
    
    onUpdateBlacklist(newBlacklist);
    toast.success(`Ingredient "${ingredientId}" added`);
    closeDialog();
  };
  
  const handleEditIngredient = () => {
    if (!ingredientId.trim() || !ingredientName.trim()) {
      toast.error("Both ID and name are required");
      return;
    }
    
    const newBlacklist = { ...blacklist };
    newBlacklist.categories[selectedCategoryIndex].ingredients[selectedIngredientIndex] = {
      ingredient_id: ingredientId,
      ingredient_name: ingredientName
    };
    
    onUpdateBlacklist(newBlacklist);
    toast.success(`Ingredient updated`);
    closeDialog();
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
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "addCategory" && "Add Category"}
              {dialogType === "editCategory" && "Edit Category"}
              {dialogType === "addIngredient" && "Add Ingredient"}
              {dialogType === "editIngredient" && "Edit Ingredient"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {(dialogType === "addCategory" || dialogType === "editCategory") && (
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Category Name</label>
                  <Input 
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g., Artificial Sweeteners"
                  />
                </div>
              </div>
            )}
            
            {(dialogType === "addIngredient" || dialogType === "editIngredient") && (
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Ingredient ID</label>
                  <Input 
                    value={ingredientId}
                    onChange={(e) => setIngredientId(e.target.value)}
                    placeholder="e.g., E951"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Ingredient Name</label>
                  <Input 
                    value={ingredientName}
                    onChange={(e) => setIngredientName(e.target.value)}
                    placeholder="e.g., Aspartame"
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={() => {
              if (dialogType === "addCategory") handleAddCategory();
              if (dialogType === "editCategory") handleEditCategory();
              if (dialogType === "addIngredient") handleAddIngredient();
              if (dialogType === "editIngredient") handleEditIngredient();
            }}>
              {dialogType?.startsWith("add") ? "Add" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
