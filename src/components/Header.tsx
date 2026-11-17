import React from 'react';
import { ScreenId } from '../types/pharmacy';
import { PWAInstallButton } from './PWAInstallButton';
import { useDutySchedule } from '../context/DutyScheduleContext';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  const { formattedTime, formattedDate, shiftStatus } = useDutySchedule();

  const navItems: { id: ScreenId; label: string; shortLabel: string; icon: string }[] = [
    {
      id: 'accueil-garde',
      label: 'Accueil & Garde',
      shortLabel: 'Garde 24h',
      icon: 'local_pharmacy',
    },
    {
      id: 'toutes-les-pharmacies',
      label: 'Toutes les pharmacies',
      shortLabel: 'Officines',
      icon: 'format_list_bulleted',
    },
    {
      id: 'urgences-samu-tivaouane',
      label: 'Urgences & SAMU',
      shortLabel: 'Urgences',
      icon: 'e911_emergency',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf8ff]/95 backdrop-blur-xl border-b border-gray-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Main Mobile App Bar (Compact 56px) */}
      <div className="h-14 sm:h-16 w-full max-w-[1200px] mx-auto px-3.5 sm:px-6 flex items-center justify-between gap-2">
        {/* Brand App Identity */}
        <button
          onClick={() => onNavigate('accueil-garde')}
          className="flex items-center gap-1.5 sm:gap-2.5 text-left focus:outline-none group active:scale-98 transition-transform shrink-0"
        >
          {/* Logo PHARma tiv */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#005238] via-[#006948] to-[#009968] p-1 flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-500/20 shrink-0 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 sm:w-7 sm:h-7" xmlns="http://www.w3.org/2000/svg">
              <rect x="13" y="5" width="6" height="22" rx="3" fill="white" />
              <rect x="5" y="13" width="22" height="6" rx="3" fill="white" />
              <circle cx="16" cy="16" r="3.6" fill="#85f8c4" />
              <path d="M8 16h4l1.5-2.5 1.5 5 1.5-3.5 1 1h4.5" stroke="#006948" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex items-center min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center tracking-tight font-['Outfit',sans-serif]">
                <span className="text-base sm:text-xl font-black text-[#006948] tracking-tight">
                  Pharma
                </span>
                <span className="ml-1 sm:ml-1.5 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-gradient-to-r from-[#005238] to-[#006948] text-white text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-xs">
                  tiv
                </span>
              </div>
            </div>
          </div>
        </button>

        {/* Right Mobile Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* PWA Install Button */}
          <PWAInstallButton compact />

          {/* Horloge en direct nettement cadrée et parfaitement contenue */}
          <div
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-emerald-50/95 border-2 border-[#006948] shadow-sm select-none shrink-0"
            title={`Horloge en direct : ${formattedTime} GMT — ${formattedDate}`}
          >
            <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-[#006948] text-white shrink-0 shadow-2xs">
              <span className="material-symbols-outlined text-[13px] sm:text-[15px] animate-pulse">
                schedule
              </span>
            </div>
            <div className="flex flex-col justify-center text-left leading-tight min-w-0">
              <div className="flex items-center gap-1 whitespace-nowrap leading-none">
                <span className="font-mono text-[11px] sm:text-xs font-black text-gray-900 tracking-tight">
                  {formattedTime}
                </span>
                <span className="text-[7.5px] sm:text-[8.5px] font-black text-white bg-[#006948] px-1 py-0.2 rounded uppercase leading-none">
                  GMT
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-bold text-[#006948] whitespace-nowrap leading-none mt-0.5">
                {shiftStatus.isNightShift ? 'Garde de Nuit' : 'Garde de Jour'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Native-App Segmented Control Bar */}
      <div className="w-full max-w-[1200px] mx-auto px-3 sm:px-6 pb-2.5 pt-0.5">
        <nav
          className="grid grid-cols-3 gap-1 p-1 bg-[#eaedff]/70 rounded-2xl border border-gray-200/50 shadow-inner"
          aria-label="Navigation principale"
        >
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex items-center justify-center gap-1.5 py-2 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all duration-150 select-none active:scale-98 ${
                  isActive
                    ? 'bg-[#006948] text-white shadow-xs'
                    : 'text-[#3d4a42] hover:bg-white/60 hover:text-gray-900'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[17px] sm:text-[18px] shrink-0 ${
                    isActive ? 'text-[#85f8c4]' : 'text-gray-500'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">
                  <span className="inline sm:hidden">{item.shortLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
                {item.id === 'accueil-garde' && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isActive ? 'bg-[#85f8c4]' : 'bg-[#006948]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
