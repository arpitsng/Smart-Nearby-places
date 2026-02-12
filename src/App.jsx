import { useState, useEffect } from "react";
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
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from local storage on initial render
    const saved = localStorage.getItem("smartPlaces_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [viewMode, setViewMode] = useState("search"); // 'search' or 'favorites'

  useEffect(() => {
    // Save favorites to local storage whenever they change
    localStorage.setItem("smartPlaces_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const getLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError("");
        setLoading(false);
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  };

  const loadPlaces = async (mood) => {
    if (!location) {
      setError("Please enable location first!");
      getLocation(); // Try to get location again
      return;
    }

    setLoading(true);
    setError("");
    setViewMode("search"); // Switch back to search results

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

  const toggleFavorite = (place) => {
    setFavorites((prev) => {
      const isFav = prev.some((p) => p.id === place.id);
      if (isFav) {
        return prev.filter((p) => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  // Determine what list to show
  const displayedPlaces = viewMode === "favorites" ? favorites : places;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Smart-Nearby-Places</h1>

        <div className="header-actions">
          <button
            className={`nav-btn ${viewMode === 'favorites' ? 'active' : ''}`}
            onClick={() => setViewMode(viewMode === 'search' ? 'favorites' : 'search')}
            style={{ color: 'var(--text-primary)', marginRight: '1rem', fontWeight: 600 }}
          >
            {viewMode === 'search' ? `❤️ Favorites (${favorites.length})` : '🔍 Search'}
          </button>
        </div>
      </header>

      <div className="main-content">
        {/* Left Panel: Map */}
        <div className="left-panel">
          <div className="map-container">
            <MapView
              key={location ? `${location.lat}-${location.lng}` : "default"}
              location={location || { lat: 26.4499, lng:74.6399 }} // Default to Ajmer
              places={displayedPlaces}
            />
          </div>
        </div>

        {/* Right Panel: Sidebar */}
        <div className="right-panel">
          {/* Location Status Bar */}
          <div className="location-section">
            {!location ? (
              <button className="location-button" onClick={getLocation}>
                📍 Enable Location to Start
              </button>
            ) : (
              <div className="location-info">
                <span>📍 Using current location</span>
                <button onClick={getLocation} style={{ color: 'var(--primary-color)', fontSize: '0.8rem' }}>Update</button>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
          </div>

          {!selectedMood && viewMode === 'search' ? (
            <MoodSelector
              selectedMood={selectedMood}
              onMoodSelect={(mood) => {
                setSelectedMood(mood);
                loadPlaces(mood);
              }}
            />
          ) : (
            <>
              {viewMode === 'search' && (
                <div style={{ padding: '0 var(--space-md)', marginTop: 'var(--space-sm)' }}>
                  <button
                    onClick={() => setSelectedMood(null)}
                    style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    ← Change Mood
                  </button>
                </div>
              )}

              <PlacesList
                places={displayedPlaces}
                loading={loading}
                selectedMood={viewMode === 'favorites' ? 'Favorites' : selectedMood}
                onFavoriteToggle={toggleFavorite}
                favorites={favorites}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

