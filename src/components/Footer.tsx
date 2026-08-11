import React from 'react';
import { Shield, Phone, FileText, Globe, Lock } from 'lucide-react';

interface FooterProps {
  phone: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ phone, onNavigate, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>«مشاور سرمایه‌گذاری منطقه ۲۲»</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              سامانه تخصصی ارزیابی ریسک، اعتبارسنجی پروژه‌های پیش‌فروش، استعلام پروانه شهرداری و بررسی حقوقی اسناد در چیتگر، کوهک و مرواریدشهر تهران.
            </p>
            <div className="pt-1">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 bg-slate-900 border border-amber-500/40 text-amber-300 font-bold px-3.5 py-2 rounded-xl"
              >
                <Phone className="w-4 h-4" />
                <span>مشاوره تلفنی مستقیم: <strong className="font-mono dir-ltr">{phone}</strong></span>
              </a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-sm mb-3">دسترسی سریع</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-amber-400 transition-colors">
                  صفحه اصلی
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('qualification')} className="hover:text-amber-400 transition-colors">
                  تست ۳ سوالی ارزیابی بودجه
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('trust')} className="hover:text-amber-400 transition-colors">
                  اصول ۶ گانه ارزیابی ریسک
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('articles')} className="hover:text-amber-400 transition-colors">
                  ۲۰ راهنمای سرمایه‌گذاری
                </button>
              </li>
            </ul>
          </div>

          {/* SEO & Admin Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-sm mb-3">ابزارها و ساختار SEO</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>نقشه سایت (sitemap.xml)</span>
                </a>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>فایل ربات‌ها (robots.txt)</span>
                </a>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-amber-400 transition-colors flex items-center gap-1 text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>ورود به پنل مدیریت</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Ethical Business Disclaimer */}
        <div className="pt-6 border-t border-slate-900 text-[11px] text-slate-500 space-y-2 text-justify">
          <p>
            تعهد اخلاقی و حرفه‌ای: این وب‌سایت هیچ‌گونه سود قطعی تضمینی، آمار ساختگی یا نظرات مجعول منتشر نمی‌کند. هدف اصلی ارائه مشاوره شفاف، بررسی اسناد قانونی پروژه‌ها و جلوگیری از ضرر مالی خریداران در منطقه ۲۲ است.
          </p>
          <p className="text-center text-slate-600 pt-2">
            تمامی حقوق محتوا و سامانه محفوظ است © {new Date().getFullYear()} - مشاور سرمایه‌گذاری منطقه ۲۲ تهران
          </p>
        </div>

      </div>
    </footer>
  );
};
