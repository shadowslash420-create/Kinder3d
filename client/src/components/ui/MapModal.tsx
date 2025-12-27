import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MapPin, Navigation, Store } from 'lucide-react';
import { SHOPS } from '@/lib/shopLogic';

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  mode: 'select' | 'view';
  clientLat?: number;
  clientLng?: number;
  adminLat?: number;
  adminLng?: number;
  clientAddress?: string;
}

export function MapModal({
  open,
  onOpenChange,
  onLocationSelect,
  mode,
  clientLat,
  clientLng,
  adminLat,
  adminLng,
  clientAddress,
}: MapModalProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedLat, setSelectedLat] = useState<number | null>(clientLat || null);
  const [selectedLng, setSelectedLng] = useState<number | null>(clientLng || null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [adminLocation, setAdminLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [requestingLocation, setRequestingLocation] = useState(false);

  // Request geolocation
  useEffect(() => {
    if (!open) return;
    
    setRequestingLocation(true);
    if (navigator.geolocation) {
      const timeout = setTimeout(() => {
        setRequestingLocation(false);
      }, 10000); // Increased timeout to 10s for mobile
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeout);
          setRequestingLocation(false);
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log('Location obtained:', location);
          if (mode === 'select') {
            setUserLocation(location);
            // Auto-center on user if no location selected yet
            if (!selectedLat || !selectedLng) {
              setSelectedLat(location.lat);
              setSelectedLng(location.lng);
              mapRef.current?.setView([location.lat, location.lng], 15);
            }
          } else if (mode === 'view') {
            setAdminLocation(location);
          }
        },
        (error) => {
          clearTimeout(timeout);
          setRequestingLocation(false);
          console.error('Geolocation error:', error.code, error.message);
          // Fallback to a default location if denied
          if (error.code === error.PERMISSION_DENIED) {
            console.warn('Geolocation permission denied by user.');
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setRequestingLocation(false);
    }
  }, [open, mode]);

  // Initialize map
  useEffect(() => {
    if (!open || !mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.off();
      mapRef.current.remove();
      mapRef.current = null;
    }

    setTimeout(() => {
      if (!mapContainerRef.current) return;

      try {
        const lat = clientLat || adminLat || userLocation?.lat || adminLocation?.lat || 36.737;
        const lng = clientLng || adminLng || userLocation?.lng || adminLocation?.lng || 3.0588;

        mapRef.current = L.map(mapContainerRef.current).setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapRef.current);

        // Handle selection mode click
        if (mode === 'select' && mapRef.current) {
          mapRef.current.on('click', (e: any) => {
            setSelectedLat(e.latlng.lat);
            setSelectedLng(e.latlng.lng);
          });
        }

        // Add client marker
        if (clientLat && clientLng && mapRef.current) {
          L.circleMarker([clientLat, clientLng], {
            radius: 8,
            fillColor: '#ef4444',
            color: '#991b1b',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          })
            .addTo(mapRef.current)
            .bindPopup(`<strong>Client Location</strong><br>${clientAddress || 'Delivery'}`);
        }

        // Add selected marker
        if (selectedLat && selectedLng && mode === 'select' && mapRef.current) {
          L.marker([selectedLat, selectedLng], {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            })
          })
            .addTo(mapRef.current)
            .bindPopup('Selected Delivery Location');
        }

        // Add shop markers in view mode
        if (mode === 'view' && mapRef.current) {
          const map = mapRef.current;
          SHOPS.forEach(shop => {
            L.marker([shop.location.lat, shop.location.lng], {
              icon: L.divIcon({
                className: 'shop-icon',
                html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 2px; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7]
              })
            })
            .addTo(map)
            .bindPopup(`<strong>${shop.name}</strong>`);
          });
        }

        // Add user marker in select mode
        if (userLocation && mode === 'select' && mapRef.current) {
          L.circleMarker([userLocation.lat, userLocation.lng], {
            radius: 10,
            fillColor: '#3b82f6',
            color: '#1e40af',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          })
            .addTo(mapRef.current)
            .bindPopup('Your Current Location');
        }

        // Add admin marker
        if (adminLocation && mode === 'view' && mapRef.current) {
          L.circleMarker([adminLocation.lat, adminLocation.lng], {
            radius: 8,
            fillColor: '#3b82f6',
            color: '#1e40af',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          })
            .addTo(mapRef.current)
            .bindPopup('Your Location');
        }

        // Fit bounds
        if (mapRef.current && clientLat && clientLng && adminLocation) {
          mapRef.current.fitBounds(
            L.latLngBounds([clientLat, clientLng], [adminLocation.lat, adminLocation.lng]),
            { padding: [50, 50] }
          );
        }

        mapRef.current.invalidateSize();
      } catch (err) {
        console.error('Map error:', err);
      }
    }, 50);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [open, clientLat, clientLng, selectedLat, selectedLng, userLocation, adminLocation, mode, clientAddress, adminLat, adminLng]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {mode === 'select' ? 'Select Delivery Location' : 'Order Location Map'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 min-h-[400px]">
          <div ref={mapContainerRef} className="w-full h-[400px] rounded-lg border-2 border-slate-200 bg-slate-100" />
        </div>

        <div className="px-4 py-3 border-t space-y-2 text-sm">
          {requestingLocation && (
            <div className="text-blue-600 flex items-center gap-2">
              <span className="inline-block h-2 w-2 bg-blue-600 rounded-full animate-pulse"></span>
              Requesting location permission...
            </div>
          )}

          {selectedLat && selectedLng && mode === 'select' && (
            <div className="text-green-600 font-medium">
              ✓ Location Selected: {selectedLat.toFixed(4)}, {selectedLng.toFixed(4)}
            </div>
          )}

          {adminLocation && clientLat && clientLng && mode === 'view' && (
            <div className="space-y-1 text-slate-600">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                <span>Client: [{clientLat.toFixed(4)}, {clientLng.toFixed(4)}]</span>
              </div>
              <div>You: [{adminLocation.lat.toFixed(4)}, {adminLocation.lng.toFixed(4)}]</div>
              <a
                href={`https://www.google.com/maps/dir/${adminLocation.lat},${adminLocation.lng}/${clientLat},${clientLng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium inline-block text-xs"
              >
                📍 Navigate in Google Maps
              </a>
            </div>
          )}
        </div>

        {mode === 'select' && (
          <DialogFooter className="p-4 border-t gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedLat || !selectedLng}
              onClick={() => {
                if (selectedLat && selectedLng) {
                  onLocationSelect?.(selectedLat, selectedLng);
                  onOpenChange(false);
                }
              }}
            >
              Confirm Location
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
