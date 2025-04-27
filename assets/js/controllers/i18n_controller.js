import { I18n } from 'i18n-js'
import enTranslations from '../locales/en.json'
import uaTranslations from '../locales/ua.json'
import ruTranslations from '../locales/ru.json'

import Controller from './application_controller'
import { useCookie } from '../hooks'

const LANGUAGES = ['en', 'ua', 'ru']

export default class extends Controller {
  static targets = ['toggle', 'translation']
  static classes = ['toggled']
  static cookieNames = ['locale']

  initialize () {
    useCookie(this)
  }

  translationTargetConnected (target) {
    this._setTranslation(target)
  }

  toggle () {
    const currentLocaleIndex = LANGUAGES.indexOf(this.localeCookie)
    const newLocaleIndex = currentLocaleIndex + 1 < LANGUAGES.length ? currentLocaleIndex + 1 : 0
    this.locale = LANGUAGES[newLocaleIndex]

    this.toggleTarget.classList.toggle(this.toggledClass, !this.toggleTarget.classList.contains(this.toggledClass))
    this._translatePage()
  }

  _translatePage () {
    this.translationTargets.forEach((target) => this._setTranslation(target))
  }

  _setTranslation (target) {
    target.innerHTML = this.i18n.t(target.dataset.t)
  }

  get locale () {
    return this.localeCookie || LANGUAGES[0]
  }

  set locale (value) {
    this.localeCookie = value
    this.i18n.locale = value
  }

  get i18n () {
    if (this.i18nInstance) { return this.i18nInstance }

    this.i18nInstance = new I18n(
      { en: enTranslations, ua: uaTranslations, ru: ruTranslations }, { locale: this.locale }
    )

    return this.i18nInstance
  }
}
