import Controller from './application_controller'

export default class extends Controller {
  static targets = ['input', 'item']
  static classes = ['hidden']
  static values = {
    id: String
  }

  update () {
    this._updateItems(this.inputTarget.value)
    this._dispatchChangeEvent()
  }

  load ({ detail: { state } }) {
    const value = state[this.idValue]

    this.inputTarget.value = value
    this._updateItems(value)
  }

  _updateItems (value) {
    const visibleAmount = Number(value)

    this.itemTargets.forEach((target, index) => {
      target.classList.toggle(this.hiddenClass, index >= visibleAmount)
    })
  }

  _dispatchChangeEvent () {
    this.dispatch('change', { detail: { id: this.idValue, value: this.inputTarget.value } })
  }
}
