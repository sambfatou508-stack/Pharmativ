import React, { useState } from 'react';
import { Pharmacy } from '../types/pharmacy';

interface PharmacyModalProps {
  pharmacy: Pharmacy | null;
  onClose: () => void;
}

export const PharmacyModal: React.FC<PharmacyModalProps> = ({ pharmacy, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState('');

  if (!pharmacy) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(pharmacy.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = prescriptionText.trim()
    ? `Bonjour ${pharmacy.name}, je voudrais savoir si vous avez en stock : "${prescriptionText}". Merci d'avance.`
    : `Bonjour ${pharmacy.name}, je vous contacte depuis PHARma tiv pour une urgence pharmaceutique.`;

  const whatsappLink = `https://wa.me/${pharmacy.whatsapp.replace('+', '')}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#006948] text-white flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[28px]">local_pharmacy</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {pharmacy.isGardeToday ? (
                <span className="px-2 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-[11px] font-extrabold uppercase">
                  De Garde Aujourd'hui
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium">
                  Officine Commune
                </span>
              )}
              <span className="text-xs text-gray-500 font-bold">{pharmacy.distanceDisplay}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{pharmacy.name}</h2>
            <p className="text-xs text-gray-500">{pharmacy.address}</p>
          </div>
        </div>

        {/* Pharmacist in charge */}
        <div className="mt-5 p-3 rounded-2xl bg-[#faf8ff] border border-gray-100 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Pharmacien titulaire :</span>
            <span className="font-bold text-gray-900">{pharmacy.titulaire}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Horaires de permanence :</span>
            <span className="font-semibold text-[#006948]">{pharmacy.openingHours}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Téléphone direct :</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-gray-900">{pharmacy.phoneDisplay}</span>
              <button
                onClick={handleCopyPhone}
                className="text-[11px] text-[#006948] hover:underline flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
          </div>
        </div>

        {/* Services & Facilities */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Équipements & Services d'Urgence
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50">
              <span className="material-symbols-outlined text-[18px] text-[#006948]">
                {pharmacy.hasOxygen ? 'check_circle' : 'cancel'}
              </span>
              <span className={pharmacy.hasOxygen ? 'font-semibold text-gray-800' : 'text-gray-400'}>
                Oxygène médical
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50">
              <span className="material-symbols-outlined text-[18px] text-[#006948]">
                {pharmacy.hasEmergencySupplies ? 'check_circle' : 'cancel'}
              </span>
              <span className={pharmacy.hasEmergencySupplies ? 'font-semibold text-gray-800' : 'text-gray-400'}>
                Sérums & Insulines
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50">
              <span className="material-symbols-outlined text-[18px] text-[#006948]">
                {pharmacy.hasVeterinary ? 'check_circle' : 'cancel'}
              </span>
              <span className={pharmacy.hasVeterinary ? 'font-semibold text-gray-800' : 'text-gray-400'}>
                Produits Vétérinaires
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50">
              <span className="material-symbols-outlined text-[18px] text-[#006948]">verified</span>
              <span className="font-semibold text-gray-800">Tiers-Payant / IPM</span>
            </div>
          </div>
        </div>

        {/* Mutuelles et Prises en charge */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Mutuelles & Assurances acceptées
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {pharmacy.acceptedInsurances.map((ins, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-[#eef0ff] text-[#006948] text-[11px] font-semibold"
              >
                {ins}
              </span>
            ))}
          </div>
        </div>

        {/* WhatsApp Prescription Inquirer */}
        <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
          <label className="block text-xs font-bold text-emerald-900 mb-1">
            Demander la disponibilité d'un médicament sur WhatsApp :
          </label>
          <input
            type="text"
            placeholder="Ex: Amoxicilline 500mg, Insuline Mixtard, Ventoline..."
            value={prescriptionText}
            onChange={(e) => setPrescriptionText(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006948]"
          />
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#006948] text-white text-xs font-bold hover:bg-[#00855d] transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>Envoyer la demande sur WhatsApp</span>
          </a>
        </div>

        {/* Actions Footer */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
          <a
            href={`tel:${pharmacy.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-[#006948] text-white font-bold text-xs md:text-sm hover:bg-[#00855d] transition shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>Appeler l'officine</span>
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.coordinates.lat},${pharmacy.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-gray-100 text-gray-800 font-bold text-xs md:text-sm hover:bg-gray-200 transition"
          >
            <span className="material-symbols-outlined text-[18px]">near_me</span>
            <span>Itinéraire GPS</span>
          </a>
        </div>
      </div>
    </div>
  );
};
