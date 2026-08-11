import React, { useState } from 'react';
import { TRUST_TOPICS } from '../data/trustTopics';
import { ShieldCheck, AlertTriangle, SearchCheck, FileText, XCircle, Clock, ChevronDown, ChevronUp, CheckCircle, Phone } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface TrustSectionProps {
  phone: string;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ phone }) => {
  const [expandedId, setExpandedId] = useState<string | null>('check-before-investing');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-amber-400" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'SearchCheck': return <SearchCheck className="w-5 h-5 text-amber-400" />;
      case 'FileText': return <FileText className="w-5 h-5 text-amber-400" />;
      case 'XCircle': return <XCircle className="w-5 h-5 text-amber-400" />;
      case 'Clock': return <Clock className="w-5 h-5 text-amber-400" />;
      default: return <ShieldCheck className="w-5 h-5 text-amber-400" />;
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      trackEvent('cta_impression', { topic: id, type: 'trust_topic_expanded' });
    }
  };

  return (
    <section id="trust" className="py-12 sm:py-16 bg-slate-950 text-slate-100 border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs text-amber-400 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>شفافیت و امنیت حقوقی</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-3">
            اصول طلایی امنیت سرمایه‌گذاری در چیتگر و منطقه ۲۲
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            قبل از اینکه هرگونه تعهد مالی ایجاد کنید، این ۶ اصل کلیدی اعتبارسنجی را مطالعه کنید تا سرمایه شما در مسیر درست قرار گیرد.
          </p>
        </div>

        {/* Accordion / Cards Grid */}
        <div className="space-y-4">
          {TRUST_TOPICS.map((topic) => {
            const isExpanded = expandedId === topic.id;
            return (
              <div
                key={topic.id}
                className={`bg-slate-900/90 border rounded-2xl transition-all overflow-hidden ${
                  isExpanded ? 'border-amber-500/50 shadow-lg' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Toggle */}
                <button
                  onClick={() => toggleExpand(topic.id)}
                  className="w-full text-right p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      {getIcon(topic.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-slate-100">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {topic.summary}
                      </p>
                    </div>
                  </div>

                  <div className="text-slate-400 p-1 rounded-lg bg-slate-800/60 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 text-sm text-slate-300 space-y-4 bg-slate-900/40 animate-fade-in">
                    
                    {/* Key Details List */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-200 text-xs text-amber-400">نکات کلیدی بررسی:</h4>
                      <ul className="space-y-2">
                        {topic.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Checklist */}
                    <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl space-y-2">
                      <h4 className="font-semibold text-xs text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>چک‌لیست استعلام سریع:</span>
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                        {topic.checklist.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="text-emerald-400 text-sm">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Warning Box */}
                    <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-300 font-semibold mb-0.5">هشدار کارشناسی:</strong>
                        <span>{topic.warningNote}</span>
                      </div>
                    </div>

                    {/* Direct Call Helper */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400">نیاز به بررسی تخصصی این موضوع در پروژه خاص دارید؟</span>
                      <a
                        href={`tel:${phone}`}
                        onClick={() => trackEvent('phone_click', { location: `trust_topic_${topic.id}` })}
                        className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-bold px-3.5 py-1.5 rounded-lg transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>استعلام تلفنی از مشاور ({phone})</span>
                      </a>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Business Ethics Disclaimer */}
        <div className="mt-8 text-center text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed border-t border-slate-800/60 pt-6">
          <p>
            تذکر اخلاقی: در این سامانه هیچ‌گونه تضمین سود غیرواقعی، آمار مجعول یا نظرات جعلی منتشر نمی‌شود. تمام توصیه‌ها بر اساس تحلیل اسناد قانونی، پروانه‌های رسمی شهرداری و استعلامات ثبت اسناد منطقه ۲۲ تهران ارائه می‌گردد.
          </p>
        </div>

      </div>
    </section>
  );
};
