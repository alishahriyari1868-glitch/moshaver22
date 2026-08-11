import React, { useEffect } from 'react';
import { Article } from '../types';
import { X, Phone, Clock, Tag, CheckCircle2, AlertTriangle, Share2, BookOpen, ArrowRight } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface ArticleDetailModalProps {
  article: Article | null;
  phone: string;
  onClose: () => void;
  onSelectArticleBySlug: (slug: string) => void;
  allArticles: Article[];
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  phone,
  onClose,
  onSelectArticleBySlug,
  allArticles,
}) => {
  if (!article) return null;

  useEffect(() => {
    // Record page view event for article
    trackEvent('page_view', { articleId: article.id, slug: article.slug });

    // Update canonical URL dynamically for SEO
    const canonicalUrl = `${window.location.origin}/article/${article.slug}`;
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;

    // Inject Schema.org JSON-LD structured data dynamically
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': article.schemaType,
      'headline': article.title,
      'description': article.metaDescription,
      'dateModified': new Date().toISOString(),
      'author': {
        '@type': 'Organization',
        'name': 'مشاور سرمایه‌گذاری منطقه ۲۲',
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'مشاور سرمایه‌گذاری منطقه ۲۲ تهران',
      },
      'mainEntityOfPage': canonicalUrl,
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-jsonld-schema';
    script.text = JSON.stringify(schemaData);

    const existingScript = document.getElementById('article-jsonld-schema');
    if (existingScript) existingScript.remove();
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById('article-jsonld-schema');
      if (s) s.remove();
    };
  }, [article]);

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.tags.some((t) => article.tags.includes(t))))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.metaDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('لینک مقاله در حافظه کپی شد.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      {/* Modal Card */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto text-slate-100 animate-fade-in">
        
        {/* Sticky Header inside modal */}
        <div className="sticky top-0 z-20 bg-slate-900/95 border-b border-slate-800 px-6 py-4 flex items-center justify-between backdrop-blur">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <BookOpen className="w-4 h-4" />
            <span>دسته‌بندی: {article.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors"
              title="اشتراک‌گذاری"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors"
              title="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Article Title & Meta */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-snug mb-3">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>زمان مطالعه: {article.readTime}</span>
              </span>
              <span>•</span>
              <span>بروزرسانی: {article.updatedAt}</span>
              <span>•</span>
              <span className="text-amber-300">منبع: مشاور تخصصی املاک منطقه ۲۲</span>
            </div>
          </div>

          {/* Meta Description Summary Card */}
          <div className="bg-slate-800/80 border-r-4 border-amber-500 p-4 rounded-xl text-sm text-slate-200 leading-relaxed font-medium">
            {article.summary}
          </div>

          {/* Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            {article.paragraphs.map((p, idx) => (
              <p key={idx} className="text-justify">
                {p}
              </p>
            ))}
          </div>

          {/* Checklists Section */}
          {article.checklists && article.checklists.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700 p-5 rounded-2xl space-y-3">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>چک‌لیست کلیدی این موضوع:</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {article.checklists.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warning Note */}
          {article.warningNote && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs sm:text-sm text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-300 mb-0.5">هشدار کارشناسی:</strong>
                <span>{article.warningNote}</span>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            {article.tags.map((t, idx) => (
              <span key={idx} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                #{t}
              </span>
            ))}
          </div>

          {/* DIRECT PHONE CALL PROMPT BOX */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/40 p-6 rounded-3xl text-center space-y-4 shadow-xl">
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              آیا قصد بررسی این موضوع در یک پروژه خاص چیتگر را دارید؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              قبل از امضای هرگونه قرارداد یا پرداخت وجه، اسناد و رزومه پروژه را با مشاور ارشد بررسی کنید.
            </p>
            
            <a
              href={`tel:${phone}`}
              onClick={() => trackEvent('phone_click', { location: `article_${article.slug}` })}
              className="inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-8 py-3.5 rounded-2xl text-base shadow-lg transition-all active:scale-95"
              id="article-phone-cta"
            >
              <Phone className="w-5 h-5 fill-slate-950" />
              <span>«📞 تماس با مشاور ({phone})»</span>
            </a>
          </div>

          {/* Internal Links / Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="font-bold text-sm text-slate-200">مقالات مرتبط دیگر برای مطالعه:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedArticles.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectArticleBySlug(rel.slug)}
                    className="text-right p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 hover:border-amber-500/40 transition-all space-y-1 block"
                  >
                    <span className="font-semibold block line-clamp-1">{rel.title}</span>
                    <span className="text-[11px] text-amber-400 flex items-center gap-1">
                      <span>مطالعه مقاله</span>
                      <ArrowRight className="w-3 h-3 rotate-180" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
