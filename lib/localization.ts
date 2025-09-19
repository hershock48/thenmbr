// Global Localization System
// Supports 25+ languages and regional customization

export interface LocaleConfig {
  code: string
  name: string
  nativeName: string
  region: string
  currency: string
  dateFormat: string
  timeFormat: string
  rtl: boolean
}

export interface LocalizedContent {
  [key: string]: string | LocalizedContent
}

export const supportedLocales: LocaleConfig[] = [
  // North America
  { code: 'en-US', name: 'English (US)', nativeName: 'English', region: 'US', currency: 'USD', dateFormat: 'MM/DD/YYYY', timeFormat: '12h', rtl: false },
  { code: 'en-CA', name: 'English (Canada)', nativeName: 'English', region: 'CA', currency: 'CAD', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'es-US', name: 'Spanish (US)', nativeName: 'Español', region: 'US', currency: 'USD', dateFormat: 'MM/DD/YYYY', timeFormat: '12h', rtl: false },
  { code: 'fr-CA', name: 'French (Canada)', nativeName: 'Français', region: 'CA', currency: 'CAD', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },

  // Europe
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English', region: 'GB', currency: 'GBP', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', region: 'DE', currency: 'EUR', dateFormat: 'DD.MM.YYYY', timeFormat: '24h', rtl: false },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', region: 'FR', currency: 'EUR', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', region: 'ES', currency: 'EUR', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', region: 'IT', currency: 'EUR', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'pt-PT', name: 'Portuguese', nativeName: 'Português', region: 'PT', currency: 'EUR', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'nl-NL', name: 'Dutch', nativeName: 'Nederlands', region: 'NL', currency: 'EUR', dateFormat: 'DD-MM-YYYY', timeFormat: '24h', rtl: false },
  { code: 'sv-SE', name: 'Swedish', nativeName: 'Svenska', region: 'SE', currency: 'SEK', dateFormat: 'YYYY-MM-DD', timeFormat: '24h', rtl: false },
  { code: 'no-NO', name: 'Norwegian', nativeName: 'Norsk', region: 'NO', currency: 'NOK', dateFormat: 'DD.MM.YYYY', timeFormat: '24h', rtl: false },
  { code: 'da-DK', name: 'Danish', nativeName: 'Dansk', region: 'DK', currency: 'DKK', dateFormat: 'DD.MM.YYYY', timeFormat: '24h', rtl: false },
  { code: 'fi-FI', name: 'Finnish', nativeName: 'Suomi', region: 'FI', currency: 'EUR', dateFormat: 'DD.MM.YYYY', timeFormat: '24h', rtl: false },
  { code: 'pl-PL', name: 'Polish', nativeName: 'Polski', region: 'PL', currency: 'PLN', dateFormat: 'DD.MM.YYYY', timeFormat: '24h', rtl: false },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', region: 'RU', currency: 'RUB', dateFormat: 'DD.MM.YYYY', timeFormat: '24h', rtl: false },

  // Asia Pacific
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', region: 'CN', currency: 'CNY', dateFormat: 'YYYY-MM-DD', timeFormat: '24h', rtl: false },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', region: 'TW', currency: 'TWD', dateFormat: 'YYYY/MM/DD', timeFormat: '24h', rtl: false },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', region: 'JP', currency: 'JPY', dateFormat: 'YYYY/MM/DD', timeFormat: '24h', rtl: false },
  { code: 'ko-KR', name: 'Korean', nativeName: '한국어', region: 'KR', currency: 'KRW', dateFormat: 'YYYY.MM.DD', timeFormat: '24h', rtl: false },
  { code: 'th-TH', name: 'Thai', nativeName: 'ไทย', region: 'TH', currency: 'THB', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'VN', currency: 'VND', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'id-ID', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'ID', currency: 'IDR', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'ms-MY', name: 'Malay', nativeName: 'Bahasa Melayu', region: 'MY', currency: 'MYR', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', region: 'IN', currency: 'INR', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'bn-BD', name: 'Bengali', nativeName: 'বাংলা', region: 'BD', currency: 'BDT', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },

  // Middle East & Africa
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', region: 'SA', currency: 'SAR', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: true },
  { code: 'he-IL', name: 'Hebrew', nativeName: 'עברית', region: 'IL', currency: 'ILS', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: true },
  { code: 'tr-TR', name: 'Turkish', nativeName: 'Türkçe', region: 'TR', currency: 'TRY', dateFormat: 'DD.MM.YYYY', timeFormat: '24h', rtl: false },
  { code: 'fa-IR', name: 'Persian', nativeName: 'فارسی', region: 'IR', currency: 'IRR', dateFormat: 'YYYY/MM/DD', timeFormat: '24h', rtl: true },

  // South America
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português', region: 'BR', currency: 'BRL', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'es-AR', name: 'Spanish (Argentina)', nativeName: 'Español', region: 'AR', currency: 'ARS', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español', region: 'MX', currency: 'MXN', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false },
  { code: 'es-CO', name: 'Spanish (Colombia)', nativeName: 'Español', region: 'CO', currency: 'COP', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', rtl: false }
]

