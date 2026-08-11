import React, { useState, useEffect } from 'react';
import { AnalyticsStats, SiteSettings } from '../types';
import { Lock, RefreshCw, Trophy, AlertTriangle, Lightbulb, Users, PhoneCall, TrendingUp, CheckCircle, Save, X, Eye, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  siteSettings: SiteSettings;
  onUpdateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  siteSettings,
  onUpdateSettings,
}) => {
  const [passcode, setPasscode] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Editable settings local state
  const [editPhone, setEditPhone] = useState<string>(siteSettings.phone);
  const [editHeadline, setEditHeadline] = useState<string>(siteSettings.headline);
  const [editSubheadline, setEditSubheadline] = useState<string>(siteSettings.subheadline);
  const [editCtaText, setEditCtaText] = useState<string>(siteSettings.ctaText);
  const [settingsSuccess, setSettingsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, timeframe]);

  useEffect(() => {
    setEditPhone(siteSettings.phone);
    setEditHeadline(siteSettings.headline);
    setEditSubheadline(siteSettings.subheadline);
    setEditCtaText(siteSettings.ctaText);
  }, [siteSettings]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2083' || passcode === '09124362083' || passcode === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('رمز عبور نادرست است. (رمز عبور پیش‌فرض: 2083)');
    }
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analytics/stats?timeframe=${timeframe}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Fetch stats error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings({
      phone: editPhone,
      headline: editHeadline,
      subheadline: editSubheadline,
      ctaText: editCtaText,
    });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto text-slate-100">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-900/95 border-b border-slate-800 px-6 py-4 flex items-center justify-between backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              📊
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-100">
                پنل مدیریت و تحلیل لیدهای منطقه ۲۲
              </h2>
              <span className="text-xs text-slate-400 block -mt-0.5">
                پایش نرخ تبدیل تماس‌های تلفنی و عملکرد محتوایی
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AUTH CHECK */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-5 my-8">
            <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">ورود به پنل مدیریت</h3>
            <p className="text-xs text-slate-400">
              جهت مشاهده گزارشات بازدهی و لیدها رمز عبور را وارد کنید. (رمز عبور آزمایشی: <strong className="text-amber-400 font-mono">2083</strong>)
            </p>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="رمز عبور مدیریت..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-center text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono text-lg"
              />
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl transition-all"
              >
                ورود به پنل
              </button>
            </form>
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Timeframe Selector & Refresh */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">بازه زمانی:</span>
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setTimeframe('today')}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      timeframe === 'today' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    امروز (TODAY)
                  </button>
                  <button
                    onClick={() => setTimeframe('week')}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      timeframe === 'week' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    این هفته (THIS WEEK)
                  </button>
                  <button
                    onClick={() => setTimeframe('month')}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      timeframe === 'month' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    این ماه (THIS MONTH)
                  </button>
                  <button
                    onClick={() => setTimeframe('all')}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      timeframe === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    کل دوره
                  </button>
                </div>
              </div>

              <button
                onClick={fetchStats}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-400 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>بروزرسانی داده‌ها</span>
              </button>
            </div>

            {/* KEY METRICS CARDS */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>بازدیدکنندگان</span>
                    <Eye className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-100 font-mono">
                    {stats.visitors}
                  </div>
                  <span className="text-[10px] text-slate-400">تعداد بازدید از صفحات</span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>تکمیل تست ارزیابی</span>
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-purple-300 font-mono">
                    {stats.questionCompletions}
                  </div>
                  <span className="text-[10px] text-slate-400">لیدهای ارزیابی‌شده</span>
                </div>

                <div className="bg-slate-800/80 border border-amber-500/40 p-4 rounded-2xl bg-amber-500/5">
                  <div className="flex items-center justify-between text-xs text-amber-400 mb-1 font-semibold">
                    <span>کلیک‌های تماس (KPI اصلی)</span>
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400 font-mono">
                    {stats.phoneClicks}
                  </div>
                  <span className="text-[10px] text-amber-300/80">هدف: ۳۰+ تماس باکیفیت روزانه</span>
                </div>

                <div className="bg-slate-800/80 border border-emerald-500/40 p-4 rounded-2xl bg-emerald-500/5">
                  <div className="flex items-center justify-between text-xs text-emerald-400 mb-1 font-semibold">
                    <span>نرخ تبدیل به تماس</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {stats.conversionRate}%
                  </div>
                  <span className="text-[10px] text-emerald-300/80">نسبت تماس به بازدید</span>
                </div>

              </div>
            )}

            {/* CHART SUMMARY */}
            {stats && (
              <div className="bg-slate-800/60 border border-slate-700 p-5 rounded-2xl space-y-3">
                <h3 className="font-bold text-sm text-slate-200">نمودار توزیع بازدهی لیدها و تماس‌ها</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'بازدیدکننده', count: stats.visitors },
                        { name: 'مشاهده CTA', count: stats.ctaImpressions },
                        { name: 'شروع ارزیابی', count: stats.questionStarts },
                        { name: 'تکمیل ارزیابی', count: stats.questionCompletions },
                        { name: 'لید باکیفیت', count: stats.qualifiedLeads },
                        { name: 'کلیک تماس (0912)', count: stats.phoneClicks },
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#475569', borderRadius: '12px' }} />
                      <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* WINNERS & BEST INVESTMENT TOPICS & LOW VALUE PAGES */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* WINNERS SECTION */}
                <div className="bg-slate-800/80 border border-amber-500/30 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-slate-700 pb-2">
                    <Trophy className="w-4 h-4" />
                    <span>برندگان (WINNERS)</span>
                  </div>
                  <p className="text-xs text-slate-400">صفحات با بالاترین نرخ تبدیل تماس تلفنی:</p>
                  <div className="space-y-2">
                    {stats.winners.map((w, idx) => (
                      <div key={idx} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60 text-xs flex items-center justify-between">
                        <span className="font-semibold text-slate-200 line-clamp-1">{w.title}</span>
                        <span className="text-amber-400 font-mono shrink-0 mr-2">{w.calls} تماس</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BEST INVESTMENT TOPICS SECTION */}
                <div className="bg-slate-800/80 border border-emerald-500/30 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-slate-700 pb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>بهترین موضوعات (BEST TOPICS)</span>
                  </div>
                  <p className="text-xs text-slate-400">موضوعاتی که قوی‌ترین لیدها را تولید کرده‌اند:</p>
                  <div className="space-y-2">
                    {stats.bestTopics.map((bt, idx) => (
                      <div key={idx} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60 text-xs flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{bt.topic}</span>
                        <span className="text-emerald-400 font-mono shrink-0 mr-2">{bt.leadsCount} لید</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LOW-VALUE PAGES SECTION */}
                <div className="bg-slate-800/80 border border-rose-500/30 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm border-b border-slate-700 pb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>صفحات کم‌بازده (LOW-VALUE)</span>
                  </div>
                  <p className="text-xs text-slate-400">صفحات با بازدید ولی بدون تبدیل تماس:</p>
                  <div className="space-y-2">
                    {stats.lowValuePages.length === 0 ? (
                      <span className="text-xs text-slate-500">تمام صفحات عملکرد مطلوبی دارند.</span>
                    ) : (
                      stats.lowValuePages.map((lv, idx) => (
                        <div key={idx} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60 text-xs flex items-center justify-between">
                          <span className="font-semibold text-slate-300 line-clamp-1">{lv.title}</span>
                          <span className="text-rose-400 font-mono shrink-0 mr-2">{lv.views} بازدید</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* AI RECOMMENDATIONS SECTION */}
            {stats && (
              <div className="bg-amber-500/10 border border-amber-500/40 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>پیشنهادات هوشمند بهبود نرخ تبدیل (RECOMMENDATIONS)</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  {stats.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* RECENT QUALIFIED LEADS LOG */}
            {stats && stats.recentLeads && (
              <div className="bg-slate-800/60 border border-slate-700 p-5 rounded-2xl space-y-4">
                <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>دفترچه ثبت آخرین لیدهای ارزیابی‌شده</span>
                </h3>

                {stats.recentLeads.length === 0 ? (
                  <p className="text-xs text-slate-400">هنوز لیدی ثبت نشده است.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="p-2">زمان ثبت</th>
                          <th className="p-2">محدوده بودجه</th>
                          <th className="p-2">افق تصمیم‌گیری</th>
                          <th className="p-2">هدف اصلی</th>
                          <th className="p-2">امتیاز قصد (Intent Score)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentLeads.map((lead, idx) => (
                          <tr key={idx} className="border-b border-slate-800/80 hover:bg-slate-800/40">
                            <td className="p-2 font-mono text-slate-400">
                              {new Date(lead.timestamp).toLocaleTimeString('fa-IR')}
                            </td>
                            <td className="p-2 font-semibold text-slate-200">{lead.budget}</td>
                            <td className="p-2 text-slate-300">{lead.timeline}</td>
                            <td className="p-2 text-slate-300">{lead.mainGoal}</td>
                            <td className="p-2">
                              <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                                lead.score >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                              }`}>
                                {lead.score} / 100
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* EDIT SITE SETTINGS FORM */}
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Save className="w-4 h-4 text-amber-400" />
                <span>ویرایش اطلاعات عمومی وب‌سایت</span>
              </h3>

              {settingsSuccess && (
                <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 p-3 rounded-xl text-xs font-semibold">
                  تغییرات وب‌سایت با موفقیت ذخیره شد.
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">شماره تلفن مستقیم مشاور:</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">متن دکمه اصلی (CTA):</label>
                    <input
                      type="text"
                      value={editCtaText}
                      onChange={(e) => setEditCtaText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">تیتر اصلی هوم‌پایج (Hero Headline):</label>
                  <input
                    type="text"
                    value={editHeadline}
                    onChange={(e) => setEditHeadline(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">زیرتیتر هوم‌پایج (Subheadline):</label>
                  <textarea
                    rows={2}
                    value={editSubheadline}
                    onChange={(e) => setEditSubheadline(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  ذخیره تنظیمات
                </button>

              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
