import Controller from './application_controller'

export default class extends Controller {
  static targets = ['input']

  toggle () {
    this.inputTarget.disabled = !this.inputTarget.disabled
  }

  reset () {
    this.inputTarget.disabled = true
    this.dispatch('reset', { bubbles: true })
  }
}