export const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', region: 'US' },
  { code: 'EUR', name: 'Euro', symbol: '€', region: 'EU' },
  { code: 'GBP', name: 'British Pound', symbol: '£', region: 'GB' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', region: 'JP' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', region: 'CA' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', region: 'AU' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', region: 'CH' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', region: 'CN' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', region: 'IN' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', region: 'BR' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', region: 'MX' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', region: 'RU' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', region: 'KR' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', region: 'SG' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', region: 'NZ' }
]

// Translation keys for the platform
export const translations: { [locale: string]: LocalizedContent } = {
  'en-US': {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information'
    },
    navigation: {
      dashboard: 'Dashboard',
      stories: 'Impact Stories',
      analytics: 'Analytics',
      newsletters: 'Newsletters',
      marketplace: 'Marketplace',
      settings: 'Settings'
    },
    stories: {
      title: 'Impact Stories',
      create: 'Create Story',
      edit: 'Edit Story',
      delete: 'Delete Story',
      publish: 'Publish',
      draft: 'Draft',
      published: 'Published'
    },
    fundraising: {
      goal: 'Fundraising Goal',
      raised: 'Amount Raised',
      donors: 'Donors',
      progress: 'Progress',
      donate: 'Donate Now',
      share: 'Share Story'
    }
  },
  'es-ES': {
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      create: 'Crear',
      search: 'Buscar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      warning: 'Advertencia',
      info: 'Información'
    },
    navigation: {
      dashboard: 'Panel de Control',
      stories: 'Historias de Impacto',
      analytics: 'Analíticas',
      newsletters: 'Boletines',
      marketplace: 'Mercado',
      settings: 'Configuración'
    },
    stories: {
      title: 'Historias de Impacto',
      create: 'Crear Historia',
      edit: 'Editar Historia',
      delete: 'Eliminar Historia',
      publish: 'Publicar',
      draft: 'Borrador',
      published: 'Publicado'
    },
    fundraising: {
      goal: 'Meta de Recaudación',
      raised: 'Cantidad Recaudada',
      donors: 'Donantes',
      progress: 'Progreso',
      donate: 'Donar Ahora',
      share: 'Compartir Historia'
    }
  },
  'fr-FR': {
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      create: 'Créer',
      search: 'Rechercher',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      warning: 'Avertissement',
      info: 'Information'
    },
    navigation: {
      dashboard: 'Tableau de Bord',
      stories: 'Histoires d\'Impact',
      analytics: 'Analytiques',
      newsletters: 'Newsletters',
      marketplace: 'Marché',
      settings: 'Paramètres'
    },
    stories: {
      title: 'Histoires d\'Impact',
      create: 'Créer une Histoire',
      edit: 'Modifier l\'Histoire',
      delete: 'Supprimer l\'Histoire',
      publish: 'Publier',
      draft: 'Brouillon',
      published: 'Publié'
    },
    fundraising: {
      goal: 'Objectif de Collecte',
      raised: 'Montant Collecté',
      donors: 'Donateurs',
      progress: 'Progrès',
      donate: 'Faire un Don',
      share: 'Partager l\'Histoire'
    }
  },
  'de-DE': {
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      create: 'Erstellen',
      search: 'Suchen',
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      warning: 'Warnung',
      info: 'Information'
    },
    navigation: {
      dashboard: 'Dashboard',
      stories: 'Impact-Geschichten',
      analytics: 'Analytik',
      newsletters: 'Newsletter',
      marketplace: 'Marktplatz',
      settings: 'Einstellungen'
    },
    stories: {
      title: 'Impact-Geschichten',
      create: 'Geschichte Erstellen',
      edit: 'Geschichte Bearbeiten',
      delete: 'Geschichte Löschen',
      publish: 'Veröffentlichen',
      draft: 'Entwurf',
      published: 'Veröffentlicht'
    },
    fundraising: {
      goal: 'Fundraising-Ziel',
      raised: 'Gesammelter Betrag',
      donors: 'Spender',
      progress: 'Fortschritt',
      donate: 'Jetzt Spenden',
      share: 'Geschichte Teilen'
    }
  },
  'zh-CN': {
    common: {
      save: '保存',
      cancel: '取消',
      delete: '删除',
      edit: '编辑',
      create: '创建',
      search: '搜索',
      loading: '加载中...',
      error: '错误',
      success: '成功',
      warning: '警告',
      info: '信息'
    },
    navigation: {
      dashboard: '仪表板',
      stories: '影响故事',
      analytics: '分析',
      newsletters: '通讯',
      marketplace: '市场',
      settings: '设置'
    },
    stories: {
      title: '影响故事',
      create: '创建故事',
      edit: '编辑故事',
      delete: '删除故事',
      publish: '发布',
      draft: '草稿',
      published: '已发布'
    },
    fundraising: {
      goal: '筹款目标',
      raised: '已筹金额',
      donors: '捐赠者',
      progress: '进度',
      donate: '立即捐赠',
      share: '分享故事'
    }
  }
}

