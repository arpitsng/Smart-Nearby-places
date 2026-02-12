import React from 'react';
import './PlacesList.css';

function PlacesList({ places, loading, selectedMood, onFavoriteToggle, favorites = [] }) {
  const isFavorite = (placeId) => favorites.some(f => f.id === placeId);

  const handleDirections = (place) => {
    const { lat, lon } = place;
    // Open Google Maps in a new tab
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  };

  if (loading) {
    return (
      <div className="places-list loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Finding the best {selectedMood || 'places'} for you...</p>
        </div>
      </div>
    );
  }

  if (!places || places.length === 0) {
    return (
      <div className="places-list empty">
        <div className="empty-state">
          <div className="empty-icon">🔭</div>
          <h3>No places found</h3>
          <p>Try selecting a different mood or moving the map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="places-list">
      <div className="places-header">
        <h2>
          {selectedMood && <span className="mood-badge">{selectedMood}</span>}
          <span className="results-count">{places.length} Results</span>
        </h2>
      </div>

      <div className="places-grid">
        {places.map((place, index) => {
          const placeId = place.id;
          const isFav = isFavorite(placeId);

          return (
            <div
              key={placeId || index}
              className="place-card"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="place-card-header">
                <div className="place-icon">
                  {getPlaceIcon(place.tags?.amenity || place.tags?.leisure)}
                </div>
                <div className="place-info">
                  <h3 className="place-name">
                    {place.tags?.name || 'Unnamed Place'}
                  </h3>
                  <span className="place-type">
                    {formatPlaceType(place.tags?.amenity || place.tags?.leisure || place.tags?.tourism)}
                  </span>
                </div>

                <button
                  className={`favorite-btn ${isFav ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavoriteToggle && onFavoriteToggle(place);
                  }}
                  title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                >
                  {isFav ? '❤️' : '🤍'}
                </button>
              </div>

              <div className="place-details">
                {place.tags?.cuisine && (
                  <div className="place-detail">
                    <span className="detail-icon">🍽️</span>
                    <span className="detail-text">{place.tags.cuisine}</span>
                  </div>
                )}

                {place.distance && (
                  <div className="place-distance">
                    📍 {place.distance.toFixed(2)} km away
                  </div>
                )}
              </div>

              <div className="place-actions">
                <button
                  className="action-btn directions-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDirections(place);
                  }}
                >
                  🗺️ Get Directions
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to get appropriate icon for place type
function getPlaceIcon(type) {
  const iconMap = {
    restaurant: '🍽️',
    cafe: '☕',
    bar: '🍷',
    pub: '🍺',
    fast_food: '🍔',
    food_court: '🍱',
    library: '📚',
    coworking_space: '💻',
    park: '🌳',
    cinema: '🎬',
    theatre: '🎭',
    museum: '🏛️',
    art_gallery: '🖼️',
    nightclub: '🎵',
    shopping_mall: '🛍️',
    supermarket: '🛒',
    bakery: '🥐',
  };

  return iconMap[type] || '📍';
}

// Helper function to format place type nicely
function formatPlaceType(type) {
  if (!type) return 'Place';

  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default PlacesList;
