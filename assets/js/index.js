import { Application } from '@hotwired/stimulus'
import { ThemeController, I18nController, MultiToggleController } from './controllers'

window.Stimulus = Application.start()

window.Stimulus.register('theme', ThemeController)
window.Stimulus.register('i18n', I18nController)
window.Stimulus.register('multi-toggle', MultiToggleController)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { scope: '/dcs/' })
  })
}
