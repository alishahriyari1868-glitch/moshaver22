export interface Article {
  id: number;
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  readTime: string;
  summary: string;
  paragraphs: string[];
  checklists?: string[];
  warningNote?: string;
  tags: string[];
  schemaType: 'Article' | 'FAQPage' | 'HowTo';
  updatedAt: string;
}

export interface QualificationData {
  id?: string;
  budget: string;
  timeline: string;
  mainGoal: string;
  score: number;
  timestamp: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  pagePath?: string;
}

export interface AnalyticsEvent {
  id?: string;
  type: 'page_view' | 'cta_impression' | 'cta_click' | 'question_start' | 'question_complete' | 'phone_click';
  path: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  score?: number;
  timestamp: number;
  meta?: Record<string, any>;
}

export interface AnalyticsStats {
  timeframe: 'today' | 'week' | 'month' | 'all';
  visitors: number;
  ctaImpressions: number;
  ctaClicks: number;
  questionStarts: number;
  questionCompletions: number;
  qualifiedLeads: number;
  phoneClicks: number;
  conversionRate: number; // percentage
  winners: Array<{ page: string; title: string; calls: number; conversion: number }>;
  bestTopics: Array<{ topic: string; leadsCount: number; avgScore: number }>;
  lowValuePages: Array<{ page: string; title: string; views: number; calls: number }>;
  recommendations: string[];
  recentLeads: QualificationData[];
}

export interface SiteSettings {
  phone: string;
  headline: string;
  subheadline: string;
  ctaText: string;
}

export interface TrustTopic {
  id: string;
  title: string;
  iconName: string;
  summary: string;
  details: string[];
  checklist: string[];
  warningNote: string;
}
