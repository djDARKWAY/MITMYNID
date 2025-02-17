import polyglotI18nProvider from 'ra-i18n-polyglot';
import portugueseMessages from './pt';

export const i18nProvider = polyglotI18nProvider(locale => {

    if (locale === 'fr') {
        return import('./fr').then(messages => messages.default)
    }

    if (locale === 'es') {
        return import('./es').then(messages => messages.default)
    }


    if (locale === 'en-us') {
        return import('./en').then(messages => messages.default)
    }

    // Always fallback on PT
    return portugueseMessages;
}, 'pt-pt', [{ locale: 'pt-pt', name: 'PT' }, { locale: 'en-us', name: 'EN' }, { locale: 'fr', name: 'FR' }, { locale: 'es', name: 'ES' }], { allowMissing: true });

export const locales = [
    'pt-pt',
    'en-us',
    'fr',
    'es',
]
