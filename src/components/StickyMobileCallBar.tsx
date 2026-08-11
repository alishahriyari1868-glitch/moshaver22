import React from 'react';
import { Phone, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface StickyMobileCallBarProps {
  phone: string;
}

export const StickyMobileCallBar: React.FC<StickyMobileCallBarProps> = ({ phone }) => {

  const handleClick = () => {
    trackEvent('phone_click', { location: 'sticky_mobile_bar' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur border-t border-amber-500/30 p-3 shadow-2xl">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        
        {/* Call CTA Button */}
        <a
          href={`tel:${phone}`}
          onClick={handleClick}
          className="flex-1 inline-flex items-center justify-center gap-2.5 bg-amber-500 active:bg-amber-600 text-slate-950 font-extrabold px-4 py-3 rounded-xl text-base shadow-lg transition-all"
          id="sticky-mobile-phone-cta"
        >
          <Phone className="w-5 h-5 fill-slate-950 shrink-0" />
          <span>«📞 تماس با مشاور»</span>
        </a>

        {/* Quick Phone Badge */}
        <div className="text-left font-mono font-bold text-xs text-amber-300 bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-xl shrink-0 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-sans font-normal">تلفن مستقیم:</span>
          <span className="dir-ltr text-amber-400">{phone}</span>
        </div>

      </div>
    </div>
  );
};
