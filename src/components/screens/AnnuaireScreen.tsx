import React, { useState } from 'react';
import { Pharmacy } from '../../types/pharmacy';
import { PharmacyCard } from '../PharmacyCard';
import { InteractiveMap } from '../InteractiveMap';
import { useDutySchedule } from '../../context/DutyScheduleContext';

interface AnnuaireScreenProps {
  onOpenDetails: (pharmacy: Pharmacy) => void;
}

export const AnnuaireScreen: React.FC<AnnuaireScreenProps> = ({ onOpenDetails }) => {
  const { allPharmacies } = useDutySchedule();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedMapPharmacy, setSelectedMapPharmacy] = useState<Pharmacy | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const openCount = allPharmacies.filter((p) => p.isOpenNow).length;
  const gardeCount = allPharmacies.filter((p) => p.isGardeToday).length;

  const filters = [
    { id: 'all', label: 'Tous les critères' },
    { id: 'open', label: 'Ouverte maintenant' },
    { id: 'garde', label: 'De garde ce jour' },
    { id: 'ipm', label: 'IPM / Mutuelles' },
    { id: 'dabakh', label: 'Proche Hôpital Dabakh' },
    { id: 'oxygen', label: 'Oxygène médical' },
    { id: 'emergency', label: 'Sérums & Urgences' },
    { id: 'vet', label: 'Produits vétérinaires' },
  ];

  const filteredPharmacies = allPharmacies.filter((p) => {
    // Filter criteria
    if (activeFilter === 'open' && !p.isOpenNow) return false;
    if (activeFilter === 'garde' && !p.isGardeToday) return false;
    if (activeFilter === 'ipm' && p.acceptedInsurances.length === 0) return false;
    if (activeFilter === 'dabakh' && !p.quartier.toLowerCase().includes('hôpital') && !p.address.toLowerCase().includes('dabakh')) return false;
    if (activeFilter === 'oxygen' && !p.hasOxygen) return false;
    if (activeFilter === 'emergency' && !p.hasEmergencySupplies) return false;
    if (activeFilter === 'vet' && !p.hasVeterinary) return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.quartier.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query) ||
      p.titulaire.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query)) ||
      p.acceptedInsurances.some((i) => i.toLowerCase().includes(query))
    );
  });

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-8 space-y-8">
      {/* Top Banner / Stats Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006948]"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#006948]">
              Répertoire Officiel de la Commune
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Annuaire des pharmacies de Tivaouane
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
            Toutes les officines pharmaceutiques enregistrées auprès de la section régionale de l’Ordre National.
            Coordonnées directes, conventions IPM, stocks d’urgence et géolocalisation.
          </p>
        </div>

        {/* 3 Stats indicators */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center min-w-[90px]">
            <div className="text-xl sm:text-2xl font-black text-[#006948]">{openCount}</div>
            <div className="text-[10px] font-bold uppercase text-emerald-800">Ouvertes direct</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-center min-w-[90px]">
            <div className="text-xl sm:text-2xl font-black text-[#825100]">{gardeCount}</div>
            <div className="text-[10px] font-bold uppercase text-amber-800">Garde active</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#eaedff] border border-[#dae2fd] text-center min-w-[90px]">
            <div className="text-xl sm:text-2xl font-black text-[#006a61]">100%</div>
            <div className="text-[10px] font-bold uppercase text-gray-700">Géolocalisées</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Rechercher par nom d'officine, pharmacien, quartier, mutuelle (Sonatel, Senelec)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006948]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                Effacer
              </button>
            )}
          </div>

          {/* Toggle View (List vs Mobile Map) */}
          <div className="flex items-center p-1 bg-white rounded-2xl border border-gray-200 shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                viewMode === 'list'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">list</span>
              <span>Toutes ({allPharmacies.length})</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                viewMode === 'map'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>Voir la Carte</span>
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#006948]/50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Directory List + Map Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pharmacy Cards Column */}
        <div className={`${viewMode === 'map' ? 'hidden lg:block lg:col-span-7' : 'col-span-12 lg:col-span-7'} space-y-4`}>
          <div className="text-xs text-gray-500 font-medium flex items-center justify-between">
            <span>Affichage de <strong>{filteredPharmacies.length}</strong> officine(s) répertoriée(s)</span>
            <span className="text-[#006948] font-bold">Ville de Tivaouane</span>
          </div>

          {filteredPharmacies.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-gray-100">
              <span className="material-symbols-outlined text-gray-300 text-[48px] mb-2">search_off</span>
              <p className="text-sm font-semibold text-gray-800">Aucune pharmacie ne correspond à ces critères.</p>
              <p className="text-xs text-gray-500 mt-1">Essayez d'élargir vos termes de recherche ou de retirer un filtre.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#006948] text-white text-xs font-bold"
              >
                Réinitialiser
              </button>
            </div>
          ) : (
            filteredPharmacies.map((pharmacy) => (
              <PharmacyCard
                key={pharmacy.id}
                pharmacy={pharmacy}
                onOpenDetails={onOpenDetails}
                onSelectMap={(p) => setSelectedMapPharmacy(p)}
              />
            ))
          )}
        </div>

        {/* Map & Assistance Side Column */}
        <div className={`${viewMode === 'list' ? 'hidden lg:block lg:col-span-5' : 'col-span-12 lg:col-span-5'} space-y-6 sticky top-28`}>
          <InteractiveMap
            pharmacies={filteredPharmacies.length > 0 ? filteredPharmacies : allPharmacies}
            selectedPharmacyId={selectedMapPharmacy?.id}
            onSelectPharmacy={(p) => {
              setSelectedMapPharmacy(p);
              onOpenDetails(p);
            }}
            title="Carte intégrale de Tivaouane"
            badgeText={`${allPharmacies.length} officines`}
          />

          {/* Urgent Oxygen & Night Service Notice */}
          <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#006948]">
              <span className="material-symbols-outlined text-[20px]">medical_services</span>
              <h4 className="text-sm font-bold text-gray-900">Urgences Nocturnes & Oxygène</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              En cas de rupture d'oxygène à domicile pour un patient insuffisant respiratoire ou asthmatique sévère,
              la <strong>Grande Pharmacie Dabakh</strong> et la <strong>Pharmacie Ndiambour</strong> disposent de
              bouteilles sous régulateur de secours 24h/24.
            </p>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Contact d'urgence Oxygène :</span>
              <a href="tel:339551234" className="font-bold text-[#006948] hover:underline">
                33 955 12 34
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
