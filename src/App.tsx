import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, Pharmacy } from './types/pharmacy';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PharmacyModal } from './components/PharmacyModal';
import { GardeScreen } from './components/screens/GardeScreen';
import { AnnuaireScreen } from './components/screens/AnnuaireScreen';
import { UrgencesScreen } from './components/screens/UrgencesScreen';
import { DutyScheduleProvider } from './context/DutyScheduleContext';
import { initAnalytics, trackPageView } from './services/analytics';
import { updatePageSEO } from './services/seo';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('accueil-garde');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const titles: Record<ScreenId, string> = {
      'accueil-garde': 'Pharmacies de Garde Tivaouane',
      'toutes-les-pharmacies': 'Annuaire Toutes les Pharmacies Tivaouane',
      'urgences-samu-tivaouane': 'Urgences & SAMU Tivaouane',
    };
    updatePageSEO(currentScreen);
    trackPageView(titles[currentScreen] || 'PHARma tiv', `/#${currentScreen}`);
  }, [currentScreen]);

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DutyScheduleProvider>
      <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e]">
        {/* Offline status notification */}
        <OfflineIndicator />

        {/* Persistent Navigation Header with live clock */}
        <Header currentScreen={currentScreen} onNavigate={handleNavigate} />

        {/* Main Content Area with Header offset */}
        <main className="flex-1 pt-26 sm:pt-28 pb-12">
          <AnimatePresence mode="wait">
            {currentScreen === 'accueil-garde' && (
              <motion.div
                key="accueil-garde"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <GardeScreen
                  onOpenDetails={(pharmacy) => setSelectedPharmacy(pharmacy)}
                  onNavigate={handleNavigate}
                />
              </motion.div>
            )}

            {currentScreen === 'toutes-les-pharmacies' && (
              <motion.div
                key="toutes-les-pharmacies"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <AnnuaireScreen onOpenDetails={(pharmacy) => setSelectedPharmacy(pharmacy)} />
              </motion.div>
            )}

            {currentScreen === 'urgences-samu-tivaouane' && (
              <motion.div
                key="urgences-samu-tivaouane"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <UrgencesScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Pharmacy Details & Prescription Inquirer Modal */}
        <PharmacyModal
          pharmacy={selectedPharmacy}
          onClose={() => setSelectedPharmacy(null)}
        />

        {/* Comprehensive Municipal Health Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>
    </DutyScheduleProvider>
  );
}
