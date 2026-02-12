import { useState } from "react";
import MoodSelector from "./components/MoodSelector";
import MapView from "./components/MapView";
import PlacesList from "./components/PlacesList";
import moodConfig from "./utils/moodConfig";
import { fetchNearbyPlaces } from "./services/overpassService";
import "./App.css";

function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError("");
      },
      () => {
        setError("Location permission denied");
      }
    );
  };

  const loadPlaces = async (mood) => {
    if (!location) return;

    setLoading(true);
    setError("");

    try {
      const types = moodConfig[mood].types;
      const results = await fetchNearbyPlaces(
        location.lat,
        location.lng,
        types
      );

      console.log("Fetched places:", results);

      if (results.length === 0) {
        console.warn("No places found for this mood");
      }

      setPlaces(results);
    } catch (err) {
      setError("Failed to fetch places. Please try again.");
      console.error("Error fetching places:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌟 Smart Nearby Places Recommender</h1>
      </header>

      <div className="location-section">
        <button className="location-button" onClick={getLocation}>
          📍 Get My Location
        </button>

        {location && (
          <div className="location-info">
            <span>Lat: {location.lat.toFixed(4)}</span>
            <span>Lng: {location.lng.toFixed(4)}</span>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <MoodSelector
        selectedMood={selectedMood}
        onMoodSelect={(mood) => {
          setSelectedMood(mood);
          loadPlaces(mood);
        }}
      />

      {location && (
        <div className="main-content">
          <div className="left-panel">
            <div className="map-container">
              <MapView
                key={`${location.lat}-${location.lng}`}
                location={location}
                places={places}
              />
            </div>
          </div>

          <div className="right-panel">
            <PlacesList
              places={places}
              loading={loading}
              selectedMood={selectedMood}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

