
import React from "react";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { Ingredient } from "@/data/blacklistedIngredients";
import { highlightIngredients } from "@/utils/textProcessing";

interface FoundIngredient {
  ingredient: Ingredient;
  category: string;
}

interface ResultOverlayProps {
  detectedText: string;
  foundIngredients: FoundIngredient[];
  onReset: () => void;
}

export const ResultOverlay: React.FC<ResultOverlayProps> = ({ 
  detectedText, 
  foundIngredients, 
  onReset 
}) => {
  const hasBlacklisted = foundIngredients.length > 0;
  
  // Get unique categories
  const uniqueCategories = Array.from(
    new Set(foundIngredients.map(item => item.category))
  );
  
  // Highlight the ingredients in the text
  const highlightedText = highlightIngredients(detectedText, foundIngredients);
  
  return (
    <div 
      className={`absolute inset-0 flex flex-col ${
        hasBlacklisted ? "bg-neuro-red/10" : "bg-neuro-softGreen/80"
      } animate-fade-in overflow-y-auto`}
    >
      <div className="p-6 flex-1">
        <div className="mb-6">
          <button 
            onClick={onReset} 
            className="flex items-center text-neuro-dark font-medium"
          >
            <ArrowLeft size={18} className="mr-1" /> Back to Scanner
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {hasBlacklisted ? (
            <div className="flex items-center mb-4 text-neuro-red animate-pulse-attention">
              <AlertCircle size={24} className="mr-2" />
              <h2 className="text-xl font-bold">Blacklisted Ingredients Found!</h2>
            </div>
          ) : (
            <div className="flex items-center mb-4 text-neuro-green">
              <CheckCircle size={24} className="mr-2" />
              <h2 className="text-xl font-bold">No substances of concern found, happy eating!</h2>
            </div>
          )}
          
          {/* For positive results, show a fun GIF */}
          {!hasBlacklisted && (
            <div className="mb-6 flex justify-center">
              <img 
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtZ2pvNGprY25yNzQ1OGM2OW55MjVlYmEyNzR1Y2N1M2FrOGRtZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XbgZvD2XWwmiY/giphy.gif" 
                alt="Happy eating" 
                className="h-48 object-contain rounded-lg"
              />
            </div>
          )}
          
          {/* If blacklisted ingredients were found, show them */}
          {hasBlacklisted && (
            <div className="mb-4">
              <h3 className="font-medium text-lg mb-2">Found in these categories:</h3>
              <div className="space-y-2">
                {uniqueCategories.map(category => (
                  <div key={category} className="bg-neuro-softPink p-3 rounded-md">
                    <h4 className="font-medium">{category}</h4>
                    <ul className="ml-4 list-disc">
                      {foundIngredients
                        .filter(item => item.category === category)
                        .map(({ ingredient }) => (
                          <li key={ingredient.ingredient_id}>
                            <strong>{ingredient.ingredient_id}</strong>: {ingredient.ingredient_name}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Detected text with highlights */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-medium text-lg mb-2">Detected Ingredients:</h3>
          <div 
            className="text-sm" 
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          ></div>
        </div>
      </div>
    </div>
  );
};
