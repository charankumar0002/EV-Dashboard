import { useState } from "react";
import ChargingStationMap from "../frontend/src/components/ChargingStationMap";
import EVModelExplorer from "../frontend/src/components/EVModelExplorer";
import AnalyticsDashboard from "../frontend/src/components/AnalyticsDashboard";
import Dashboard from "../frontend/src/pages/Dashboard";

const SIDEBAR_OPTIONS = [
  { key: "map", label: "Charging Stations Map" },
  { key: "models", label: "EV Model Explorer" },
  { key: "analytics", label: "Analytics Dashboard" },
  { key: "legacy", label: "Legacy Dashboard" },
];

function App() {
  const [selected, setSelected] = useState("map");
  const [dark, setDark] = useState(false);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      background: dark ? "#0f172a" : "#f1f5f9",
      color: dark ? "#e2e8f0" : "#1e293b"
    }}>
      {/* Sidebar */}
      <nav style={{
        width: 240,
        background: dark ? "#1e293b" : "#fff",
        color: dark ? "#e2e8f0" : "#1e293b",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "sticky",
        top: 0,
        minHeight: "100vh",
        boxShadow: dark ? "2px 0 8px #0004" : "2px 0 8px #0001"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: 22 }}>EV Dashboard</h2>
          <button
            onClick={() => setDark(d => !d)}
            style={{
              background: dark ? "#2563eb" : "#e0e7ef",
              color: dark ? "#fff" : "#1e293b",
              border: "none",
              borderRadius: 8,
              padding: 8,
              fontWeight: 600,
              cursor: "pointer"
            }}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? "🌙" : "☀️"}
          </button>
        </div>
        {SIDEBAR_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => setSelected(opt.key)}
            style={{
              background: selected === opt.key ? "#2563eb" : "transparent",
              color: selected === opt.key ? "#fff" : dark ? "#cbd5e1" : "#1e293b",
              border: "none",
              borderRadius: 8,
              padding: "12px 16px",
              textAlign: "left",
              fontWeight: 500,
              cursor: "pointer",
              marginBottom: 4,
              transition: "background 0.2s, color 0.2s"
            }}
          >
            {opt.label}
          </button>
        ))}
      </nav>
      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: "32px 5vw",
        background: dark ? "#0f172a" : "#f1f5f9",
        minHeight: "100vh",
        transition: "background 0.2s, color 0.2s"
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {selected === "map" && <ChargingStationMap />}
          {selected === "models" && <EVModelExplorer />}
          {selected === "analytics" && <AnalyticsDashboard />}
          {selected === "legacy" && <Dashboard />}
        </div>
      </main>
    </div>
  );
}

export default App;
