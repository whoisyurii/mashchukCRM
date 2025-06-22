import React, { useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface CompanyLocationAddProps {
  onLocationChange: (location: LocationData | null) => void;
  initialLocation?: LocationData | null;
}

const CompanyLocationAdd: React.FC<CompanyLocationAddProps> = ({
  onLocationChange,
  initialLocation
}) => {
  const [location, setLocation] = useState<LocationData | null>(initialLocation || null);
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Reverse geocode by lat/lng
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || '';
    } catch (e) {
      return '';
    } finally {
      setIsGeocoding(false);
    }
  };

  // Geocode by address
  const geocodeAddress = async (query: string) => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (e) {
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  // Helper to move map to new coords
  const FlyToOnLocation = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    React.useEffect(() => {
      map.flyTo([lat, lng], 13);
    }, [lat, lng, map]);
    return null;
  };

  // Click handler component
  const LocationMarker = () => {
    useMapEvents({
      click: async (e: any) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const addr = await reverseGeocode(lat, lng);
        const newLocation = {
          latitude: lat,
          longitude: lng,
          address: addr
        };
        setLocation(newLocation);
        setAddress(addr);
        onLocationChange(newLocation);
      },
    });

    return location ? (
      <>
        <Marker position={[location.latitude, location.longitude]} />
        <FlyToOnLocation lat={location.latitude} lng={location.longitude} />
      </>
    ) : null;
  };

  // When address changes, geocode and update marker (debounced)
  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (newAddress.trim() === '') {
        setLocation(null);
        onLocationChange(null);
        return;
      }
      const coords = await geocodeAddress(newAddress);
      if (coords) {
        const updatedLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          address: newAddress
        };
        setLocation(updatedLocation);
        onLocationChange(updatedLocation);
        // карта переместится через FlyToOnLocation
      } else {
        setLocation(null);
        onLocationChange(null);
      }
    }, 700); // 700ms debounce
  };

  const clearLocation = () => {
    setLocation(null);
    setAddress('');
    onLocationChange(null);
  };
  return (
    <div className="bg-dark-800 rounded-lg border border-dark-600 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-emerald-400" />
        Company Location
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Address (Optional)
          </label>
          <textarea
            value={address}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="Enter company address"
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={1}
            disabled={isGeocoding}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Location (Click on map to set marker)
          </label>
          <div className="border border-dark-600 rounded-lg overflow-hidden">
            <MapContainer
              center={location ? [location.latitude, location.longitude] : [46.4825, 30.7233]}
              zoom={location ? 13 : 10}
              style={{ height: '300px', width: '100%' }}
              whenReady={(...args: any[]) => { mapRef.current = args[0]; }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
          </div>
          
          {location && (
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Selected: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </span>
              <button
                type="button"
                onClick={clearLocation}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Clear location
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyLocationAdd;