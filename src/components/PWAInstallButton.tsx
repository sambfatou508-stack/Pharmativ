import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'pc'>('android');

  // If already installed as a standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleClick = () => {
    // If native browser prompt is available and user is on Android/Desktop, trigger install directly
    // but still allow opening guide if preferred, or open the detailed installation guide modal
    if (isInstallable) {
      install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {/* Install Button with Download Icon and Clear Label */}
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-1 rounded-lg border border-[#006948]/25 bg-emerald-50/70 hover:bg-emerald-100 text-[#006948] font-bold shadow-2xs active:scale-95 transition-all select-none shrink-0 ${
          compact ? 'h-7 w-7 sm:w-auto sm:px-2 py-0.5 text-[10px] sm:text-[11px]' : 'px-2.5 py-1 text-xs'
        }`}
        title="Comment installer l'application sur votre téléphone ou PC"
        aria-label="Installer l'application"
      >
        <span className="material-symbols-outlined text-[15px] sm:text-[14px] text-[#006948]">
          download
        </span>
        <span className="hidden sm:inline whitespace-nowrap leading-none">Installer</span>
      </button>

      {/* Installation Guide Modal Dialog */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Fermer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Header with App Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#006948] to-[#00855d] flex items-center justify-center text-white shadow-md shrink-0">
                <span className="material-symbols-outlined text-[26px]">download</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                  Installer l'application
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Tivaouane Santé • Accès 100% Hors-Ligne & 24h/24
                </p>
              </div>
            </div>

            {/* Platform Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-xl mb-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('android')}
                className={`py-2 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                  activeTab === 'android'
                    ? 'bg-white text-[#006948] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">android</span>
                <span>Android</span>
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`py-2 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                  activeTab === 'ios'
                    ? 'bg-white text-[#006948] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
                <span>iPhone / iOS</span>
              </button>
              <button
                onClick={() => setActiveTab('pc')}
                className={`py-2 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                  activeTab === 'pc'
                    ? 'bg-white text-[#006948] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">computer</span>
                <span>PC / Mac</span>
              </button>
            </div>

            {/* Step-by-step instructions based on platform */}
            <div className="space-y-3 bg-[#faf8ff] p-4 rounded-2xl border border-gray-200/70 text-xs text-gray-700">
              {activeTab === 'android' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      Ouvrez le menu de votre navigateur Chrome en appuyant sur les <strong>trois points verticaux (⋮)</strong> en haut à droite.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      Sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      Confirmez en cliquant sur <strong>Installer</strong>. L'icône de l'app apparaîtra parmi vos applications et fonctionnera même sans connexion Internet !
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'ios' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      Dans Safari, touchez le bouton <strong>Partager</strong> <span className="inline-block px-1.5 py-0.5 bg-gray-200 rounded text-[10px] font-bold">⎋ / Share</span> situé en bas de l'écran.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      Faites défiler le menu d'options vers le bas et sélectionnez <strong>« Sur l'écran d'accueil »</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      Touchez <strong>Ajouter</strong> en haut à droite. L'application est installée directement sans passer par l'App Store !
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'pc' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      Dans Google Chrome ou Microsoft Edge, regardez à droite de la <strong>barre d'adresse</strong> (en haut de l'écran).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      Cliquez sur la petite icône d'ordinateur ou d'installation <strong>« Installer Tivaouane Santé »</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      Validez l'installation pour ouvrir l'application dans sa propre fenêtre indépendante.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Key Advantages */}
            <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1 text-[#006948] font-bold">
                <span className="material-symbols-outlined text-[14px]">offline_pin</span>
                100% Hors-ligne
              </span>
              <span>Ultra-légère (&lt; 2 Mo)</span>
              <span>Gratuit sans pub</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center gap-2">
              {isInstallable && (
                <button
                  onClick={() => {
                    install();
                    setShowGuide(false);
                  }}
                  className="flex-1 rounded-2xl bg-[#006948] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#00855d] active:scale-95 transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Installer maintenant</span>
                </button>
              )}
              <button
                onClick={() => setShowGuide(false)}
                className={`rounded-2xl border border-gray-200 py-2.5 px-4 text-xs font-bold text-gray-700 hover:bg-gray-100 transition ${
                  isInstallable ? '' : 'w-full bg-[#006948] text-white hover:bg-[#00855d]'
                }`}
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
