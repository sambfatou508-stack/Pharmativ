import React from 'react';
import { ScreenId } from '../types/pharmacy';

interface FooterProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#f2f3ff] text-[#131b2e] mt-16 border-t border-[#dae2fd]">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: PHARma tiv */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#005238] via-[#006948] to-[#009968] p-1 flex items-center justify-center text-white shadow-xs">
                <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <rect x="13" y="5" width="6" height="22" rx="3" fill="white" />
                  <rect x="5" y="13" width="22" height="6" rx="3" fill="white" />
                  <circle cx="16" cy="16" r="3.6" fill="#85f8c4" />
                  <path d="M8 16h4l1.5-2.5 1.5 5 1.5-3.5 1 1h4.5" stroke="#006948" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex items-center tracking-tight font-['Outfit',sans-serif]">
                <span className="text-lg font-black text-[#006948] tracking-tight">Pharma</span>
                <span className="ml-1.5 px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#005238] to-[#006948] text-white text-[11px] font-black tracking-widest uppercase">
                  tiv
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#3d4a42] leading-relaxed">
              Plateforme citoyenne des officines et pharmacies de garde en temps réel. Accessible 24h/24 pour tous les résidents,
              pèlerins du Gamou et visiteurs de Tivaouane.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#006a61] mt-1">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Sous égide du Ministère de la Santé</span>
            </div>
          </div>

          {/* Col 2: Urgences 24/7 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-[#131b2e]">Urgences 24/7</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-center justify-between p-2 rounded-lg bg-[#eaedff]">
                <span className="text-[#3d4a42] font-medium">SAMU National</span>
                <a className="text-[#ba1a1a] font-bold hover:underline" href="tel:1515">
                  1515
                </a>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-[#eaedff]">
                <span className="text-[#3d4a42] font-medium">Sapeurs-Pompiers (Tivaouane)</span>
                <a className="text-[#ba1a1a] font-bold hover:underline" href="tel:18">
                  18
                </a>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-[#eaedff]">
                <span className="text-[#3d4a42] font-medium">Hôpital Dabakh Standard</span>
                <a className="text-[#006948] font-bold hover:underline" href="tel:339551122">
                  33 955 11 22
                </a>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-[#eaedff]">
                <span className="text-[#3d4a42] font-medium">Commissariat de Police</span>
                <a className="text-[#131b2e] font-bold hover:underline" href="tel:17">
                  17
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation Rapide */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-[#131b2e]">Navigation Rapide</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#3d4a42] font-medium">
              <li>
                <button
                  onClick={() => onNavigate('accueil-garde')}
                  className="hover:text-[#006948] text-left transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#006948]">chevron_right</span>
                  Pharmacie de garde active
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('toutes-les-pharmacies')}
                  className="hover:text-[#006948] text-left transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#006948]">chevron_right</span>
                  Répertoire géolocalisé des officines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('urgences-samu-tivaouane')}
                  className="hover:text-[#006948] text-left transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#006948]">chevron_right</span>
                  Centres de santé & Hôpitaux
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Partenaires de Santé */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-[#131b2e]">Partenaires de Santé</h3>
            <ul className="space-y-2 text-xs text-[#3d4a42]">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#006948]">apartment</span>
                <span>Ministère de la Santé et de l'Action Sociale</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#006948]">medical_services</span>
                <span>Ordre National des Pharmaciens du Sénégal</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#006948]">local_hospital</span>
                <span>Hôpital Mame Abdou Aziz Sy Dabakh</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#006948]">location_city</span>
                <span>District Sanitaire de Tivaouane</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#dae2fd] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#3d4a42]">
          <p>© 2025-2026 Ville Sainte de Tivaouane • Service d'Utilité Publique et d'Information Pharmaceutique d'Urgence.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#825100] font-semibold">Horaires de garde : 20h00 à 08h00 & Week-ends</span>
            <span className="text-gray-300">•</span>
            <span className="hover:text-[#006948] cursor-pointer">Mentions Légales</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
