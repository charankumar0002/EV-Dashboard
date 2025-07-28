import { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchAnalytics } from "../utility/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics()
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      });
  }, []);

  // Prepare chart data
  const years = analytics ? Object.keys(analytics.yearCounts).sort() : [];
  const adoptionData = analytics ? years.map(y => analytics.yearCounts[y]) : [];
  const stateLabels = analytics ? analytics.topStates.map(s => s.state) : [];
  const stateData = analytics ? analytics.topStates.map(s => s.count) : [];
  const makeLabels = analytics ? analytics.topMakes.map(m => m.make) : [];
  const makeData = analytics ? analytics.topMakes.map(m => m.count) : [];

  // Card style for light/dark mode
  const cardStyle = {
    background: "var(--card-bg, #fff)",
    borderRadius: 16,
    boxShadow: "0 2px 12px #0001",
    padding: 24,
    marginBottom: 24,
    transition: "background 0.2s"
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, letterSpacing: -1, display: "flex", alignItems: "center", gap: 12 }}>
        📊 Analytics Dashboard
      </h2>
      {loading ? (
        <div>Loading analytics...</div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 32
        }}>
          {/* EV Adoption Over Time */}
          <div style={cardStyle}>
            <h3 style={{ fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              📈 EV Adoption Over Time
            </h3>
            <Line
              data={{
                labels: years,
                datasets: [
                  {
                    label: "EVs Registered",
                    data: adoptionData,
                    borderColor: "#2563eb",
                    backgroundColor: "#93c5fd",
                  },
                ],
              }}
              options={{ responsive: true, plugins: { tooltip: { enabled: true } } }}
            />
            <div style={{ marginTop: 12 }}>
              <span style={{ marginLeft: 12, color: '#2563eb', fontWeight: 600 }}>
                {analytics.totalModels} total models
              </span>
            </div>
          </div>
          {/* Charging Station Growth by State */}
          <div style={cardStyle}>
            <h3 style={{ fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              ⚡ Top 10 States by Charging Stations
            </h3>
            <Bar
              data={{
                labels: stateLabels,
                datasets: [
                  {
                    label: "Stations",
                    data: stateData,
                    backgroundColor: "#4ade80",
                  },
                ],
              }}
              options={{ responsive: true, plugins: { tooltip: { enabled: true } } }}
            />
            <div style={{ marginTop: 12 }}>
              <span style={{ marginLeft: 12, color: '#2563eb', fontWeight: 600 }}>
                {analytics.totalStations} total stations
              </span>
            </div>
          </div>
          {/* Most Popular Makes */}
          <div style={cardStyle}>
            <h3 style={{ fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              🚗 Most Popular EV Makes
            </h3>
            <Pie
              data={{
                labels: makeLabels,
                datasets: [
                  {
                    data: makeData,
                    backgroundColor: ["#2563eb", "#f59e42", "#06b6d4", "#818cf8", "#4ade80", "#f87171", "#fbbf24", "#a78bfa"],
                  },
                ],
              }}
              options={{ responsive: true, plugins: { tooltip: { enabled: true } } }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsDashboard;