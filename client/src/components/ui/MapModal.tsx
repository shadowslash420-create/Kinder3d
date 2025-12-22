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
  const [loadingGeolocation, setLoadingGeolocation] = useState(false);

  // Request geolocation for customer selection
  useEffect(() => {
    if (!open || mode !== 'select') return;
    
    setLoadingGeolocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Customer location obtained:', position.coords);
          setLoadingGeolocation(false);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          setLoadingGeolocation(false);
        },
        { timeout: 5000, maximumAge: 0 }
      );
    }
  }, [open, mode]);

  // Get admin/staff location for view mode
  useEffect(() => {
    if (mode === 'view' && !adminLat && !adminLng && open) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Admin location obtained:', position.coords);
            setAdminLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.log('Geolocation error:', error.message);
          },
          { timeout: 5000, maximumAge: 0 }
        );
      }
    }
  }, [mode, adminLat, adminLng, open]);

  // Initialize and update map
  useEffect(() => {
    if (!open || !mapContainerRef.current) return;

    // Destroy existing map instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Small delay to ensure container is properly sized
    setTimeout(() => {
      if (!mapContainerRef.current) return;

      const center = [
        clientLat || adminLat || adminLocation?.lat || 36.737,
        clientLng || adminLng || adminLocation?.lng || 3.0588,
      ] as [number, number];

      mapRef.current = L.map(mapContainerRef.current, {
        center,
        zoom: 13,
        dragging: true,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      if (mode === 'select') {
        mapRef.current.on('click', (e) => {
          setSelectedLat(e.latlng.lat);
          setSelectedLng(e.latlng.lng);
          console.log('Location selected:', e.latlng.lat, e.latlng.lng);
        });
      }

      // Add markers
      if (clientLat && clientLng) {
        L.marker([clientLat, clientLng], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        })
          .addTo(mapRef.current)
          .bindPopup(`<strong>Client Location</strong><br/>${clientAddress || 'Delivery address'}`);
      } else if (selectedLat && selectedLng && mode === 'select') {
        L.marker([selectedLat, selectedLng], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        })
          .addTo(mapRef.current)
          .bindPopup('Selected location');
      }

      // Add admin marker for view mode
      const finalAdminLat = adminLat || adminLocation?.lat;
      const finalAdminLng = adminLng || adminLocation?.lng;
      if (finalAdminLat && finalAdminLng && mode === 'view') {
        L.marker([finalAdminLat, finalAdminLng], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        })
          .addTo(mapRef.current)
          .bindPopup('Your location');
      }

      // Fit bounds if both locations exist
      if (
        mapRef.current &&
        clientLat &&
        clientLng &&
        finalAdminLat &&
        finalAdminLng
      ) {
        const bounds = L.latLngBounds(
          [clientLat, clientLng],
          [finalAdminLat, finalAdminLng]
        );
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }

      // Invalidate size to ensure proper rendering
      mapRef.current.invalidateSize();
    }, 100);

    return () => {
      // Cleanup when dialog closes
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [open, clientLat, clientLng, selectedLat, selectedLng, adminLat, adminLng, adminLocation, mode, clientAddress]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {mode === 'select' ? 'Select Delivery Location' : 'Order Location Map'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden p-4 flex flex-col gap-4">
          <div
            ref={mapContainerRef}
            className="w-full flex-1 rounded-lg border bg-slate-100"
            style={{ minHeight: '400px', height: '100%' }}
          />

          {mode === 'select' && loadingGeolocation && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Requesting your location permission...
              </p>
            </div>
          )}

          {mode === 'select' && (selectedLat || selectedLng) && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-slate-700">
                <strong>✓ Selected location:</strong> {selectedLat?.toFixed(4)}, {selectedLng?.toFixed(4)}
              </p>
            </div>
          )}

          {mode === 'view' && adminLocation && clientLat && clientLng && (
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                <strong>Coordinates:</strong> Client [{clientLat.toFixed(4)}, {clientLng.toFixed(4)}] | You [{adminLocation.lat.toFixed(4)}, {adminLocation.lng.toFixed(4)}]
              </p>
              <p>
                <a
                  href={`https://www.google.com/maps/dir/${adminLocation.lat},${adminLocation.lng}/${clientLat},${clientLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  📍 Open in Google Maps →
                </a>
              </p>
            </div>
          )}
        </div>

        {mode === 'select' && (
          <DialogFooter className="p-4 border-t flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
              className="bg-green-600 hover:bg-green-700"
            >
              ✓ Confirm Location
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
