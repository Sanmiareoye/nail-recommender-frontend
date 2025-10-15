"use client";

import LiveMode from "../components/LiveMode";
import ToggleSwitch from "../components/Toggle";
import UploadMode from "../components/UploadMode";
import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState(1);

  return (
    <div
      style={{
        backgroundColor: "#F5F5F0",
        minHeight: "100vh",
      }}
    >
      <ToggleSwitch
        onChange={(newMode) => {
          setMode(newMode);
        }}
      />

      {mode === 1 && <LiveMode />}

      {mode === 2 && <UploadMode />}
    </div>
  );
}
