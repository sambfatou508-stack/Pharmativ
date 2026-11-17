import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Pharmacy } from '../types/pharmacy';
import {
  getDynamicPharmacies,
  getShiftStatus,
  formatFrenchDate,
  formatFrenchTime,
} from '../utils/dutySchedule';
import { enrichWithUserDistance, findNearestPharmacy } from '../utils/geo';

interface DutyScheduleContextType {
  now: Date;
  activeDate: Date;
  isLive: boolean;
  dayOffset: number;
  formattedDate: string;
  formattedTime: string;
  shiftStatus: ReturnType<typeof getShiftStatus>;
  allPharmacies: Pharmacy[];
  dutyPharmacies: Pharmacy[];
  userLocation: { lat: number; lng: number } | null;
  isLocating: boolean;
  locationError: string | null;
  nearestDutyPharmacy: Pharmacy | null;
  requestUserLocation: () => Promise<{ lat: number; lng: number } | null>;
  clearUserLocation: () => void;
  setUserLocationDirectly: (coords: { lat: number; lng: number } | null) => void;
  setDateOffset: (offset: number) => void;
  setSpecificDate: (date: Date) => void;
  resetToLive: () => void;
}

const DutyScheduleContext = createContext<DutyScheduleContextType | undefined>(undefined);

export const DutyScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live clock updating every second
  const [now, setNow] = useState<Date>(() => new Date());
  const [dayOffset, setDayOffset] = useState<number>(0);

  // GPS User Location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute active date (either today or offset by days)
  const activeDate = useMemo(() => {
    const d = new Date(now);
    if (dayOffset !== 0) {
      d.setDate(d.getDate() + dayOffset);
    }
    return d;
  }, [now, dayOffset]);

  const isLive = dayOffset === 0;

  // Shift status (night / day and countdown)
  const shiftStatus = useMemo(() => getShiftStatus(now), [now]);

  // Formatted date and time strings
  const formattedDate = useMemo(() => formatFrenchDate(activeDate), [activeDate]);
  const formattedTime = useMemo(() => formatFrenchTime(now, true), [now]);

  // Request browser geolocation
  const requestUserLocation = async (): Promise<{ lat: number; lng: number } | null> => {
    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas prise en charge par ce navigateur.");
      return null;
    }

    setIsLocating(true);
    setLocationError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          setIsLocating(false);
          resolve(coords);
        },
        (error) => {
          let msg = 'Impossible d’accéder à votre position GPS.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Autorisation d’accès à la position refusée. Veuillez autoriser la localisation dans votre navigateur.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'Signal GPS non disponible ou position introuvable.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Délai d’attente du signal GPS dépassé.';
          }
          setLocationError(msg);
          setIsLocating(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
      );
    });
  };

  const clearUserLocation = () => {
    setUserLocation(null);
    setLocationError(null);
  };

  const setUserLocationDirectly = (coords: { lat: number; lng: number } | null) => {
    setUserLocation(coords);
    if (coords) setLocationError(null);
  };

  // Base pharmacies calculated for active date
  const basePharmacies = useMemo(() => {
    return getDynamicPharmacies(activeDate, now);
  }, [activeDate, now]);

  // When userLocation is available, compute real geodesic distances from user GPS coordinates!
  const allPharmacies = useMemo(() => {
    if (!userLocation) return basePharmacies;
    return enrichWithUserDistance(basePharmacies, userLocation);
  }, [basePharmacies, userLocation]);

  const dutyPharmacies = useMemo(() => {
    const duties = basePharmacies.filter((p) => p.isGardeToday);
    if (!userLocation) return duties;
    // Sort duty pharmacies with closest to user first!
    return enrichWithUserDistance(duties, userLocation);
  }, [basePharmacies, userLocation]);

  // Closest duty pharmacy to the user's coordinates
  const nearestDutyPharmacy = useMemo(() => {
    if (!userLocation) return null;
    return findNearestPharmacy(dutyPharmacies, userLocation);
  }, [dutyPharmacies, userLocation]);

  const setDateOffsetHandler = (offset: number) => {
    setDayOffset(offset);
  };

  const setSpecificDateHandler = (date: Date) => {
    // calculate difference in days from now
    const todayZero = new Date(now);
    todayZero.setHours(0, 0, 0, 0);
    const targetZero = new Date(date);
    targetZero.setHours(0, 0, 0, 0);
    const diffDays = Math.round((targetZero.getTime() - todayZero.getTime()) / (1000 * 60 * 60 * 24));
    setDayOffset(diffDays);
  };

  const resetToLiveHandler = () => {
    setDayOffset(0);
  };

  return (
    <DutyScheduleContext.Provider
      value={{
        now,
        activeDate,
        isLive,
        dayOffset,
        formattedDate,
        formattedTime,
        shiftStatus,
        allPharmacies,
        dutyPharmacies,
        userLocation,
        isLocating,
        locationError,
        nearestDutyPharmacy,
        requestUserLocation,
        clearUserLocation,
        setUserLocationDirectly,
        setDateOffset: setDateOffsetHandler,
        setSpecificDate: setSpecificDateHandler,
        resetToLive: resetToLiveHandler,
      }}
    >
      {children}
    </DutyScheduleContext.Provider>
  );
};

export const useDutySchedule = (): DutyScheduleContextType => {
  const context = useContext(DutyScheduleContext);
  if (!context) {
    throw new Error('useDutySchedule must be used within a DutyScheduleProvider');
  }
  return context;
};
