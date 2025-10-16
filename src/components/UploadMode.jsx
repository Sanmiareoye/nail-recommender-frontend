"use client";
import { useEffect, useState } from "react";
import styles from "../styles/UploadMode.module.css";

function UploadMode() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toggleForm, setToggleForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileInputChange = (event) => {
    setFile(event.target.files[0]);
    setResults([]);
    setToggleForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      setToggleForm(false);

      const endpoint =
        "https://nail-recommender-backend-production.up.railway.app/search/";
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("file uploaded successfully!");
      } else {
        console.error("Failed to upload file.");
      }
      const data = await response.json();

      if (data.results) {
        setResults(data.results);
        console.log("Got results!:");
      } else {
        console.error("Couldn't process image");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectedImage = (imageUrl) => {
    setSelectedImage(selectedImage === imageUrl ? null : imageUrl);
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {!toggleForm ? null : "Nail Recommendation Model: Upload a Set"}
        </h1>

        <div className={styles.content}>
          <div
            className={`${styles.dropdownContainer} ${
              toggleForm ? styles.expanded : styles.collapsed
            }`}
          >
            <div className={styles.leftColumn}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fileInputWrapper}>
                  <input
                    placeholder="📸"
                    type="file"
                    className={styles.fileInput}
                    onChange={handleFileInputChange}
                  />
                </div>

                <div className={styles.previewWrapper}>
                  {file && (
                    <img
                      className={styles.previewImage}
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                    />
                  )}
                </div>

                <button className={styles.uploadButton} type="submit">
                  Get similar sets!
                </button>
              </form>
            </div>
          </div>

          <button
            onClick={() => setToggleForm((prev) => !prev)}
            className={styles.dropdownToggle}
          >
            {toggleForm
              ? "Hide Upload Form ▲"
              : !toggleForm && results.length > 0
              ? "Upload Another Picture ▼"
              : "Upload A Picture ▼"}
          </button>

          <div className={styles.rightColumn}>
            <ul className={styles.resultsGrid}>
              {isLoading ? (
                <p className={styles.loading}>Loading...</p>
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

export default UploadMode;
