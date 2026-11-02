import { KuaishouVideoInfo, MediaItem } from '../utils/kuaishouParser';

export type { KuaishouVideoInfo, MediaItem };

export type LanguageCode = 'en' | 'es' | 'tr' | 'ru' | 'pt' | 'he';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  dir?: 'ltr' | 'rtl';
}

export interface SupportedPlatform {
  name: string;
  category: 'social' | 'video' | 'short-form' | 'music' | 'other';
  icon: string;
  color: string;
  urlPattern: string;
  popular?: boolean;
}
