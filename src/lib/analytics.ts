import { AnalyticsEvent, QualificationData } from '../types';

export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmContent: params.get('utm_content') || '',
  };
}

export function calculateLeadScore(budget: string, timeline: string, mainGoal: string): number {
  let score = 0;

  // Budget scoring (max 40)
  if (budget.includes('بیشتر از ۱۰')) score += 40;
  else if (budget.includes('۵ تا ۱۰')) score += 35;
  else if (budget.includes('۲ تا ۵')) score += 25;
  else if (budget.includes('کمتر از ۲')) score += 15;
  else score += 20; // ترجیح می‌دهم نگویم

  // Timeline scoring (max 40)
  if (timeline.includes('همین هفته')) score += 40;
  else if (timeline.includes('این ماه')) score += 30;
  else if (timeline.includes('۱ تا ۳')) score += 20;
  else score += 10; // فقط تحقیق

  // Goal scoring (max 20)
  if (mainGoal.includes('سرمایه‌گذاری')) score += 20;
  else if (mainGoal.includes('حفظ ارزش')) score += 15;
  else if (mainGoal.includes('خرید برای آینده')) score += 15;
  else score += 5;

  return Math.min(100, Math.max(0, score));
}

export async function trackEvent(
  type: AnalyticsEvent['type'],
  meta: Record<string, any> = {}
): Promise<void> {
  const utm = getUtmParams();
  const path = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
  
  const payload: AnalyticsEvent = {
    type,
    path,
    source: utm.utmSource,
    medium: utm.utmMedium,
    campaign: utm.utmCampaign,
    content: utm.utmContent,
    timestamp: Date.now(),
    meta,
  };

  // Local storage backup
  try {
    const existingStr = localStorage.getItem('district22_events');
    const existing: AnalyticsEvent[] = existingStr ? JSON.parse(existingStr) : [];
    existing.push(payload);
    // Keep max 500 events locally
    if (existing.length > 500) existing.shift();
    localStorage.setItem('district22_events', JSON.stringify(existing));
  } catch (e) {
    console.error('LocalStorage analytics write error:', e);
  }

  // API Call
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Silent fail on network/static mode
  }
}

export async function saveLeadSubmission(data: QualificationData): Promise<void> {
  const utm = getUtmParams();
  const payload: QualificationData = {
    ...data,
    id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: Date.now(),
    utmSource: utm.utmSource,
    utmMedium: utm.utmMedium,
    utmCampaign: utm.utmCampaign,
    utmContent: utm.utmContent,
    pagePath: typeof window !== 'undefined' ? window.location.pathname : '/',
  };

  // Save to local storage
  try {
    const existingStr = localStorage.getItem('district22_leads');
    const existing: QualificationData[] = existingStr ? JSON.parse(existingStr) : [];
    existing.unshift(payload);
    localStorage.setItem('district22_leads', JSON.stringify(existing));
  } catch (e) {
    console.error('Lead storage error:', e);
  }

  // Post to server
  await trackEvent('question_complete', {
    score: data.score,
    budget: data.budget,
    timeline: data.timeline,
    goal: data.mainGoal,
  });
}
