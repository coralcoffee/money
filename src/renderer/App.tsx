import React, { useState } from "react";

export function App() {
  const [result, setResult] = useState<string>("");

  const onPing = async () => {
    const res = await window.api.ping();
    setResult(`${res.message} @ ${new Date(res.time).toLocaleTimeString()}`);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1>Electron + Rsbuild + React + TS A</h1>
      <p>HMR from Rsbuild, secure IPC via preload.</p>
      <button onClick={onPing}>Ping main</button>
      <p>{result}</p>
    </div>
  );
}
