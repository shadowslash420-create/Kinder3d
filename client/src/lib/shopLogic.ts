export interface Location {
  lat: number;
  lng: number;
}

export const SHOPS = [
  {
    id: "shop_5",
    name: "Creperie Kinder 5",
    location: { lat: 35.5554, lng: 6.1743 }
  },
  {
    id: "shop_4",
    name: "Creperie Kinder 4",
    location: { lat: 35.5418, lng: 6.1565 }
  }
];

export function calculateHaversineDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * (Math.PI / 180)) *
      Math.cos(loc2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getNearestShop(clientLocation: Location) {
  let nearestShop = SHOPS[0];
  let minDistance = calculateHaversineDistance(clientLocation, SHOPS[0].location);

  for (let i = 1; i < SHOPS.length; i++) {
    const distance = calculateHaversineDistance(clientLocation, SHOPS[i].location);
    if (distance < minDistance) {
      minDistance = distance;
      nearestShop = SHOPS[i];
    }
  }

  return {
    shop: nearestShop,
    distanceKm: minDistance
  };
}
