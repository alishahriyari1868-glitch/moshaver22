import React, { useState } from 'react';
import { Phone, Check, HelpCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { calculateLeadScore, saveLeadSubmission, trackEvent } from '../lib/analytics';

interface QualificationWizardProps {
  phone: string;
}

export const QualificationWizard: React.FC<QualificationWizardProps> = ({ phone }) => {
  const [step, setStep] = useState<number>(0); // 0: not started, 1, 2, 3: questions, 4: result
  const [budget, setBudget] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');
  const [mainGoal, setMainGoal] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const budgetOptions = [
    'کمتر از ۲ میلیارد',
    '۲ تا ۵ میلیارد',
    '۵ تا ۱۰ میلیارد',
    'بیشتر از ۱۰ میلیارد',
    'ترجیح می‌دهم نگویم'
  ];

  const timelineOptions = [
    'همین هفته',
    'این ماه',
    '۱ تا ۳ ماه آینده',
    'فعلاً فقط تحقیق می‌کنم'
  ];

  const goalOptions = [
    'سرمایه‌گذاری',
    'حفظ ارزش سرمایه',
    'خرید برای آینده',
    'فقط تحقیق'
  ];

  const handleStart = () => {
    setStep(1);
    trackEvent('question_start');
  };

  const handleSelectBudget = (opt: string) => {
    setBudget(opt);
    setStep(2);
  };

  const handleSelectTimeline = (opt: string) => {
    setTimeline(opt);
    setStep(3);
  };

  const handleSelectGoal = async (opt: string) => {
    setMainGoal(opt);
    setIsSubmitting(true);

    const score = calculateLeadScore(budget, timeline, opt);

    await saveLeadSubmission({
      budget,
      timeline,
      mainGoal: opt,
      score,
      timestamp: Date.now()
    });

    setIsSubmitting(false);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setBudget('');
    setTimeline('');
    setMainGoal('');
  };

  return (
    <section id="qualification-flow" className="py-12 sm:py-16 bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Container Box */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          
          {/* Header Indicator */}
          <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>ارزیابی هوشمند شرایط سرمایه‌گذاری</span>
            </div>
            {step > 0 && step < 4 && (
              <span className="text-xs text-slate-400 font-mono">
                مرحله {step} از ۳
              </span>
            )}
          </div>

          {/* STEP 0: INITIAL ENTRY */}
          {step === 0 && (
            <div className="text-center py-4">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 text-slate-100">
                آیا سرمایه‌گذاری در منطقه ۲۲ برای شرایط شما مناسب است؟
              </h2>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                با پاسخ به ۳ سوال کوتاه، بهترین نقشه راه سرمایه‌گذاری بدون ریسک متناسب با بودجه و زمان‌بندی شما مشخص می‌شود.
              </p>
              <button
                onClick={handleStart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-base transition-all active:scale-95 shadow-lg"
                id="start-qualification-btn"
              >
                <span>شروع ارزیابی ۳ سوالی</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          )}

          {/* STEP 1: BUDGET QUESTION */}
          {step === 1 && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-100">
                سوال ۱: حدود بودجه‌ای که برای سرمایه‌گذاری در نظر داری؟
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                لطفاً محدوده بودجه نقدینگی یا سرمایه اولیه خود را انتخاب کنید:
              </p>
              <div className="space-y-2.5">
                {budgetOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectBudget(opt)}
                    className="w-full text-right p-3.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/80 hover:border-amber-500/50 text-slate-200 text-sm font-medium transition-all flex items-center justify-between group"
                  >
                    <span>{opt}</span>
                    <span className="w-5 h-5 rounded-full border border-slate-500 group-hover:border-amber-400 group-hover:bg-amber-400/20 transition-all flex items-center justify-center" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: TIMELINE QUESTION */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                  سوال ۲: چه زمانی قصد تصمیم‌گیری داری؟
                </h3>
                <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-slate-200">
                  بازگشت
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-5">
                افق زمانی برنامه شما برای اقدام نهایی چیست؟
              </p>
              <div className="space-y-2.5">
                {timelineOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectTimeline(opt)}
                    className="w-full text-right p-3.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/80 hover:border-amber-500/50 text-slate-200 text-sm font-medium transition-all flex items-center justify-between group"
                  >
                    <span>{opt}</span>
                    <span className="w-5 h-5 rounded-full border border-slate-500 group-hover:border-amber-400 group-hover:bg-amber-400/20 transition-all flex items-center justify-center" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: MAIN GOAL QUESTION */}
          {step === 3 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                  سوال ۳: هدف اصلی تو چیست؟
                </h3>
                <button onClick={() => setStep(2)} className="text-xs text-slate-400 hover:text-slate-200">
                  بازگشت
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-5">
                اولویت اصلی شما از ورود به بازار املاک منطقه ۲۲ کدام است؟
              </p>
              <div className="space-y-2.5">
                {goalOptions.map((opt, i) => (
                  <button
                    key={i}
                    disabled={isSubmitting}
                    onClick={() => handleSelectGoal(opt)}
                    className="w-full text-right p-3.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/80 hover:border-amber-500/50 text-slate-200 text-sm font-medium transition-all flex items-center justify-between group"
                  >
                    <span>{opt}</span>
                    <span className="w-5 h-5 rounded-full border border-slate-500 group-hover:border-amber-400 group-hover:bg-amber-400/20 transition-all flex items-center justify-center" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: FINAL RESULT & PHONE CTA */}
          {step === 4 && (
            <div className="text-center py-2 animate-fade-in">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>

              {/* Exact Prompt Required Text */}
              <p className="text-base sm:text-lg font-bold text-slate-100 mb-6 leading-relaxed">
                «به نظر می‌رسد صحبت با یک مشاور می‌تواند برای تصمیم‌گیری شما مفید باشد.»
              </p>

              <div className="bg-slate-900/80 border border-slate-700/80 p-5 rounded-2xl mb-6 text-right text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                  <span>خلاصه اطلاعات ثبت‌شده:</span>
                  <span className="text-emerald-400 font-medium">ارزیابی موفق</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">محدوده بودجه:</span>
                  <span className="font-semibold text-slate-200">{budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">زمان تصمیم‌گیری:</span>
                  <span className="font-semibold text-slate-200">{timeline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">هدف اصلی:</span>
                  <span className="font-semibold text-slate-200">{mainGoal}</span>
                </div>
              </div>

              {/* Exact Prompt Required Phone CTA */}
              <a
                href={`tel:${phone}`}
                onClick={() => trackEvent('phone_click', { location: 'qualification_result_cta' })}
                className="w-full inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-4 rounded-xl text-lg shadow-lg transition-all active:scale-95"
                id="qualification-phone-cta"
              >
                <Phone className="w-5 h-5 fill-slate-950" />
                <span>«📞 تماس با مشاور»</span>
              </a>

              <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
                <span>شماره تماس مستقیم: <strong className="text-slate-200 font-mono dir-ltr inline-block">{phone}</strong></span>
                <button onClick={handleReset} className="underline hover:text-slate-200">
                  تنظیم مجدد پاسخ‌ها
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
};
