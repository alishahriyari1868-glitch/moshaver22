import React, { useState, useEffect } from 'react';
import { Article, SiteSettings } from './types';
import { ARTICLES } from './data/articles';
import { trackEvent } from './lib/analytics';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QualificationWizard } from './components/QualificationWizard';
import { TrustSection } from './components/TrustSection';
import { ArticlesHub } from './components/ArticlesHub';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { StickyMobileCallBar } from './components/StickyMobileCallBar';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

export default function App() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    phone: '09124362083',
    headline: 'قصد سرمایه‌گذاری در منطقه ۲۲ را داری؟',
    subheadline: 'قبل از اینکه سرمایه‌ات را وارد هر پروژه‌ای کنی، شرایطت را بررسی کن و با یک مشاور صحبت کن.',
    ctaText: '📞 تماس مستقیم با مشاور',
  });

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Load site settings from server
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.phone) {
          setSiteSettings(data);
        }
      })
      .catch((err) => {
        console.log('Settings fetch error fallback to defaults:', err);
      });

    // Track homepage view
    trackEvent('page_view', { path: '/' });

    // Handle deep links or slug in pathname e.g. /article/district-22-investment-guide
    const path = window.location.pathname;
    if (path.startsWith('/article/')) {
      const slug = path.replace('/article/', '');
      const found = ARTICLES.find((a) => a.slug === slug);
      if (found) {
        setSelectedArticle(found);
      }
    } else if (path === '/admin') {
      setIsAdminOpen(true);
    }
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartQualification = () => {
    handleNavigate('qualification-flow');
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    window.history.pushState({}, '', `/article/${article.slug}`);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
    window.history.pushState({}, '', '/');
  };

  const handleSelectArticleBySlug = (slug: string) => {
    const found = ARTICLES.find((a) => a.slug === slug);
    if (found) {
      setSelectedArticle(found);
      window.history.pushState({}, '', `/article/${found.slug}`);
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSiteSettings(data.settings);
      }
    } catch (e) {
      setSiteSettings((prev) => ({ ...prev, ...newSettings }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans dir-rtl antialiased selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Header Navigation */}
      <Navbar
        phone={siteSettings.phone}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content */}
      <main id="hero">
        
        {/* Hero Section */}
        <HeroSection
          headline={siteSettings.headline}
          subheadline={siteSettings.subheadline}
          phone={siteSettings.phone}
          ctaText={siteSettings.ctaText}
          onStartQualification={handleStartQualification}
        />

        {/* 3-Question Investor Qualification Wizard */}
        <QualificationWizard phone={siteSettings.phone} />

        {/* Trust Content (6 Principles) */}
        <TrustSection phone={siteSettings.phone} />

        {/* 20 Useful Persian Investor Articles */}
        <ArticlesHub onSelectArticle={handleSelectArticle} />

      </main>

      {/* Footer */}
      <Footer
        phone={siteSettings.phone}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Persistent Mobile Bottom Call Bar */}
      <StickyMobileCallBar phone={siteSettings.phone} />

      {/* Article Detail Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        phone={siteSettings.phone}
        onClose={handleCloseArticle}
        onSelectArticleBySlug={handleSelectArticleBySlug}
        allArticles={ARTICLES}
      />

      {/* Protected Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        siteSettings={siteSettings}
        onUpdateSettings={handleUpdateSettings}
      />

    </div>
  );
}
