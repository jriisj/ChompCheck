import React, { useRef, useState, useEffect } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState("user"); // "user" for front, "environment" for back

  useEffect(() => {
    let stream;

    const getCameraStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Unable to access the camera.");
        console.error(err);
      }
    };

    getCameraStream();

    // Cleanup function to stop the stream when the component unmounts or facingMode changes
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setPhoto(dataUrl);
    }
  };

  const toggleCamera = () => {
    // Toggle between front and back camera
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  return (
    <div className="p-4 space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-xl shadow-md w-full max-w-md"
      />
      <div className="space-x-4">
        <button
          onClick={capturePhoto}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Capture Photo
        </button>
        <button
          onClick={toggleCamera}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Toggle Camera
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {photo && (
        <div>
          <h3 className="text-lg font-semibold mt-4">Captured Photo:</h3>
          <img src={photo} alt="Captured" className="mt-2 rounded-xl shadow" />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
