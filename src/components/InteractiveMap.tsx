import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import { Pharmacy } from '../types/pharmacy';
import { trackPharmacyCall, trackPharmacyDirections, trackEvent } from '../services/analytics';

import { useDutySchedule } from '../context/DutyScheduleContext';

interface InteractiveMapProps {
  pharmacies: Pharmacy[];
  selectedPharmacyId?: string | null;
  selectedPharmacy?: Pharmacy | null;
  onSelectPharmacy?: (pharmacy: Pharmacy) => void;
  onOpenDetails?: (pharmacy: Pharmacy) => void;
  title?: string;
  badgeText?: string;
  showStrategicPoints?: boolean;
  userLocation?: { lat: number; lng: number } | null;
  onRequestLocate?: () => void;
}

const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyCk3Z1hERXtoHtotrINWO86aatPMOCbGdw';

// Tivaouane Coordinates (Centre-Ville)
const TIVAOUANE_CENTER = { lat: 14.9525, lng: -16.8265 };

// Strategic landmarks in Tivaouane
const LANDMARKS = [
  {
    id: 'hopital-dabakh',
    name: 'Hôpital Régional Mame Abdou Aziz Sy Dabakh',
    shortName: 'Hôpital Dabakh (SAU 24/24)',
    lat: 14.9548,
    lng: -16.8298,
    type: 'hospital',
    icon: 'local_hospital',
    color: '#ba1a1a',
  },
  {
    id: 'zawiya-tijane',
    name: 'Grande Mosquée & Zawiya Serigne Babacar Sy',
    shortName: 'Zawiya & Esplanade',
    lat: 14.9508,
    lng: -16.8228,
    type: 'religious',
    icon: 'mosque',
    color: '#825100',
  },
  {
    id: 'gare-routiere',
    name: 'Gare Routière de Tivaouane (RN2)',
    shortName: 'Gare Routière RN2',
    lat: 14.9405,
    lng: -16.8355,
    type: 'transport',
    icon: 'directions_bus',
    color: '#006a61',
  },
];

// Inner controller to pan/zoom when pharmacy selection or user GPS changes
const MapController: React.FC<{
  selectedPharmacy?: Pharmacy | null;
  userLocation?: { lat: number; lng: number } | null;
}> = ({ selectedPharmacy, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (userLocation && selectedPharmacy) {
      try {
        const g = (window as unknown as { google?: { maps?: { LatLngBounds?: new () => any } } }).google;
        if (g?.maps?.LatLngBounds) {
          const bounds = new g.maps.LatLngBounds();
          bounds.extend(userLocation);
          bounds.extend({
            lat: selectedPharmacy.coordinates.lat,
            lng: selectedPharmacy.coordinates.lng,
          });
          map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
          return;
        }
      } catch (e) {
        console.warn('Error adjusting bounds:', e);
      }
    }

    if (selectedPharmacy) {
      map.panTo({
        lat: selectedPharmacy.coordinates.lat,
        lng: selectedPharmacy.coordinates.lng,
      });
      map.setZoom(16);
    } else if (userLocation) {
      map.panTo(userLocation);
      map.setZoom(15);
    }
  }, [map, selectedPharmacy, userLocation]);

  return null;
};

