import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-[#825100] px-4 py-2.5 text-xs font-semibold text-white shadow-xl border border-white/20 backdrop-blur-md">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ffddb8] animate-ping" />
      <span>Mode Hors-ligne — Base locale des pharmacies de Tivaouane active</span>
    </div>
  );
};
