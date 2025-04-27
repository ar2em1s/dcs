import Controller from './application_controller'

export default class extends Controller {
  static targets = ['state']
  static values = { states: Array, id: String, currectState: String }
  static classes = ['hidden']

  connect () {
    this._toggleState(this.statesValue[0])
  }

  toggle () {
    const currentIndex = this.statesValue.indexOf(this.currentState)
    const nextState = this.statesValue[currentIndex + 1 < this.statesValue.length ? currentIndex + 1 : 0]

    this._toggleState(nextState)
    this._dispatchChangeEvent()
  }

  load ({ detail: { state } }) {
    const currentState = state[this.idValue] || this.statesValue[0]

    this._toggleState(currentState)
  }

  reset () {
    this._toggleState(this.statesValue[0])
  }

  _toggleState (state) {
    this.currentState = state
    const currentIndex = this.statesValue.indexOf(this.currentState)

    this.stateTargets.forEach((target, index) => {
      target.classList.toggle(this.hiddenClass, currentIndex !== index)
    })
  }

  _dispatchChangeEvent () {
    this.dispatch('change', { detail: { value: this.currentState, id: this.idValue } })
  }
}
