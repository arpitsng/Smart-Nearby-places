import React from 'react';
import './PlacesList.css';

function PlacesList({ places, loading, selectedMood }) {
  if (loading) {
    return (
      <div className="places-list">
        <div className="places-header">
          <h2>Finding Places...</h2>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Searching for {selectedMood} spots near you</p>
        </div>
      </div>
    );
  }

  if (!places || places.length === 0) {
    return (
      <div className="places-list">
        <div className="places-header">
          <h2>No Places Found</h2>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📍</div>
          <p>No places found for this mood. Try selecting a different mood or location.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="places-list">
      <div className="places-header">
        <h2>
          <span className="mood-badge">{selectedMood}</span>
          {places.length} {places.length === 1 ? 'Place' : 'Places'} Found
        </h2>
      </div>
      
      <div className="places-grid">
        {places.map((place, index) => (
          <div 
            key={place.id || index} 
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
            </div>
            
            {place.tags?.cuisine && (
              <div className="place-detail">
                <span className="detail-icon">🍽️</span>
                <span className="detail-text">{place.tags.cuisine}</span>
              </div>
            )}
            
            {place.tags?.['addr:street'] && (
              <div className="place-detail">
                <span className="detail-icon">📍</span>
                <span className="detail-text">{place.tags['addr:street']}</span>
              </div>
            )}
            
            {place.tags?.opening_hours && (
              <div className="place-detail">
                <span className="detail-icon">🕐</span>
                <span className="detail-text">{place.tags.opening_hours}</span>
              </div>
            )}
            
            {place.tags?.phone && (
              <div className="place-detail">
                <span className="detail-icon">📞</span>
                <span className="detail-text">{place.tags.phone}</span>
              </div>
            )}
            
            {place.distance && (
              <div className="place-distance">
                {place.distance.toFixed(2)} km away
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get appropriate icon for place type
function getPlaceIcon(type) {
  const iconMap = {
    restaurant: '🍽️',
    cafe: '☕',
    bar: '🍺',
    pub: '🍻',
    fast_food: '🍔',
    food_court: '🍱',
    library: '📚',
    coworking_space: '💼',
    park: '🌳',
    cinema: '🎬',
    theatre: '🎭',
    museum: '🏛️',
    art_gallery: '🖼️',
    nightclub: '🎵',
    shopping_mall: '🛍️',
    supermarket: '🛒',
  };
  
  return iconMap[type] || '📌';
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