class LocalizationService {
  private currentLocale: string = 'en-US'
  private fallbackLocale: string = 'en-US'

  constructor() {
    // Detect user's preferred locale from browser
    if (typeof window !== 'undefined') {
      const browserLocale = navigator.language || 'en-US'
      const supportedLocale = this.getSupportedLocale(browserLocale)
      this.currentLocale = supportedLocale
    }
  }

  private getSupportedLocale(browserLocale: string): string {
    // Try exact match first
    if (supportedLocales.find(locale => locale.code === browserLocale)) {
      return browserLocale
    }

    // Try language match (e.g., 'en' matches 'en-US')
    const language = browserLocale.split('-')[0]
    const languageMatch = supportedLocales.find(locale => 
      locale.code.startsWith(language + '-')
    )
    
    if (languageMatch) {
      return languageMatch.code
    }

    // Fallback to default
    return this.fallbackLocale
  }

  setLocale(locale: string): void {
    if (supportedLocales.find(l => l.code === locale)) {
      this.currentLocale = locale
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('nmbr_locale', locale)
      }
    }
  }

  getCurrentLocale(): string {
    return this.currentLocale
  }

  getLocaleConfig(): LocaleConfig {
    const config = supportedLocales.find(l => l.code === this.currentLocale)
    return config || supportedLocales[0]
  }

  t(key: string, params?: { [key: string]: string | number }): string {
    const keys = key.split('.')
    let translation: any = translations[this.currentLocale] || translations[this.fallbackLocale]

    // Navigate through nested keys
    for (const k of keys) {
      translation = translation?.[k]
      if (!translation) {
        // Fallback to English
        translation = translations[this.fallbackLocale]
        for (const fallbackKey of keys) {
          translation = translation?.[fallbackKey]
        }
        break
      }
    }

    if (typeof translation !== 'string') {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }

    // Replace parameters
    if (params) {
      return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param]?.toString() || match
      })
    }

    return translation
  }

  formatCurrency(amount: number, currency?: string): string {
    const localeConfig = this.getLocaleConfig()
    const currencyCode = currency || localeConfig.currency

    try {
      return new Intl.NumberFormat(this.currentLocale, {
        style: 'currency',
        currency: currencyCode
      }).format(amount)
    } catch (error) {
      // Fallback formatting
      return `${currencyCode} ${amount.toFixed(2)}`
    }
  }

  formatDate(date: Date, format?: string): string {
    const localeConfig = this.getLocaleConfig()
    const dateFormat = format || localeConfig.dateFormat

    try {
      return new Intl.DateTimeFormat(this.currentLocale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date)
    } catch (error) {
      // Fallback formatting
      return date.toLocaleDateString()
    }
  }

  formatNumber(number: number): string {
    try {
      return new Intl.NumberFormat(this.currentLocale).format(number)
    } catch (error) {
      return number.toString()
    }
  }

  getSupportedLocales(): LocaleConfig[] {
    return supportedLocales
  }

  getSupportedCurrencies() {
    return currencies
  }

  isRTL(): boolean {
    return this.getLocaleConfig().rtl
  }
}

export const localizationService = new LocalizationService()

// React hook for using translations
export function useTranslation() {
  return {
    t: localizationService.t.bind(localizationService),
    locale: localizationService.getCurrentLocale(),
    setLocale: localizationService.setLocale.bind(localizationService),
    formatCurrency: localizationService.formatCurrency.bind(localizationService),
    formatDate: localizationService.formatDate.bind(localizationService),
    formatNumber: localizationService.formatNumber.bind(localizationService),
    isRTL: localizationService.isRTL.bind(localizationService),
    getSupportedLocales: localizationService.getSupportedLocales.bind(localizationService)
  }
}