// Sub-component for each pharmacy marker with anchored InfoWindow
const PharmacyMarker: React.FC<{
  pharmacy: Pharmacy;
  index: number;
  isSelected: boolean;
  onSelect: (p: Pharmacy) => void;
  onOpenDetails?: (p: Pharmacy) => void;
}> = ({ pharmacy, index, isSelected, onSelect, onOpenDetails }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isSelected) {
      setIsOpen(true);
    }
  }, [isSelected]);

  const handleMarkerClick = () => {
    setIsOpen((prev) => !prev);
    onSelect(pharmacy);
  };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: pharmacy.coordinates.lat, lng: pharmacy.coordinates.lng }}
        title={`${pharmacy.name} - ${pharmacy.address}`}
        onClick={handleMarkerClick}
      >
        <div className="relative group cursor-pointer select-none">
          <Pin
            background={pharmacy.isGardeToday ? '#006948' : '#00855d'}
            borderColor="#ffffff"
            glyphColor="#ffffff"
            scale={isSelected ? 1.25 : 1.05}
          >
            <span className="text-white text-[11px] font-black">{index + 1}</span>
          </Pin>

          {/* Pulsing halo for active on-duty pharmacies */}
          {pharmacy.isGardeToday && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-white animate-ping pointer-events-none" />
          )}

          {/* Quick badge below pin */}
          <div
            className={`mt-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold shadow-sm whitespace-nowrap border transition-all ${
              isSelected
                ? 'bg-gray-900 text-white border-gray-900 scale-105'
                : pharmacy.isGardeToday
                ? 'bg-emerald-800 text-white border-emerald-700'
                : 'bg-white/95 text-gray-800 border-gray-200'
            }`}
          >
            {pharmacy.name.replace('Pharmacie', 'Ph.').slice(0, 15)}
          </div>
        </div>
      </AdvancedMarker>

      {isOpen && marker && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setIsOpen(false)}
          headerContent={
            <div className="font-bold text-xs sm:text-sm text-gray-900 pr-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{pharmacy.name}</span>
            </div>
          }
        >
          <div className="p-1 min-w-[210px] max-w-[260px] text-left space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  pharmacy.isGardeToday
                    ? 'bg-emerald-100 text-[#006948]'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {pharmacy.isGardeToday ? '🟢 De Garde 24h/24' : 'Ouvert'}
              </span>
              <span className="text-[10px] text-gray-500 font-semibold">
                • {pharmacy.distanceDisplay}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-snug line-clamp-2">
              {pharmacy.address}
            </p>

            <div className="pt-1 flex items-center gap-1.5">
              <a
                href={`tel:${pharmacy.phone}`}
                onClick={() => trackPharmacyCall(pharmacy.name, pharmacy.phone)}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#006948] text-white text-[11px] font-bold shadow-xs hover:bg-[#005238] transition"
              >
                <span className="material-symbols-outlined text-[14px]">call</span>
                <span>Appeler</span>
              </a>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.coordinates.lat},${pharmacy.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackPharmacyDirections(pharmacy.name)}
                className="flex items-center justify-center p-1.5 rounded-lg bg-emerald-50 text-[#006948] hover:bg-emerald-100 border border-[#006948]/20 transition"
                title="Ouvrir l'itinéraire Google Maps"
              >
                <span className="material-symbols-outlined text-[16px]">directions</span>
              </a>

              {onOpenDetails && (
                <button
                  onClick={() => onOpenDetails(pharmacy)}
                  className="flex items-center justify-center p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  title="Voir la fiche complète"
                >
                  <span className="material-symbols-outlined text-[16px]">info</span>
                </button>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

// Sub-component for landmark pins (Hospital, Mosque, etc.)
const LandmarkMarker: React.FC<{
  landmark: (typeof LANDMARKS)[0];
}> = ({ landmark }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: landmark.lat, lng: landmark.lng }}
        title={landmark.name}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="cursor-pointer group">
          <Pin background={landmark.color} borderColor="#ffffff" glyphColor="#ffffff" scale={0.9}>
            <span className="material-symbols-outlined text-[14px] text-white">
              {landmark.icon}
            </span>
          </Pin>
        </div>
      </AdvancedMarker>

      {isOpen && marker && (
        <InfoWindow anchor={marker} onCloseClick={() => setIsOpen(false)}>
          <div className="p-1 max-w-[200px] text-xs">
            <div className="font-bold text-gray-900">{landmark.shortName}</div>
            <div className="text-gray-500 text-[10px] mt-0.5">{landmark.name}</div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pharmacies,
  selectedPharmacyId,
  selectedPharmacy,
  onSelectPharmacy,
  onOpenDetails,
  title = 'Carte Google Maps en direct',
  badgeText = 'Positions réelles Tivaouane',
  showStrategicPoints = true,
  userLocation: propUserLocation,
  onRequestLocate,
}) => {
  const {
    userLocation: ctxUserLocation,
    isLocating,
    locationError: locatingError,
    requestUserLocation,
  } = useDutySchedule();

  const userLocation = propUserLocation !== undefined ? propUserLocation : ctxUserLocation;

  const currentSelectedId = selectedPharmacy ? selectedPharmacy.id : (selectedPharmacyId || null);
  const [activePin, setActivePin] = useState<string | null>(currentSelectedId);

  useEffect(() => {
    if (selectedPharmacy) {
      setActivePin(selectedPharmacy.id);
    } else if (selectedPharmacyId) {
      setActivePin(selectedPharmacyId);
    }
  }, [selectedPharmacy, selectedPharmacyId]);

  const handlePinSelect = (p: Pharmacy) => {
    setActivePin(p.id);
    if (onSelectPharmacy) {
      onSelectPharmacy(p);
    }
  };

  const handleLocateMe = () => {
    if (onRequestLocate) {
      onRequestLocate();
    } else {
      requestUserLocation();
    }
  };

  const activeSelectedPharmacy = pharmacies.find((p) => p.id === activePin) || selectedPharmacy || null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006948] text-[22px]">map</span>
          <div>
            <h3 className="text-sm md:text-base font-bold text-gray-900">{title}</h3>
            <p className="text-[11px] text-gray-500 hidden sm:block">
              Positions GPS réelles à Tivaouane • Google Maps Platform
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#006948] border border-[#006948]/20">
            {badgeText}
          </span>
        </div>
      </div>

      {/* Map Graphic Canvas with Real Google Maps */}
      <div className="p-3 sm:p-4">
        <div className="relative w-full h-[320px] md:h-[370px] rounded-2xl overflow-hidden bg-[#eaf1ec] border border-emerald-100 shadow-inner">
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map
              defaultCenter={TIVAOUANE_CENTER}
              defaultZoom={14}
              mapId={'bf51a910020fa25a'}
              gestureHandling={'greedy'}
              internalUsageAttributionIds={['gmp_git_agentskills_v1']}
              className="w-full h-full"
              fullscreenControl={false}
              streetViewControl={false}
              mapTypeControl={true}
              zoomControl={true}
            >
              <MapController
                selectedPharmacy={activeSelectedPharmacy}
                userLocation={userLocation}
              />

              {/* Real Pharmacy Markers */}
              {pharmacies.map((p, idx) => (
                <PharmacyMarker
                  key={p.id}
                  pharmacy={p}
                  index={idx}
                  isSelected={activePin === p.id}
                  onSelect={handlePinSelect}
                  onOpenDetails={onOpenDetails}
                />
              ))}

              {/* Strategic Landmark Pins */}
              {LANDMARKS.map((landmark) => (
                <LandmarkMarker key={landmark.id} landmark={landmark} />
              ))}

              {/* User location pin if enabled */}
              {userLocation && (
                <AdvancedMarker position={userLocation} title="Votre position actuelle">
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white shadow-lg animate-pulse" />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                      Vous êtes ici
                    </div>
                  </div>
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>

          {/* Floating Geolocation & Center Buttons */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-gray-200 text-gray-800 text-[11px] font-bold shadow-md hover:bg-white active:scale-95 transition disabled:opacity-50"
              title="Centrer sur ma position GPS"
            >
              <span
                className={`material-symbols-outlined text-[16px] text-[#006948] ${
                  isLocating ? 'animate-spin' : ''
                }`}
              >
                {isLocating ? 'progress_activity' : 'my_location'}
              </span>
              <span>{isLocating ? 'Recherche...' : 'Me localiser'}</span>
            </button>

            {locatingError && (
              <div className="bg-red-50 text-red-700 border border-red-200 text-[10px] p-1.5 rounded-lg shadow-sm">
                {locatingError}
              </div>
            )}
          </div>

          {/* Top-right real-time status pill */}
          <div className="absolute top-3 right-3 bg-[#006948] text-white px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
            <span>GPS ACTIF</span>
          </div>

          {/* Bottom quick pharmacy picker pills */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap gap-1.5 z-10 pointer-events-auto">
            {pharmacies.slice(0, 4).map((p, i) => (
              <button
                key={p.id}
                onClick={() => handlePinSelect(p)}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold shadow-md transition-all text-left flex items-center gap-1 border backdrop-blur-xs ${
                  activePin === p.id
                    ? 'bg-[#006948] text-white border-[#006948] ring-1 ring-white'
                    : 'bg-white/95 text-gray-800 hover:bg-white border-gray-200'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-black/10 flex items-center justify-center text-[9px] font-bold">
                  {i + 1}
                </span>
                <span className="truncate max-w-[110px] font-bold">
                  {p.name.replace('Pharmacie', 'Ph.')}
                </span>
                <span className="text-gray-500 font-normal">({p.distanceDisplay})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic bearings / Distances panel */}
      {showStrategicPoints && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-50">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Repères réels et distances calculées à Tivaouane :
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-gray-50">
              <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">
                local_hospital
              </span>
              <span className="font-medium">Hôpital Dabakh :</span>
              <span className="font-bold text-gray-900">50 m</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-gray-50">
              <span className="material-symbols-outlined text-[16px] text-[#825100]">
                mosque
              </span>
              <span className="font-medium">Zawiya Tijane :</span>
              <span className="font-bold text-gray-900">300 m</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-gray-50">
              <span className="material-symbols-outlined text-[16px] text-[#006a61]">
                directions_bus
              </span>
              <span className="font-medium">Gare Routière RN2 :</span>
              <span className="font-bold text-gray-900">1.8 km</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-gray-50">
              <span className="material-symbols-outlined text-[16px] text-[#006a61]">
                train
              </span>
              <span className="font-medium">Gare Ferroviaire :</span>
              <span className="font-bold text-gray-900">1.4 km</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

