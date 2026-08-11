import React from 'react';
import { Phone, Shield, SlidersHorizontal, BookOpen, UserCheck, Settings } from 'lucide-react';

interface NavbarProps {
  phone: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ phone, onNavigate, onOpenAdmin }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Name */}
        <div 
          onClick={() => onNavigate('hero')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-all">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-100 tracking-tight block">
              «مشاور سرمایه‌گذاری منطقه ۲۲»
            </span>
            <span className="text-xs text-slate-400 block -mt-0.5">
              راهنمای تخصصی چیتگر و مرواریدشهر
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <button 
            onClick={() => onNavigate('trust')} 
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-slate-400" />
            <span>ارزیابی ریسک</span>
          </button>

          <button 
            onClick={() => onNavigate('qualification')} 
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>تست هوشمند بودجه</span>
          </button>

          <button 
            onClick={() => onNavigate('articles')} 
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>۲۰ راهنمای سرمایه‌گذاری</span>
          </button>

          <button 
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>پنل مدیریت</span>
          </button>
        </nav>

        {/* Primary Call Button in Header */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm shadow-md transition-all active:scale-95"
            id="nav-phone-cta"
          >
            <Phone className="w-4 h-4 fill-slate-950" />
            <span className="dir-ltr font-mono font-bold">{phone}</span>
          </a>
        </div>

      </div>
    </header>
  );
};
