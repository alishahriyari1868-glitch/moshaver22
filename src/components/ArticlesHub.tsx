import React, { useState } from 'react';
import { ARTICLES } from '../data/articles';
import { Article } from '../types';
import { BookOpen, Search, Clock, ArrowLeft, Tag, ShieldCheck, Sparkles } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface ArticlesHubProps {
  onSelectArticle: (article: Article) => void;
}

export const ArticlesHub: React.FC<ArticlesHubProps> = ({ onSelectArticle }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');

  const categories = [
    'همه',
    'راهنمای پایه',
    'تحلیل بازار',
    'ارزیابی ریسک',
    'چک‌لیست عملیاتی',
    'حقوقی و اسناد',
    'هشدار‌های کاربردی',
    'استراتژی مالی',
    'مقایسه تخصصی',
    'محاسبات مالی',
    'شناخت محله‌ها',
    'اعتبارسنجی'
  ];

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === 'همه' || article.category === selectedCategory;
    const matchesSearch =
      article.title.includes(searchTerm) ||
      article.summary.includes(searchTerm) ||
      article.tags.some((t) => t.includes(searchTerm));
    return matchesCategory && matchesSearch;
  });

  const handleArticleClick = (article: Article) => {
    trackEvent('cta_click', { location: 'articles_hub_card', articleId: article.id });
    onSelectArticle(article);
  };

  return (
    <section id="articles" className="py-12 sm:py-16 bg-slate-900 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs text-amber-400 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>پایگاه تخصصی محتوای املاک منطقه ۲۲</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-3">
            ۲۰ راهنمای تخصصی و کاربردی سرمایه‌گذاری
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            مجموعه مقالات تحلیل ریسک، استعلام سند، پروانه شهرداری و مقایسه تعاونی‌ها برای تصمیم‌گیری آگاهانه.
          </p>
        </div>

        {/* Search & Category Controls */}
        <div className="mb-8 space-y-4">
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در بین ۲۰ راهنمای سرمایه‌گذاری (مثلاً: ریسک، پروانه، کوهک، سند)..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-11 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-all shadow-inner"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Articles Count */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6 border-b border-slate-800 pb-3">
          <span>نمایش {filteredArticles.length} راهنمای تخصصی از ۲۰ مقاله</span>
          <span className="text-amber-400 font-medium">بدون تبلیغات پروژه‌ای • صرفاً تحلیل کارشناسی</span>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/40 rounded-3xl border border-slate-800 text-slate-400">
            <p>هیچ مقاله‌ای منطبق با جستجوی شما یافت نشد.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('همه');
              }}
              className="mt-3 text-xs text-amber-400 underline font-semibold"
            >
              پاک کردن فیلترها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => handleArticleClick(article)}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all hover:shadow-xl group"
              >
                <div>
                  
                  {/* Article Category & Read Time */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="bg-slate-900 border border-slate-700/80 px-2.5 py-0.5 rounded-md text-amber-400 font-medium">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base sm:text-lg text-slate-100 group-hover:text-amber-400 transition-colors leading-snug mb-2.5">
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {article.summary}
                  </p>

                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:text-amber-300">
                  <span className="flex items-center gap-1">
                    <span>مطالعه مقاله کامل</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </span>

                  <span className="text-[10px] text-slate-400 font-normal">
                    کد راهنما: #{article.id}
                  </span>
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
