import React from 'react';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CompanyLocationDisplayProps {
  address?: string;
  latitude?: number;
  longitude?: number;
  companyName: string;
}

const CompanyLocationDisplay: React.FC<CompanyLocationDisplayProps> = ({
  address,
  latitude,
  longitude,
  companyName
}) => {  return (
    <div className="bg-dark-900 rounded-lg border border-dark-900 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-emerald-400" />
        Location
      </h3>
      
      {address && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-300 mb-1">Address:</p>
          <p className="text-white">{address}</p>
        </div>
      )}

      {latitude && longitude && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-300 mb-1">Coordinates:</p>
          <p className="text-gray-400 text-sm">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
        </div>
      )}

      <div className="border border-dark-600 rounded-lg overflow-hidden">
        <MapContainer
          center={[latitude || 46.4825, longitude || 30.7233]}
          zoom={13}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {latitude && longitude && (
            <Marker position={[latitude, longitude]}>
              <Popup>
                <div>
                  <strong>{companyName}</strong>
                  {address && <br />}
                  {address}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default CompanyLocationDisplay;
