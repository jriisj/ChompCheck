import React, { useRef, useState } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("user"); // "user" = front, "environment" = back
  const [cameraStarted, setCameraStarted] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = async () => {
    try {
      stopCamera(); // Stop any existing streams
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setStream(newStream);
      setCameraStarted(true);
    } catch (err) {
      setError("Could not access camera.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraStarted(false);
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setTimeout(() => {
      startCamera();
    }, 200);
  };

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
      stopCamera(); // Turn off camera after photo
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera(); // Restart camera
  };

  return (
    <div className="p-4 space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      {!cameraStarted && !photo && (
        <button
          onClick={startCamera}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Start Camera
        </button>
      )}

      {cameraStarted && !photo && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-xl shadow-md w-full max-w-md"
          />
          <div className="flex gap-4 mt-2">
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
              Switch Camera
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {photo && (
        <div>
          <h3 className="text-lg font-semibold">Captured Photo:</h3>
          <img src={photo} alt="Captured" className="mt-2 rounded-xl shadow" />
          <div className="mt-4">
            <button
              onClick={retakePhoto}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Retake Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
