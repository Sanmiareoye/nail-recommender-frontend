"use client";
import { useState } from "react";
import styles from "../styles/ToggleSwitch.module.css";

export default function ToggleSwitch({ defaultMode = 1, onChange }) {
  const [mode, setMode] = useState(defaultMode);

  const toggleMode = () => {
    const newMode = mode === 1 ? 2 : 1;
    setMode(newMode);
    if (onChange) onChange(newMode);
  };

  return (
    <div className={styles.container}>
      <div onClick={toggleMode} className={styles.switchWrapper}>
        <button
          className={`${styles.button} ${mode === 1 ? styles.active : ""}`}
          type="button"
        >
          Live Mode
        </button>
        <button
          className={`${styles.button} ${mode === 2 ? styles.active : ""}`}
          type="button"
        >
          Upload Mode
        </button>
        <div
          className={`${styles.slider} ${
            mode === 2 ? styles.sliderRight : styles.sliderLeft
          }`}
        />
      </div>
    </div>
  );
}
