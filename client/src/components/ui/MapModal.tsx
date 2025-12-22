import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MapPin, Navigation } from 'lucide-react';

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
  const [adminLocation, setAdminLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [requestingLocation, setRequestingLocation] = useState(false);

  // Request geolocation
  useEffect(() => {
    if (!open) return;
    
    setRequestingLocation(true);
    if (navigator.geolocation) {
      const timeout = setTimeout(() => {
        setRequestingLocation(false);
      }, 2000);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeout);
          setRequestingLocation(false);
          if (mode === 'view') {
            setAdminLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }
        },
        () => {
          clearTimeout(timeout);
          setRequestingLocation(false);
        }
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
        const lat = clientLat || adminLat || adminLocation?.lat || 36.737;
        const lng = clientLng || adminLng || adminLocation?.lng || 3.0588;

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
          L.circleMarker([selectedLat, selectedLng], {
            radius: 8,
            fillColor: '#ef4444',
            color: '#991b1b',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          })
            .addTo(mapRef.current)
            .bindPopup('Selected Location');
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
  }, [open, clientLat, clientLng, selectedLat, selectedLng, adminLocation, mode, clientAddress, adminLat, adminLng]);

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
