import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function MapView({ location, places }) {
  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      <Marker position={[location.lat, location.lng]}>
        <Popup>You are here</Popup>
      </Marker>

      {places
        .filter((p) => p.lat && p.lon)
        .map((place) => (
          <Marker key={place.id} position={[place.lat, place.lon]}>
            <Popup>
        <strong>{place.tags?.name || "Unnamed place"}</strong>
        <br />
        {place.tags?.amenity}
      </Popup>
    </Marker>
  ))}

    </MapContainer>
  );
}

export default MapView;
