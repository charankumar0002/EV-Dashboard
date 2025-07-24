import { useEffect, useState } from "react";

function EVModelExplorer() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetch("https://ev-dashboard-1a32.vercel.app/api/ev-models")
      .then((res) => res.json())
      .then((data) => {
        setModels(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Get unique types for filter dropdown
  const types = Array.from(new Set(models.map(m => m.Type))).filter(Boolean);

  // Filtered and searched models
  const filtered = models.filter(m => {
    const matchesSearch = m.Model.toLowerCase().includes(search.toLowerCase()) || m.Make.toLowerCase().includes(search.toLowerCase());
    const matchesType = !filterType || m.Type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px #0001" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>EV Model Explorer</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by make or model..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", flex: 1 }}
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="">All Types</option>
          {types.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      {loading ? (
        <div>Loading EV models...</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={{ padding: 8, textAlign: "left" }}>Make</th>
                <th style={{ padding: 8, textAlign: "left" }}>Model</th>
                <th style={{ padding: 8, textAlign: "left" }}>Type</th>
                <th style={{ padding: 8, textAlign: "left" }}>Range (km)</th>
                <th style={{ padding: 8, textAlign: "left" }}>Battery (kWh)</th>
                <th style={{ padding: 8, textAlign: "left" }}>Price (€)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{m.Make}</td>
                  <td style={{ padding: 8 }}>{m.Model}</td>
                  <td style={{ padding: 8 }}>{m.Type}</td>
                  <td style={{ padding: 8 }}>{m.Range_WLTP}</td>
                  <td style={{ padding: 8 }}>{m.Battery}</td>
                  <td style={{ padding: 8 }}>{m.Price_EUR}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ marginTop: 16 }}>No models found.</div>}
        </div>
      )}
    </div>
  );
}

export default EVModelExplorer;