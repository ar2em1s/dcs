import Controller from './application_controller'

export default class extends Controller {
  static targets = ['state', 'input']
  static values = { states: Array }
  static classes = ['hidden']

  connect () {
    this._toggleState(0)
  }

  toggle () {
    const currentIndex = this.statesValue.indexOf(this.inputTarget.value)
    const nextIndex = currentIndex + 1 < this.statesValue.length ? currentIndex + 1 : 0

    this._toggleState(nextIndex)
  }

  _toggleState (stateIndex) {
    this.inputTarget.value = this.statesValue[stateIndex]
    this.stateTargets.forEach((target, index) => {
      target.classList.toggle(this.hiddenClass, stateIndex !== index)
    })
  }
}
