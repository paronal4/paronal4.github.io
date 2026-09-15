import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getNearestFacilities, getLocalizedName, getTypeLabel } from '@/lib/ethiopiaHealthFacilities';
import { useLanguage } from '@/lib/LanguageContext';
import { Navigation, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const hospitalIcon = L.divIcon({
  className: '',
  html: `<div style="background:#16a34a;width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:16px;">🏥</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const clinicIcon = L.divIcon({
  className: '',
  html: `<div style="background:#2563eb;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:14px;">🏨</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="background:#dc2626;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FitBounds({ userPos, facilities }) {
  const map = useMap();
  useEffect(() => {
    if (!userPos || facilities.length === 0) return;
    const bounds = L.latLngBounds(
      [[userPos.lat, userPos.lng], ...facilities.map(f => [f.lat, f.lng])]
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [userPos, facilities, map]);
  return null;
}

const distanceLabel = {
  en: (d) => d < 1 ? `${Math.round(d * 1000)} m away` : `${d.toFixed(1)} km away`,
  am: (d) => d < 1 ? `${Math.round(d * 1000)} ሜ ርቀት` : `${d.toFixed(1)} ኪሜ ርቀት`,
  om: (d) => d < 1 ? `${Math.round(d * 1000)} m fagaata` : `${d.toFixed(1)} km fagaata`,
};
const directionsLabel = { en: 'Get Directions', am: 'አቅጣጫ ያግኙ', om: 'Qajeelfama Argadhu' };
const nearestLabel = { en: 'Nearest:', am: 'ቅርብ:', om: 'Dhiyoo:' };

export default function NearbyFacilitiesMap({ riskLevel }) {
  const { lang } = useLanguage();
  const [userPos, setUserPos] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Default center: Addis Ababa
  const defaultCenter = { lat: 9.0222, lng: 38.7468 };

  const locate = () => {
    setLocating(true);
    setLocationError(false);
    if (!navigator.geolocation) {
      setLocationError(true);
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(p);
        const nearest = getNearestFacilities(p.lat, p.lng, 6);
        setFacilities(nearest);
        setSelectedFacility(nearest[0]);
        setLocating(false);
      },
      () => {
        // Fallback to Addis Ababa area
        const fallback = defaultCenter;
        setUserPos(fallback);
        const nearest = getNearestFacilities(fallback.lat, fallback.lng, 6);
        setFacilities(nearest);
        setSelectedFacility(nearest[0]);
        setLocationError(true);
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => { locate(); }, []);

  const center = userPos || defaultCenter;

  const urgencyColors = { mild: 'border-green-400', moderate: 'border-amber-400', severe: 'border-red-500' };

  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${urgencyColors[riskLevel] || 'border-border'}`}>
      {/* Map */}
      <div className="h-72 sm:h-80 w-full relative">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userPos && (
            <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
              <Popup>
                {lang === 'am' ? 'አሁን ያለህበት ቦታ' : lang === 'om' ? 'Bakka Amma Jirtan' : 'Your Location'}
              </Popup>
            </Marker>
          )}
          {facilities.map((f) => (
            <Marker
              key={f.id}
              position={[f.lat, f.lng]}
              icon={f.type === 'hospital' ? hospitalIcon : clinicIcon}
              eventHandlers={{ click: () => setSelectedFacility(f) }}
            >
              <Popup>
                <div className="text-sm font-semibold">{getLocalizedName(f, lang)}</div>
                <div className="text-xs text-gray-500">{getTypeLabel(f.type, lang)}</div>
                {f.distance != null && (
                  <div className="text-xs text-green-700 font-medium mt-1">
                    {distanceLabel[lang]?.(f.distance) || `${f.distance.toFixed(1)} km`}
                  </div>
                )}
              </Popup>
            </Marker>
          ))}
          {userPos && facilities.length > 0 && (
            <FitBounds userPos={userPos} facilities={facilities} />
          )}
        </MapContainer>
        {locating && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[999]">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Facility list */}
      <div className="bg-card p-4 space-y-2">
        {locationError && (
          <p className="text-xs text-amber-600 mb-2 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {lang === 'am' ? 'ቦታ ሊታወቅ አልቻለም — ነባሪ ቦታ (አዲስ አበባ) ጥቅም ላይ ዋለ' 
              : lang === 'om' ? 'Bakki hin argamne — Fayyadama Addis Ababa bu\'uuraa' 
              : 'Location unavailable — showing Addis Ababa area'}
          </p>
        )}
        {selectedFacility && (
          <div className="bg-primary/5 rounded-xl p-3 border border-primary/20 mb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                  {nearestLabel[lang] || nearestLabel.en}
                </p>
                <p className="font-bold text-base leading-tight">{getLocalizedName(selectedFacility, lang)}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground">{getTypeLabel(selectedFacility.type, lang)}</span>
                  {selectedFacility.distance != null && (
                    <span className="text-xs font-semibold text-primary">
                      📍 {distanceLabel[lang]?.(selectedFacility.distance)}
                    </span>
                  )}
                </div>
                {selectedFacility.phone && (
                  <a href={`tel:${selectedFacility.phone}`} className="flex items-center gap-1 text-xs text-primary mt-1 hover:underline">
                    <Phone className="h-3 w-3" /> {selectedFacility.phone}
                  </a>
                )}
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.lat},${selectedFacility.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="gap-1 shrink-0">
                  <Navigation className="h-3.5 w-3.5" />
                  {directionsLabel[lang] || directionsLabel.en}
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* Other nearby */}
        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
          {facilities.filter(f => f.id !== selectedFacility?.id).map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFacility(f)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base">{f.type === 'hospital' ? '🏥' : '🏨'}</span>
                <span className="text-sm font-medium truncate">{getLocalizedName(f, lang)}</span>
              </div>
              {f.distance != null && (
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {f.distance.toFixed(1)} km
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
