import { I18n } from 'i18n-js'
import enTranslations from '../locales/en.json'
import uaTranslations from '../locales/ua.json'
import ruTranslations from '../locales/ru.json'

import Controller from './application_controller'
import { useCookie } from '../hooks/use_cookie'

const LANGUAGES = ['en', 'ua', 'ru']

export default class extends Controller {
  static targets = ['toggle', 'translation']
  static classes = ['toggled']
  static cookieNames = ['locale']

  connect () {
    useCookie(this)

    this.i18n = new I18n({ en: enTranslations, ua: uaTranslations, ru: ruTranslations })

    this._setLocale(this.localeCookie || LANGUAGES[0])
    this._toggleLocale()
  }

  toggle () {
    const currentLocaleIndex = LANGUAGES.indexOf(this.localeCookie)
    const newLocaleIndex = currentLocaleIndex + 1 < LANGUAGES.length ? currentLocaleIndex + 1 : 0
    this._setLocale(LANGUAGES[newLocaleIndex])

    this.toggleTarget.classList.toggle(this.toggledClass, !this.toggleTarget.classList.contains(this.toggledClass))
    this._toggleLocale()
  }

  _setLocale (locale) {
    this.localeCookie = locale
    this.i18n.locale = locale
  }

  _toggleLocale () {
    this.translationTargets.forEach((target) => { target.innerHTML = this.i18n.t(target.dataset.t) })
  }
}
