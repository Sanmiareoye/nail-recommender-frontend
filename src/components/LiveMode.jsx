"use client";
import ReactWebcam from "react-webcam";
import urlToFile from "../utils/urlToFile";
import { handDetection } from "../utils/handDetection";
import { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import styles from "../styles/LiveMode.module.css";

export default function LiveMode() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ready, setReady] = useState(false);
  const [isFront, setIsFront] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleWebcam, setToggleWebcam] = useState(true);

  const webcam = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );

      handLandmarkerRef.current = await HandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        }
      );
      setReady(true);
      const videoElement = webcam.current?.video;
      if (videoElement) {
        handDetection(videoElement, canvasRef.current, handLandmarkerRef);
      }
    };

    if (!capturedImage) {
      init();
    }
  }, [capturedImage]);

  const capture = () => {
    const imageSrc = webcam.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const endpoint =
      "https://nail-recommender-backend-production.up.railway.app/search/";
    const file = await urlToFile(capturedImage);
    const formData = new FormData();
    formData.append("file", file);

    try {
      setToggleWebcam(false);
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload file.");

      const data = await response.json();

      if (data.results) {
        setResults(data.results);
        console.log("Got results!:", data);
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (error) {
      console.error("Error submitting image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setResults([]);
    setToggleWebcam(true);
  };

  const handleSelectedImage = (imgUrl) => {
    setSelectedImage(imgUrl === selectedImage ? null : imgUrl);
  };

  const flipWebcam = () => {
    setIsFront((prev) => !prev);
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {!toggleWebcam ? null : "Nail Recommendation Model: Take a Picture"}
        </h1>

        <div className={styles.content}>
          <div
            className={`${styles.dropdownContainer} ${
              toggleWebcam ? styles.expanded : styles.collapsed
            }`}
          >
            <div className={styles.leftColumn}>
              <p className={styles.textt}>Put your hand in the frame 👋🏾</p>
              {!capturedImage ? (
                <div className={styles.webcamWrapper}>
                  <div className={styles.videoContainer}>
                    <ReactWebcam
                      ref={webcam}
                      mirrored={isFront}
                      screenshotFormat="image/jpeg"
                      screenshotQuality={1}
                      playsInline
                      videoConstraints={{
                        facingMode: isFront ? "user" : "environment",
                      }}
                      className={styles.webcam}
                    />
                    <canvas
                      ref={canvasRef}
                      className={styles.canvas}
                      style={{ transform: isFront ? "scaleX(-1)" : "none" }}
                    />
                  </div>

                  <div className={styles.buttonGroup}>
                    <button onClick={capture} className={styles.captureButton}>
                      📸 Capture Photo
                    </button>
                    <button onClick={flipWebcam} className={styles.flipButton}>
                      🔄 Flip Camera
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.previewContainer}>
                  <img
                    className={styles.capturedImage}
                    src={capturedImage}
                    alt="Captured"
                  />
                  <div className={styles.buttonGroup}>
                    <button onClick={retake} className={styles.retakeButton}>
                      🔄 Retake
                    </button>
                    <button
                      onClick={handleSubmit}
                      className={styles.submitButton}
                    >
                      {isLoading ? "Loading..." : "Get Similar Sets!"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setToggleWebcam((prev) => !prev)}
            className={styles.dropdownToggle}
          >
            {toggleWebcam
              ? "Hide Camera ▲"
              : !toggleWebcam && results.length > 0
              ? "Take Another Picture ▼"
              : "Take A Picture ▼"}
          </button>

          <div className={styles.rightColumn}>
            <ul className={styles.resultsGrid}>
              {isLoading ? (
                <p className={styles.loading}>Loading ...</p>
              ) : results.length > 0 ? (
                results.map((result) => (
                  <li key={result.image_url} className={styles.resultItem}>
                    <img
                      className={styles.resultImage}
                      src={result.image_url}
                      alt="Result Image"
                      onClick={() => handleSelectedImage(result.image_url)}
                    />
                  </li>
                ))
              ) : null}
            </ul>
          </div>
        </div>

        {selectedImage && (
          <div
            className={styles.overlay}
            onClick={() => handleSelectedImage(selectedImage)}
          >
            <div className={styles.modal}>
              <img
                src={selectedImage}
                alt="Selected"
                className={styles.modalImage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
