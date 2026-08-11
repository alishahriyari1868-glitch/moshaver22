import React from 'react';
import { Phone, ShieldAlert, ArrowDown, CheckCircle2, Award, Clock } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface HeroSectionProps {
  headline: string;
  subheadline: string;
  phone: string;
  ctaText: string;
  onStartQualification: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  headline,
  subheadline,
  phone,
  ctaText,
  onStartQualification,
}) => {

  const handlePhoneClick = () => {
    trackEvent('phone_click', { location: 'hero_primary_cta' });
  };

  const handleSecondaryClick = () => {
    trackEvent('cta_click', { location: 'hero_secondary_cta' });
    onStartQualification();
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-slate-100 pt-10 pb-16 md:pt-16 md:pb-24 border-b border-slate-800">
      
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Top Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs sm:text-sm text-amber-300 mb-6 backdrop-blur shadow-sm">
          <Award className="w-4 h-4 text-amber-400" />
          <span>مشاوره تخصصی و بی‌طرفانه ارزیابی ریسک املاک چیتگر</span>
        </div>

        {/* Hero Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 leading-tight tracking-tight mb-6">
          {headline}
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
          {subheadline}
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          
          {/* Primary Call CTA */}
          <a
            href={`tel:${phone}`}
            onClick={handlePhoneClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-amber-500/20 transition-all active:scale-95"
            id="hero-primary-call-cta"
          >
            <Phone className="w-5 h-5 fill-slate-950" />
            <span>{ctaText}</span>
          </a>

          {/* Secondary Qualification CTA */}
          <button
            onClick={handleSecondaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-4 rounded-2xl text-base transition-all"
            id="hero-secondary-cta"
          >
            <span>آیا سرمایه‌گذاری در منطقه ۲۲ برای من مناسب است؟</span>
            <ArrowDown className="w-4 h-4 text-amber-400" />
          </button>

        </div>

        {/* Trust Badges Bar */}
        <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-right sm:text-center text-xs text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>بدون تعهد و کاملاً رایگان</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>بررسی شفاف اسناد و پروانه‌ها</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-blue-400 shrink-0" />
            <span>پاسخگویی سریع مشاور ارشد</span>
          </div>
        </div>

      </div>

    </section>
  );
};
