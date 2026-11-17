import React from 'react';
import { Pharmacy } from '../types/pharmacy';
import { trackPharmacyCall, trackPharmacyWhatsApp, trackPharmacyDirections } from '../services/analytics';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onOpenDetails: (pharmacy: Pharmacy) => void;
  onSelectMap?: (pharmacy: Pharmacy) => void;
  isNearest?: boolean;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  onOpenDetails,
  onSelectMap,
  isNearest = false,
}) => {
  const isGarde = pharmacy.isGardeToday;

  // WhatsApp prefilled message
  const whatsappUrl = `https://wa.me/${pharmacy.whatsapp.replace('+', '')}?text=${encodeURIComponent(
    `Bonjour ${pharmacy.name}, je vous contacte via PHARma tiv pour vérifier la disponibilité d’un médicament d'urgence.`
  )}`;

  // Google Maps navigation
  const gpsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.coordinates.lat},${pharmacy.coordinates.lng}&destination_place_id=${encodeURIComponent(
    pharmacy.name + ' Tivaouane'
  )}`;

  return (
    <div
      className={`relative bg-white rounded-2xl p-5 md:p-6 shadow-sm border transition-all duration-200 hover:shadow-md ${
        isNearest
          ? 'border-[#006948] ring-2 ring-[#006948]/30 bg-gradient-to-br from-emerald-50/40 via-white to-[#faf8ff]'
          : isGarde
          ? 'border-[#006948]/30 ring-1 ring-[#006948]/20 bg-gradient-to-br from-white to-[#faf8ff]'
          : 'border-gray-200/80 hover:border-gray-300'
      }`}
    >
      {/* Top badges bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {isNearest && (
            <span className="px-2.5 py-1 rounded-full bg-[#006948] text-white text-xs font-black shadow-xs flex items-center gap-1.5 animate-pulse">
              <span className="material-symbols-outlined text-[14px]">near_me</span>
              La plus proche ({pharmacy.distanceDisplay})
            </span>
          )}

          {isGarde ? (
            <span className="px-2.5 py-1 rounded-full bg-[#006948]/10 text-[#006948] text-xs font-extrabold tracking-wide uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse"></span>
              {pharmacy.gardeType || 'GARDE ACTIVE'}
            </span>
          ) : pharmacy.isOpenNow ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Ouvert maintenant
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {pharmacy.statusText.split('•')[0]}
            </span>
          )}

          {pharmacy.gardeBadgeText && (
            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
              {pharmacy.gardeBadgeText}
            </span>
          )}
        </div>

        {/* Distance indicator */}
        <div className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
          <span className="material-symbols-outlined text-[16px] text-[#006948]">near_me</span>
          <span>{pharmacy.distanceDisplay}</span>
        </div>
      </div>

      {/* Main Title & Actionable Icon */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3
            onClick={() => onOpenDetails(pharmacy)}
            className="text-lg md:text-xl font-bold text-gray-900 hover:text-[#006948] cursor-pointer transition-colors leading-tight"
          >
            {pharmacy.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-gray-400 shrink-0">location_on</span>
            <span>{pharmacy.address}</span>
          </p>
        </div>

        <button
          onClick={() => onOpenDetails(pharmacy)}
          className="w-9 h-9 rounded-xl bg-[#f2f3ff] text-[#006948] hover:bg-[#006948] hover:text-white flex items-center justify-center transition-colors shrink-0"
          title="Fiche détaillée"
        >
          <span className="material-symbols-outlined text-[20px]">local_pharmacy</span>
        </button>
      </div>

      {/* Titulaire & Schedule bar */}
      <div className="my-3 p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="material-symbols-outlined text-[16px] text-gray-500">person</span>
          <span>Titulaire : <strong className="text-gray-900">{pharmacy.titulaire}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-700">
          <span className="material-symbols-outlined text-[16px] text-[#006948]">schedule</span>
          <span>{pharmacy.gardeRelieveInfo || pharmacy.openingHours}</span>
        </div>
      </div>

      {/* Service Tags */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5">
        {pharmacy.tags.map((tag, i) => (
          <span
            key={i}
            className="px-2.5 py-1 rounded-lg bg-[#faf8ff] text-[#3d4a42] text-[11px] md:text-xs font-semibold border border-gray-200/60"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons: Petits Boutons Compacts (Call, WhatsApp, GPS) */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 pt-1">
        <a
          href={`tel:${pharmacy.phone}`}
          onClick={() => trackPharmacyCall(pharmacy.name, pharmacy.phone)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-[#006948] text-white font-bold text-xs shadow-2xs hover:bg-[#005238] active:scale-95 transition-all text-center whitespace-nowrap"
          title={`Appeler ${pharmacy.name} (${pharmacy.phoneDisplay})`}
        >
          <span className="material-symbols-outlined text-[15px]">call</span>
          <span>Appeler</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackPharmacyWhatsApp(pharmacy.name)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-50 text-[#006a61] border border-[#006a61]/25 font-bold text-xs hover:bg-[#006a61] hover:text-white active:scale-95 transition-all text-center whitespace-nowrap"
          title={`Écrire sur WhatsApp à ${pharmacy.name}`}
        >
          <span className="material-symbols-outlined text-[15px]">chat</span>
          <span>WhatsApp</span>
        </a>

        <a
          href={gpsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackPharmacyDirections(pharmacy.name);
            if (onSelectMap) {
              onSelectMap(pharmacy);
            }
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-gray-100 text-gray-800 border border-gray-200/80 font-bold text-xs hover:bg-[#eaedff] hover:text-[#006948] hover:border-[#006948]/30 active:scale-95 transition-all text-center whitespace-nowrap"
          title="Ouvrir l'itinéraire Google Maps"
        >
          <span className="material-symbols-outlined text-[15px] text-[#006948]">near_me</span>
          <span>Itinéraire</span>
        </a>
      </div>
    </div>
  );
};
