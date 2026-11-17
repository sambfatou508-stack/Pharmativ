import React from 'react';
import {
  EMERGENCY_SERVICES,
  HOSPITAL_DABAKH,
  HEALTH_CENTERS,
  FIRST_AID_TIPS,
} from '../../data/pharmacies';
import { trackEmergencyCall } from '../../services/analytics';

export const UrgencesScreen: React.FC = () => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-8 space-y-10">
      {/* Top Urgent Alert Banner */}
      <div className="bg-gradient-to-r from-[#ba1a1a] to-[#93000a] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[30px] animate-pulse">crisis_alert</span>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-red-200">
              Lignes d'assistance vitale 24h/24 & 7j/7
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Urgences Immédiates • Tivaouane & Région
            </h1>
            <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-xl">
              Accès instantané aux numéros d'urgence gratuits, régulation SAMU et prise en charge vitale à l'Hôpital
              Dabakh.
            </p>
          </div>
        </div>

        {/* Quick Emergency Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:1515"
            onClick={() => trackEmergencyCall('SAMU National', '1515')}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white text-[#ba1a1a] font-extrabold text-sm shadow-md hover:bg-red-50 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
            <span>SAMU : 15 15</span>
          </a>
          <a
            href="tel:18"
            onClick={() => trackEmergencyCall('Sapeurs-Pompiers', '18')}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#825100] text-white font-extrabold text-sm shadow-md hover:bg-[#683f00] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
            <span>Pompiers : 18</span>
          </a>
        </div>
      </div>

      {/* 4 Emergency Services Cards Grid */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ba1a1a]">e911_emergency</span>
          <span>Services de secours d'urgence</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EMERGENCY_SERVICES.map((serv) => (
            <div
              key={serv.id}
              className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      serv.badgeType === 'national'
                        ? 'bg-red-100 text-[#ba1a1a]'
                        : serv.badgeType === 'tivaouane'
                        ? 'bg-amber-100 text-[#825100]'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {serv.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400">{serv.category}</span>
                </div>

                <h3 className="text-base font-bold text-gray-900">{serv.name}</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{serv.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 space-y-2">
                <a
                  href={`tel:${serv.phone}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#ba1a1a] text-white font-extrabold text-xs sm:text-sm hover:bg-[#93000a] active:scale-95 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>Appeler {serv.phoneDisplay}</span>
                </a>

                {serv.altPhone && (
                  <a
                    href={`tel:${serv.altPhone}`}
                    className="w-full block text-center text-[11px] font-semibold text-gray-500 hover:text-gray-900"
                  >
                    Fixe : {serv.altPhoneDisplay}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Section: Centre Hospitalier Régional Mame Abdou Aziz Sy Dabakh */}
      <section className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left info content */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#006948] text-xs font-extrabold">
                  HÔPITAL DE RÉFÉRENCE 24H/24
                </span>
                <span className="text-xs text-gray-500">{HOSPITAL_DABAKH.grade}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
                {HOSPITAL_DABAKH.name}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                {HOSPITAL_DABAKH.description}
              </p>

              {/* Capacity meter */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 mb-6">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-gray-800">Affluence des Urgences :</span>
                  <span className="font-extrabold text-[#006948]">{HOSPITAL_DABAKH.capacityStatus} ({HOSPITAL_DABAKH.capacityPercentage}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#006948] rounded-full"
                    style={{ width: `${HOSPITAL_DABAKH.capacityPercentage}%` }}
                  />
                </div>
                <div className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#006948]">check_circle</span>
                  <span>{HOSPITAL_DABAKH.capacityDetails}</span>
                </div>
              </div>

              {/* 3 Hospital Features */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {HOSPITAL_DABAKH.features.map((f, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[#faf8ff] border border-gray-100 text-center">
                    <span className={`material-symbols-outlined text-[24px] ${f.color} mb-1 block`}>
                      {f.icon}
                    </span>
                    <div className="text-xs font-bold text-gray-900">{f.title}</div>
                    <div className="text-[10px] text-gray-500">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
              <a
                href={`tel:${HOSPITAL_DABAKH.phone}`}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#006948] text-white font-bold text-sm shadow-sm hover:bg-[#00855d] active:scale-95 transition-all text-center"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
                <span>Appeler le Standard ({HOSPITAL_DABAKH.phoneDisplay})</span>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Hopital+Mame+Abdou+Aziz+Sy+Dabakh+Tivaouane"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#eaedff] text-[#006948] font-bold text-sm hover:bg-[#dae2fd] active:scale-95 transition-all text-center"
              >
                <span className="material-symbols-outlined text-[20px]">near_me</span>
                <span>Itinéraire Immédiat</span>
              </a>
            </div>
          </div>

          {/* Right Image / Facade */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-gray-100">
            <img
              src={HOSPITAL_DABAKH.imageUrl}
              alt="Hôpital Mame Abdou Aziz Sy Dabakh"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {HOSPITAL_DABAKH.location}
                </div>
                <div className="text-sm font-bold">Plateau Médico-Technique & Réanimation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Centres & Postes de Santé de Proximité */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006948]">domain</span>
              <span>Centres & Postes de Santé de Proximité</span>
            </h2>
            <p className="text-xs text-gray-500">
              Structures médicales municipales pour soins ambulatoires, pansements, consultations et maternité.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {HEALTH_CENTERS.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">
                    {c.type}
                  </span>
                  {c.is24h && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      24h/24
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-gray-900">{c.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{c.quartier}</p>

                <div className="my-3 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-xl">
                  <div className="font-semibold text-gray-800 mb-1">{c.hours}</div>
                  <div className="flex flex-wrap gap-1">
                    {c.services.map((s, idx) => (
                      <span key={idx} className="bg-white px-1.5 py-0.5 rounded text-[10px] border border-gray-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href={`tel:${c.phone}`}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#eaedff] text-[#006948] font-bold text-xs hover:bg-[#dae2fd] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>{c.phoneDisplay}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Gestes Qui Sauvent • Premiers Secours */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
        <div className="max-w-3xl mb-6">
          <div className="flex items-center gap-2 text-[#ba1a1a] mb-1">
            <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
            <span className="text-xs font-bold uppercase tracking-wider">Fiches Réflexes Vitales</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Gestes qui sauvent • Premiers secours d'urgence
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Consignes médicales officielles en attendant l'arrivée des secours ou du transfert vers l'Hôpital Dabakh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FIRST_AID_TIPS.map((tip) => (
            <div key={tip.id} className="p-5 rounded-2xl bg-[#faf8ff] border border-gray-100 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`material-symbols-outlined text-[24px] ${tip.colorClass}`}>
                    {tip.icon}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900">{tip.title}</h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-900 border border-red-100">
                    <strong className="block text-[11px] text-red-700 font-extrabold uppercase mb-0.5">À NE PAS FAIRE :</strong>
                    {tip.nePas}
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-100">
                    <strong className="block text-[11px] text-emerald-800 font-extrabold uppercase mb-0.5">À FAIRE IMMÉDIATEMENT :</strong>
                    {tip.aFaire}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 text-[11px] font-semibold text-gray-700">
                {tip.actions}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dispositif Pèlerinage & Gamou de Tivaouane */}
      <section className="bg-[#f2f3ff] rounded-3xl p-6 sm:p-8 border border-[#dae2fd] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <span className="text-xs font-bold text-[#006948] uppercase tracking-wider">
            Dispositif Exceptionnel Gamou / Mawlid
          </span>
          <h3 className="text-lg sm:text-xl font-black text-gray-900">
            Postes Médicaux Avancés (PMA) & Couverture Spéciale
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Durant le Gamou de Tivaouane, plus de 50 postes médicaux avancés de la Croix-Rouge sénégalaise et du SAMU
            sont déployés autour des grandes Zawiyas et sur les esplanades. Toutes les pharmacies communales
            assurent un service continu 24h/24.
          </p>
        </div>

        <a
          href="tel:1515"
          className="px-6 py-3 rounded-2xl bg-[#006948] text-white font-bold text-xs sm:text-sm shrink-0 hover:bg-[#00855d] transition shadow-sm"
        >
          Contacter la Coordination Médicale
        </a>
      </section>
    </div>
  );
};
