import { Application } from '@hotwired/stimulus'
import {
  ThemeController,
  I18nController,
  MultiToggleController,
  PaginationController,
  StateController,
  CounterController,
  ConfirmationController
} from './controllers'

window.Stimulus = Application.start()

Object.entries(
  {
    theme: ThemeController,
    i18n: I18nController,
    'multi-toggle': MultiToggleController,
    pagination: PaginationController,
    state: StateController,
    counter: CounterController,
    confirmation: ConfirmationController
  }
).forEach(([key, controllerClass]) => window.Stimulus.register(key, controllerClass))

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { scope: '/dcs/' })
  })
}
