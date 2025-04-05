
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, List } from "lucide-react";
import { Scanner } from "@/components/Scanner";
import { BlacklistManager } from "@/components/BlacklistManager";
import defaultBlacklist, { BlacklistedIngredients } from "@/data/blacklistedIngredients";
import { Toaster } from "sonner";

const Index = () => {
  const [blacklist, setBlacklist] = useState<BlacklistedIngredients>(defaultBlacklist);
  
  // Load blacklist from localStorage on mount
  useEffect(() => {
    const savedBlacklist = localStorage.getItem("neuroAwareBlacklist");
    if (savedBlacklist) {
      try {
        setBlacklist(JSON.parse(savedBlacklist));
      } catch (error) {
        console.error("Error loading saved blacklist:", error);
      }
    }
  }, []);
  
  // Save blacklist to localStorage whenever it changes
  const handleUpdateBlacklist = (newBlacklist: BlacklistedIngredients) => {
    setBlacklist(newBlacklist);
    localStorage.setItem("neuroAwareBlacklist", JSON.stringify(newBlacklist));
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-neuro-dark text-white py-4 px-6 shadow-lg safe-area-inset-top">
        <h1 className="text-xl font-bold">NeuroAware</h1>
      </header>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="scanner" className="flex-1 flex flex-col">
          <div className="border-b">
            <TabsList className="w-full flex">
              <TabsTrigger value="scanner" className="mobile-tab">
                <Camera className="mr-2 h-4 w-4" />
                Scanner
              </TabsTrigger>
              <TabsTrigger value="blacklist" className="mobile-tab">
                <List className="mr-2 h-4 w-4" />
                Blacklist
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="scanner" className="flex-1 overflow-hidden m-0 p-0">
            <Scanner blacklist={blacklist} />
          </TabsContent>
          
          <TabsContent value="blacklist" className="flex-1 overflow-auto m-0 p-0 -webkit-overflow-scrolling-touch">
            <BlacklistManager
              blacklist={blacklist}
              onUpdateBlacklist={handleUpdateBlacklist}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
