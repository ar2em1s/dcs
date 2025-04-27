import Controller from './application_controller'

export default class extends Controller {
  static targets = ['input']
  static values = {
    id: String,
    negativePrefix: String,
    positivePrefix: String
  }

  tick ({ params: { tickValue } }) {
    const currentValue = parseInt(this.inputTarget.value, 10) || 0
    const newValue = currentValue + tickValue

    let prefix = ''
    if (newValue > 0) { prefix = this.positivePrefixValue } else if (newValue < 0) { prefix = this.negativePrefixValue }

    this.inputTarget.value = `${prefix}${Math.abs(newValue)}`

    this.dispatch('change', { detail: { id: this.idValue, value: this.inputTarget.value } })
  }

  load ({ detail: { state } }) {
    this.inputTarget.value = state[this.idValue]
  }
}
