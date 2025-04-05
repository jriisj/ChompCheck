
import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCcw } from "lucide-react";
import { findBlacklistedIngredients } from "@/utils/textProcessing";
import { BlacklistedIngredients } from "@/data/blacklistedIngredients";
import { ResultOverlay } from "./ResultOverlay";

interface ScannerProps {
  blacklist: BlacklistedIngredients;
}

export const Scanner: React.FC<ScannerProps> = ({ blacklist }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [detectedText, setDetectedText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [foundIngredients, setFoundIngredients] = useState<any[]>([]);

  // Start the camera
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        setScanning(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please ensure you have given camera permissions.");
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setScanning(false);
    }
  };

  // Capture image and analyze
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        setIsAnalyzing(true);
        
        // In a real app, here we would process the image with OCR
        // For this demo, we'll simulate OCR with a timeout and sample text
        setTimeout(() => {
          // This is where you would integrate with a real OCR API
          const simulatedText = "Ingredients: Water, Sugar, Modified Corn Starch, E104 Quinoline Yellow, Salt, E211 Sodium Benzoate, Natural Flavors, E955";
          processDetectedText(simulatedText);
        }, 2000);
      }
    }
  };

  // Process the text detected by OCR
  const processDetectedText = (text: string) => {
    setDetectedText(text);
    const found = findBlacklistedIngredients(text, blacklist);
    setFoundIngredients(found);
    setIsAnalyzing(false);
    setShowResults(true);
  };

  // Reset the scanner
  const resetScanner = () => {
    setShowResults(false);
    setDetectedText("");
    setFoundIngredients([]);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="camera-container flex-grow">
        {!scanning ? (
          <div className="flex flex-col items-center justify-center h-full bg-neuro-dark/5">
            <Camera size={48} className="text-neuro-dark/50 mb-4" />
            <button 
              className="button-primary"
              onClick={startCamera}
            >
              Start Camera
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Capture button */}
            {!isAnalyzing && !showResults && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <button 
                  className="button-primary rounded-full h-16 w-16 flex items-center justify-center"
                  onClick={captureImage}
                >
                  <Camera size={24} />
                </button>
              </div>
            )}
            
            {/* Loading indicator */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                  <p>Analyzing ingredients...</p>
                </div>
              </div>
            )}
            
            {/* Results overlay */}
            {showResults && (
              <ResultOverlay 
                detectedText={detectedText}
                foundIngredients={foundIngredients}
                onReset={() => {
                  resetScanner();
                }}
              />
            )}
          </>
        )}
      </div>
      
      {scanning && !showResults && !isAnalyzing && (
        <div className="p-4 bg-white shadow-md">
          <button 
            className="button-secondary w-full flex items-center justify-center gap-2"
            onClick={stopCamera}
          >
            <RefreshCcw size={18} />
            Stop Camera
          </button>
        </div>
      )}
    </div>
  );
};
