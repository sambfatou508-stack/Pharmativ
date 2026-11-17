import { Pharmacy } from '../types/pharmacy';
import { PHARMACIES } from '../data/pharmacies';

/**
 * Three territorial groups ensuring full geographic coverage of Tivaouane every day:
 * Group A: Zone Hôpital Dabakh / SAU
 * Group B: Zone Cœur Religieux / Zawiya / Grand Marché
 * Group C: Zone Grands Axes RN2 / Entrées & Sorties
 */
export const DUTY_GROUPS = {
  groupA: ['mbaye-sy-abdou', 'dabakh-garde', 'mame-abdou-officine', 'al-amine'],
  groupB: ['grande-pharmacie-tivaouane', 'mosquee-garde', 'el-hadj-malick', 'centrale-tivaouane', 'rail'],
  groupC: ['ndiambour-garde', 'serigne-mansour-sy', 'cheikh-tidiane-sy'],
};

/**
 * Returns the effective duty shift date.
 * Under pharmaceutical regulations in Senegal:
 * A night guard begins at 20h00 and concludes at 08h00 the next morning.
 * Therefore, between midnight (00:00) and 07:59, the active shift is still the one
 * that started the previous evening.
 */
export function getEffectiveShiftDate(date: Date): Date {
  const d = new Date(date);
  const hours = d.getHours();
  // If between 00:00 and 07:59, it's the night shift of the previous day
  if (hours < 8) {
    d.setDate(d.getDate() - 1);
  }
  // Normalize to midnight
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Computes the day index since Unix Epoch (in days).
 */
export function getDayIndex(date: Date): number {
  const shiftDate = getEffectiveShiftDate(date);
  const utc = Date.UTC(shiftDate.getFullYear(), shiftDate.getMonth(), shiftDate.getDate());
  return Math.floor(utc / (1000 * 60 * 60 * 24));
}

/**
 * Calculates which 3 pharmacies are on duty for ANY given date.
 * Guarantees exactly 1 pharmacy from Group A, 1 from Group B, and 1 from Group C.
 */
export function getDutyPharmacyIdsForDate(date: Date): {
  groupAId: string;
  groupBId: string;
  groupCId: string;
} {
  const dayIndex = getDayIndex(date);

  const groupAId = DUTY_GROUPS.groupA[Math.abs(dayIndex) % DUTY_GROUPS.groupA.length];
  const groupBId = DUTY_GROUPS.groupB[Math.abs(dayIndex) % DUTY_GROUPS.groupB.length];
  const groupCId = DUTY_GROUPS.groupC[Math.abs(dayIndex) % DUTY_GROUPS.groupC.length];

  return { groupAId, groupBId, groupCId };
}

/**
 * Calculates how many days until a given pharmacy is next on duty.
 */
export function getDaysUntilNextDuty(pharmacyId: string, fromDate: Date): number {
  for (let offset = 0; offset <= 14; offset++) {
    const futureDate = new Date(fromDate);
    futureDate.setDate(futureDate.getDate() + offset);
    const { groupAId, groupBId, groupCId } = getDutyPharmacyIdsForDate(futureDate);
    if (groupAId === pharmacyId || groupBId === pharmacyId || groupCId === pharmacyId) {
      return offset;
    }
  }
  return 1;
}

/**
 * Computes shift phase and countdown to next rotation switch (either 08:00 or 20:00).
 */
export function getShiftStatus(now: Date) {
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const isNightShift = hours >= 20 || hours < 8;

  // Target time for next shift
  const nextTarget = new Date(now);
  if (hours >= 20) {
    // Next switch is tomorrow at 08:00
    nextTarget.setDate(nextTarget.getDate() + 1);
    nextTarget.setHours(8, 0, 0, 0);
  } else if (hours < 8) {
    // Next switch is today at 08:00
    nextTarget.setHours(8, 0, 0, 0);
  } else {
    // Next switch is today at 20:00
    nextTarget.setHours(20, 0, 0, 0);
  }

  const diffMs = Math.max(0, nextTarget.getTime() - now.getTime());
  const diffSecs = Math.floor(diffMs / 1000);
  const remainingHours = Math.floor(diffSecs / 3600);
  const remainingMinutes = Math.floor((diffSecs % 3600) / 60);
  const remainingSeconds = diffSecs % 60;

  return {
    isNightShift,
    phaseLabel: isNightShift ? 'Garde de Nuit (20h00 — 08h00)' : 'Permanence de Jour (08h00 — 20h00)',
    nextSwitchLabel: isNightShift ? 'Relève de jour à 08h00' : 'Bascule de nuit à 20h00',
    targetHourDisplay: isNightShift ? '08:00' : '20:00',
    remainingHours,
    remainingMinutes,
    remainingSeconds,
    formattedCountdown: `${remainingHours}h ${remainingMinutes.toString().padStart(2, '0')}m ${remainingSeconds.toString().padStart(2, '0')}s`,
  };
}

/**
 * Enriches all pharmacies with dynamic on-duty status based on the selected/active date.
 */
export function getDynamicPharmacies(activeDate: Date, nowTime: Date): Pharmacy[] {
  const { groupAId, groupBId, groupCId } = getDutyPharmacyIdsForDate(activeDate);
  const shiftInfo = getShiftStatus(nowTime);

  return PHARMACIES.map((p) => {
    const isDuty = p.id === groupAId || p.id === groupBId || p.id === groupCId;

    if (isDuty) {
      let badge = 'Pharmacie de Garde';
      let gType: Pharmacy['gardeType'] = '24H/24 CONTINUE';

      if (p.id === groupAId) {
        badge = 'Garde Secteur Hôpital Dabakh';
        gType = '24H/24 CONTINUE';
      } else if (p.id === groupBId) {
        badge = 'Garde Cœur Ville / Zawiya';
        gType = 'NATIONALE TIVAOUANE';
      } else {
        badge = 'Garde Axe Routier RN2';
        gType = 'AXE RN2';
      }

      return {
        ...p,
        isGardeToday: true,
        isOpenNow: true,
        gardeType: gType,
        gardeBadgeText: badge,
        statusText: `Ouvert 24h/24 • De Garde active (${shiftInfo.isNightShift ? 'Nuit' : 'Jour'})`,
        gardeRelieveInfo: `Relève assurée jusqu'à ${shiftInfo.targetHourDisplay}`,
        openingHours: `24h/24 sans interruption • Tour de garde actif (${shiftInfo.phaseLabel})`,
      };
    } else {
      const daysUntil = getDaysUntilNextDuty(p.id, activeDate);
      let nextTurnText = `De garde dans ${daysUntil} jours`;
      if (daysUntil === 1) nextTurnText = 'De garde demain';
      if (daysUntil === 0) nextTurnText = 'De garde aujourd’hui';

      // Standard or extended opening check
      const h = nowTime.getHours();
      const isLateOpen = p.id === 'grande-pharmacie-tivaouane' && h >= 8 && h < 23;
      const isRegularOpen = h >= 8 && h < 21;
      const isAlways24h = p.id === 'mbaye-sy-abdou' || p.openingHours.toLowerCase().includes('24h/24');
      const isOpen = isAlways24h || isLateOpen || isRegularOpen;

      let statusMsg = `Fermé cette nuit • ${nextTurnText}`;
      if (isAlways24h) {
        statusMsg = `Ouvert 24h/24 en continu • ${nextTurnText}`;
      } else if (isLateOpen || (p.id === 'grande-pharmacie-tivaouane' && isOpen)) {
        statusMsg = `Ouvert jusqu'à 23h00 • ${nextTurnText}`;
      } else if (isRegularOpen) {
        statusMsg = `Ouvert (Horaires normaux) • ${nextTurnText}`;
      }

      return {
        ...p,
        isGardeToday: false,
        gardeType: undefined,
        gardeBadgeText: isAlways24h ? 'Ouvert 24h/24' : isLateOpen ? 'Ouvert jusqu’à 23h' : nextTurnText,
        isOpenNow: isOpen,
        statusText: statusMsg,
        gardeRelieveInfo: isAlways24h ? 'Permanence continue 24h/24' : undefined,
      };
    }
  });
}

/**
 * Format a date in French, e.g. "Dimanche 20 Septembre 2026"
 */
export function formatFrenchDate(date: Date): string {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName} ${dayNum} ${monthName} ${year}`;
}

/**
 * Format time in HH:mm:ss
 */
export function formatFrenchTime(date: Date, includeSeconds = true): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return includeSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
}
