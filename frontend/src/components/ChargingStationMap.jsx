import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import { fetchChargingStations } from "../utility/api";

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}
RecenterMap.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
};

function ChargingStationMap() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [center, setCenter] = useState([39.8283, -98.5795]); // US center
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    fetchChargingStations({ countrycode: "US", maxresults: 50 })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setStations(res.data);
        } else {
          setStations([]);
          console.error('Unexpected response:', res.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    setSearching(true);
    // Use OpenStreetMap Nominatim API for geocoding
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`;
    try {
      const res = await fetch(url);
      const results = await res.json();
      if (results && results.length > 0) {
        setCenter([parseFloat(results[0].lat), parseFloat(results[0].lon)]);
      }
    } finally {
      setSearching(false);
    }
  };

  const handleFindMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setCenter(coords);
        setUserLocation(coords);
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert("Unable to retrieve your location.");
      }
    );
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <form onSubmit={handleSearch} style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Search location (city, state, address)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", flex: 1 }}
        />
        <button type="submit" style={{ padding: 8, borderRadius: 6, background: "#2563eb", color: "#fff", border: "none", fontWeight: 600 }}>
          {searching ? "Searching..." : "Search"}
        </button>
        <button type="button" onClick={handleFindMyLocation} style={{ padding: 8, borderRadius: 6, background: "#4ade80", color: "#1e293b", border: "none", fontWeight: 600 }}>
          {locating ? "Locating..." : "Find My Location"}
        </button>
      </form>
      {loading ? (
        <div>Loading map...</div>
      ) : (
        <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
          <RecenterMap center={center} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <strong>Your Location</strong>
              </Popup>
            </Marker>
          )}
          {stations.map((station) => (
            <Marker
              key={station.ID}
              position={[station.AddressInfo.Latitude, station.AddressInfo.Longitude]}
            >
              <Popup>
                <strong>{station.AddressInfo.Title}</strong>
                <br />
                {station.AddressInfo.AddressLine1}
                <br />
                {station.AddressInfo.Town}, {station.AddressInfo.StateOrProvince}
                <br />
                {station.AddressInfo.ContactTelephone1}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

export default ChargingStationMap;