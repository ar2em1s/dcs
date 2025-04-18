import Controller from './application_controller'
import { useCookie } from '../hooks/use_cookie'

const DARK_MODE_STATES = {
  enabled: 'true',
  disabled: 'false'
}

const THEME_COLORS = {
  [DARK_MODE_STATES.enabled]: '#1c1618',
  [DARK_MODE_STATES.disabled]: '#f5f5f5'
}

export default class extends Controller {
  static targets = ['body', 'toggle']
  static classes = ['darkMode', 'darkModeEnabled']
  static cookieNames = ['darkMode']

  connect () {
    useCookie(this)

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

    const themeMetaTag = document.querySelector('meta[name=theme-color]')
    themeMetaTag.content = THEME_COLORS[this.darkModeCookie]
  }
}
