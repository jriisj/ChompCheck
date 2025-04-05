
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BlacklistedIngredients, Ingredient } from "@/data/blacklistedIngredients";

interface IngredientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  categoryIndex: number;
  ingredientIndex: number;
  blacklist: BlacklistedIngredients;
  onUpdateBlacklist: (newBlacklist: BlacklistedIngredients) => void;
}

export const IngredientDialog: React.FC<IngredientDialogProps> = ({
  isOpen,
  onClose,
  isEditing,
  categoryIndex,
  ingredientIndex,
  blacklist,
  onUpdateBlacklist
}) => {
  const [ingredientId, setIngredientId] = useState<string>("");
  const [ingredientName, setIngredientName] = useState<string>("");
  
  useEffect(() => {
    if (isEditing && categoryIndex >= 0 && ingredientIndex >= 0) {
      const ingredient = blacklist.categories[categoryIndex].ingredients[ingredientIndex];
      setIngredientId(ingredient.ingredient_id);
      setIngredientName(ingredient.ingredient_name);
    } else {
      setIngredientId("");
      setIngredientName("");
    }
  }, [isEditing, categoryIndex, ingredientIndex, blacklist.categories]);
  
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
    newBlacklist.categories[categoryIndex].ingredients.push(newIngredient);
    
    onUpdateBlacklist(newBlacklist);
    toast.success(`Ingredient "${ingredientId}" added`);
    onClose();
  };
  
  const handleEditIngredient = () => {
    if (!ingredientId.trim() || !ingredientName.trim()) {
      toast.error("Both ID and name are required");
      return;
    }
    
    const newBlacklist = { ...blacklist };
    newBlacklist.categories[categoryIndex].ingredients[ingredientIndex] = {
      ingredient_id: ingredientId,
      ingredient_name: ingredientName
    };
    
    onUpdateBlacklist(newBlacklist);
    toast.success(`Ingredient updated`);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Ingredient" : "Add Ingredient"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={isEditing ? handleEditIngredient : handleAddIngredient}>
            {isEditing ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
