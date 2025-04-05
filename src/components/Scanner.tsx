import React, { useRef, useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import { findBlacklistedIngredients, FoundIngredient } from "@/utils/textProcessing";
import { BlacklistedIngredients } from "@/data/blacklistedIngredients";
import { ResultOverlay } from "./ResultOverlay";
import { toast } from "sonner";

interface ScannerProps {
  blacklist: BlacklistedIngredients;
}

export interface LocalFoundIngredient {
  ingredient: { ingredient_id: string; ingredient_name: string; [key: string]: string | number | boolean }; // Ensure required fields are included
  category: string;
}

export const Scanner: React.FC<ScannerProps> = ({ blacklist }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scanning, setScanning] = useState(false);
  const [detectedText, setDetectedText] = useState<string>("");
  const [foundIngredients, setFoundIngredients] = useState<LocalFoundIngredient[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Start the camera
  const startCamera = async () => {
    try {
      setPermissionDenied(false);
      const constraints = {
        video: { facingMode: "environment" },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setPermissionDenied(true);
      toast.error("Camera access denied. Please enable camera permissions.");
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setScanning(false);
    }
  };

  // Capture image and analyze
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setIsAnalyzing(true);
        processImage(canvas);
      }
    }
  };

  // Process the captured image with OCR
  const processImage = async (image: HTMLCanvasElement) => {
    try {
      const { data: { text } } = await Tesseract.recognize(image, "eng");
      processDetectedText(text);
    } catch (err) {
      console.error("Error during OCR processing:", err);
      toast.error("Failed to analyze the image. Please try again.");
      setIsAnalyzing(false);
    }
  };

  // Analyze the detected text for blacklisted ingredients
  const processDetectedText = (text: string) => {
    setDetectedText(text);
    const found = findBlacklistedIngredients(text, blacklist).map((item) => ({
      ingredient: {
        ingredient_id: "id" in item.ingredient ? item.ingredient.id : "Unknown", // Ensure 'ingredient_id' is provided
        ingredient_name: "name" in item.ingredient ? item.ingredient.name : "Unknown", // Ensure 'ingredient_name' is provided
        description: "Description not available",
      },
      category: item.category,
    })) as LocalFoundIngredient[];
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
          <div className="flex flex-col items-center justify-center h-full bg-gray-100">
            <button className="button-primary" onClick={startCamera}>
              Take a picture why don't you?
            </button>
            {permissionDenied && (
              <p className="text-red-500 mt-4">
                Camera permission denied. Please enable camera access.
              </p>
            )}
          </div>
        ) : (
          <>
            <video ref={videoRef} className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            {!isAnalyzing && !showResults && (
              <button
                className="button-primary absolute bottom-6 left-1/2 transform -translate-x-1/2"
                onClick={captureImage}
              >
                Capture Image
              </button>
            )}
            {isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-white">Analyzing...</p>
              </div>
            )}
            {showResults && (
              <ResultOverlay
                detectedText={detectedText}
                foundIngredients={foundIngredients}
                onReset={resetScanner}
              />
            )}
          </>
        )}
      </div>
      {scanning && (
        <button className="button-secondary mt-4" onClick={stopCamera}>
          Stop Camera
        </button>
      )}
    </div>
  );
};
