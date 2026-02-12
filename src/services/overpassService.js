export async function fetchNearbyPlaces(lat, lng, types) {
  const radius = 5000;

  const query = `
    [out:json][timeout:25];
    (
      ${types
      .map(
        (type) => `
            node["amenity"="${type}"](around:${radius},${lat},${lng});
            node["shop"="${type}"](around:${radius},${lat},${lng});
            node["leisure"="${type}"](around:${radius},${lat},${lng});
            node["tourism"="${type}"](around:${radius},${lat},${lng});
            node["office"="${type}"](around:${radius},${lat},${lng});
          `
      )
      .join("")}
    );
    out body;
  `;

  const url = "https://overpass.kumi.systems/api/interpreter";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: query,
    });

    if (!response.ok) {
      throw new Error("Overpass request failed");
    }

    const data = await response.json();
    return data.elements || [];
  } catch (error) {
    console.error("Overpass error:", error);
    return [];
  }
}
