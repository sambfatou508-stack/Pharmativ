import React, { useState, useEffect } from 'react';
import { Pharmacy, ScreenId } from '../../types/pharmacy';
import { PharmacyCard } from '../PharmacyCard';
import { InteractiveMap } from '../InteractiveMap';
import { useDutySchedule } from '../../context/DutyScheduleContext';
import { estimateTravelTime, findNearestPharmacy } from '../../utils/geo';

interface GardeScreenProps {
  onOpenDetails: (pharmacy: Pharmacy) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const GardeScreen: React.FC<GardeScreenProps> = ({ onOpenDetails, onNavigate }) => {
  const {
    dutyPharmacies,
    shiftStatus,
    formattedDate,
    isLive,
    dayOffset,
    userLocation,
    isLocating,
    locationError,
    nearestDutyPharmacy,
    requestUserLocation,
    clearUserLocation,
  } = useDutySchedule();

  const [selectedMapPharmacy, setSelectedMapPharmacy] = useState<Pharmacy | null>(null);

  // Automatically select nearest pharmacy on map when position is shared
  useEffect(() => {
    if (nearestDutyPharmacy && !selectedMapPharmacy) {
      setSelectedMapPharmacy(nearestDutyPharmacy);
    }
  }, [nearestDutyPharmacy]);

  const handleLocateNearest = async () => {
    const coords = await requestUserLocation();
    if (coords) {
      const nearest = findNearestPharmacy(dutyPharmacies, coords);
      if (nearest) {
        setSelectedMapPharmacy(nearest);
      }
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-8 space-y-8">
      {/* Hero Section */}
      <section className="w-full">
        {/* Hero Card */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col justify-between relative">
          <div>
            {/* Top Green Date Pill */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#006948]/10 text-[#006948] text-xs font-extrabold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006948] animate-ping"></span>
                {shiftStatus.isNightShift ? 'Garde de Nuit Active' : 'Garde de Jour Active'}
              </span>
              <span className="text-xs text-gray-700 font-semibold">
                Tour officiel : <strong className="text-gray-900">{formattedDate}</strong>{!isLive ? ` (Simulation ${dayOffset > 0 ? `+${dayOffset}j` : `${dayOffset}j`})` : ''}
              </span>
            </div>

            {/* Sub-eyebrow */}
            <h2 className="text-xs font-bold tracking-widest text-[#006948] uppercase mb-1.5">
              VILLE SAINTE DE TIVAOUANE — SERVICE MÉDICAL D’URGENCE
            </h2>

            {/* Main Headline */}
            <h1 className="font-['El_Messiri',serif] text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-950 tracking-tight leading-snug mb-4">
              Dalal ak jamm ci
              <br />
              Pharma tiv
            </h1>

            {/* Explanatory subtitle */}
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 max-w-3xl">
              Chaque jour, 3 officines réparties stratégiquement (Hôpital Dabakh, Cœur Religieux et Axe RN2) sont
              mobilisées pour garantir une couverture continue 24h/24 aux résidents et pèlerins.
            </p>
          </div>

          {/* GPS Action */}
          <div>
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 mb-2">
              <button
                onClick={handleLocateNearest}
                disabled={isLocating}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-sm shrink-0 ${
                  userLocation
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white ring-2 ring-emerald-300'
                    : 'bg-[#006948] hover:bg-[#00855d] text-white'
                } disabled:opacity-60`}
                title={userLocation ? 'Actualiser votre position GPS' : 'Localiser la pharmacie la plus proche'}
              >
                <span className={`material-symbols-outlined text-[18px] ${isLocating ? 'animate-spin' : ''}`}>
                  {isLocating ? 'progress_activity' : userLocation ? 'my_location' : 'near_me'}
                </span>
                <span>
                  {isLocating
                    ? 'Calcul GPS...'
                    : userLocation
                    ? 'Position active (Actualiser)'
                    : 'Localiser la plus proche'}
                </span>
              </button>
            </div>

            {/* GPS Feedback & active badge status */}
            {userLocation && (
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 px-3.5 mb-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-[#006948]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="font-semibold">
                    Position GPS partagée • <strong>Pharmacies triées par distance réelle</strong> sur la carte
                  </span>
                </div>
                <button
                  onClick={clearUserLocation}
                  className="text-[11px] font-bold text-emerald-800 hover:text-red-700 underline"
                  title="Effacer la position GPS"
                >
                  Désactiver GPS
                </button>
              </div>
            )}

            {locationError && (
              <div className="p-3 mb-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0">location_disabled</span>
                  <span>{locationError}</span>
                </div>
                <button
                  onClick={handleLocateNearest}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px] shrink-0 hover:bg-amber-700"
                >
                  Réessayer
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Grid: On-Duty Pharmacies + Interactive Map */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List of 3 Duty Pharmacies */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#006948]"></span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Officines de garde ce jour ({dutyPharmacies.length})
              </h2>
            </div>
            <div className="text-xs text-gray-500 font-medium hidden sm:block">
              {shiftStatus.nextSwitchLabel}
            </div>
          </div>

          {/* Nearest Pharmacy GPS Recommendation Card */}
          {userLocation && nearestDutyPharmacy && (
            <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100/40 border-2 border-[#006948] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#006948] text-white flex items-center justify-center shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-[20px]">near_me</span>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-black uppercase text-[#006948] tracking-wider flex items-center gap-1.5">
                      <span>Officine la plus proche de votre position</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-gray-950 leading-tight">
                      {nearestDutyPharmacy.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-xs">
                    📍 {nearestDutyPharmacy.distanceDisplay}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-700 bg-white/90 p-2.5 rounded-xl border border-emerald-100">
                <span className="flex items-center gap-1 font-bold text-[#006948]">
                  <span className="material-symbols-outlined text-[16px]">directions_walk</span>
                  {estimateTravelTime(nearestDutyPharmacy.distanceMeters).summary}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600 truncate">{nearestDutyPharmacy.address}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => {
                    setSelectedMapPharmacy(nearestDutyPharmacy);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#006948] text-white font-bold text-xs hover:bg-[#005238] transition shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  <span>Voir sur la carte</span>
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${nearestDutyPharmacy.coordinates.lat},${nearestDutyPharmacy.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-100 text-[#006948] font-bold text-xs hover:bg-emerald-200 transition text-center"
                >
                  <span className="material-symbols-outlined text-[16px]">directions</span>
                  <span>Itinéraire GPS</span>
                </a>
                <a
                  href={`tel:${nearestDutyPharmacy.phone}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-100 text-gray-800 font-bold text-xs hover:bg-gray-200 transition text-center"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>{nearestDutyPharmacy.phoneDisplay}</span>
                </a>
              </div>
            </div>
          )}

          {dutyPharmacies.map((pharmacy) => (
            <PharmacyCard
              key={pharmacy.id}
              pharmacy={pharmacy}
              isNearest={nearestDutyPharmacy?.id === pharmacy.id}
              onOpenDetails={onOpenDetails}
              onSelectMap={(p) => setSelectedMapPharmacy(p)}
            />
          ))}

          {/* Quick link to all pharmacies */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs sm:text-sm font-bold text-gray-900">
                Vous recherchez une officine hors garde ?
              </div>
              <div className="text-xs text-gray-500">
                Consultez l'annuaire intégral des 10 pharmacies de Tivaouane.
              </div>
            </div>
            <button
              onClick={() => onNavigate('toutes-les-pharmacies')}
              className="px-4 py-2 rounded-xl bg-[#eaedff] text-[#006948] font-bold text-xs hover:bg-[#dae2fd] transition-colors"
            >
              Voir tout l'annuaire →
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Vector Map */}
        <div className="lg:col-span-5 sticky top-36">
          <InteractiveMap
            pharmacies={dutyPharmacies}
            selectedPharmacy={selectedMapPharmacy}
            onSelectPharmacy={(p) => setSelectedMapPharmacy(p)}
            onOpenDetails={onOpenDetails}
            userLocation={userLocation}
            onRequestLocate={handleLocateNearest}
          />
        </div>
      </section>

      {/* Regulated Rotation & Pricing Notice */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Cadre Réglementaire des Gardes à Tivaouane
            </h3>
            <p className="text-xs text-gray-500">
              Conformité avec les directives de l'Ordre National des Pharmaciens du Sénégal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-gray-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-gray-100">
            <strong className="block text-gray-900 font-bold mb-1">Rotations Quotidiennes</strong>
            Le tableau de garde tourne chaque jour à 20h00 pour la nuit et à 08h00 pour le jour, garantissant une
            disponibilité médicale ininterrompue.
          </div>
          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-gray-100">
            <strong className="block text-gray-900 font-bold mb-1">Prix Publics Homologués</strong>
            Les tarifs des médicaments dispensés de nuit sont strictement identiques aux prix de jour fixés par la
            Direction de la Pharmacie et du Médicament (DPM).
          </div>
          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-gray-100">
            <strong className="block text-gray-900 font-bold mb-1">Permanence d'Astreinte</strong>
            En cas de fermeture exceptionnelle du guichet de nuit, contactez la permanence SAMU (1515) ou la
            Police de Tivaouane (17).
          </div>
        </div>
      </section>
    </div>
  );
};
