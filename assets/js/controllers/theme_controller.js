import Controller from './application_controller'
import { useCookie } from '../hooks'

const DARK_MODE_STATES = {
  enabled: 'true',
  disabled: 'false'
}

const THEME_META_TAG_SELECTOR = 'meta[name=theme-color]'
const THEME_COLORS = {
  dark: '#27272a',
  light: '#f5f5f5'
}

export default class extends Controller {
  static targets = ['body', 'toggle']
  static classes = ['darkMode', 'darkModeEnabled']
  static cookieNames = ['darkMode']

  initialize () {
    useCookie(this)
  }

  connect () {
    if (this.darkModeCookie === undefined) { this.darkModeCookie = DARK_MODE_STATES.enabled }

    this._toggleDarkMode()
  }

  toggle () {
    this.darkModeCookie = this.darkModeCookie === DARK_MODE_STATES.enabled
      ? DARK_MODE_STATES.disabled
      : DARK_MODE_STATES.enabled

    this._toggleDarkMode()
  }

  _toggleDarkMode () {
    const enabled = this.darkModeCookie === DARK_MODE_STATES.enabled

    this.bodyTarget.classList.toggle(this.darkModeClass, enabled)
    this.toggleTarget.classList.toggle(this.darkModeEnabledClass, enabled)

    const themeMetaTag = document.querySelector(THEME_META_TAG_SELECTOR)
    themeMetaTag.content = enabled ? THEME_COLORS.dark : THEME_COLORS.light
  }
}
