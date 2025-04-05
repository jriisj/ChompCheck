
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BlacklistedIngredients } from "@/data/blacklistedIngredients";

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  categoryIndex: number;
  blacklist: BlacklistedIngredients;
  onUpdateBlacklist: (newBlacklist: BlacklistedIngredients) => void;
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  isOpen,
  onClose,
  isEditing,
  categoryIndex,
  blacklist,
  onUpdateBlacklist
}) => {
  const [categoryName, setCategoryName] = useState<string>("");
  
  useEffect(() => {
    if (isEditing && categoryIndex >= 0) {
      setCategoryName(blacklist.categories[categoryIndex].name);
    } else {
      setCategoryName("");
    }
  }, [isEditing, categoryIndex, blacklist.categories]);
  
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
    onClose();
  };
  
  const handleEditCategory = () => {
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    const newBlacklist = { ...blacklist };
    newBlacklist.categories[categoryIndex].name = categoryName;
    
    onUpdateBlacklist(newBlacklist);
    toast.success(`Category updated`);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={isEditing ? handleEditCategory : handleAddCategory}>
            {isEditing ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
