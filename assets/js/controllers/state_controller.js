import Controller from './application_controller'
import { saveAs } from 'file-saver'
import isEqual from 'lodash/isEqual'
import { useCookie } from '../hooks'

const EXPORT_ALL = 'all'
const EXPORT_ALL_FILE_NAME = 'characters.json'
const DEFAULT_CHARACTER_FILE_NAME = 'unnamed_character.json'
const CHARACTER_FILE_MIME_TYPE = 'application/json;charset=utf-8'

const STATE_STORAGE_KEY = 'state'
const CHARACTER_DEFAULT_STATE = {
  weapons_amount: 4,
  spells_amount: 6,

  strength_modifier: 0,
  dexterity_modifier: 0,
  constitution_modifier: 0,
  intelligence_modifier: 0,
  wisdom_modifier: 0,
  charisma_modifier: 0,

  athletics: 0,
  acrobatics: 0,
  sleight_of_hand: 0,
  stealth: 0,
  arcana: 0,
  history: 0,
  investigation: 0,
  nature: 0,
  religion: 0,
  animal_handling: 0,
  insight: 0,
  medicine: 0,
  perception: 0,
  survival: 0,
  deception: 0,
  intimidation: 0,
  performance: 0,
  persuasion: 0
}

export default class extends Controller {
  static targets = ['input', 'importInput', 'charactersDropdown']
  static values = {
    defaultCharacterSheetName: String
  }

  static cookieNames = ['currentCharacterIndex']

  initialize () {
    useCookie(this)
  }

  connect () {
    this._load()
  }

  save ({ target, detail }) {
    const update = detail || target

    const newCharacters = this.characters
    newCharacters[this.currentCharacterIndex] = { ...this.currentCharacter, [update.id]: update.value }
    this.characters = newCharacters
  }

  export ({ params: { exportType } }) {
    let fileName
    let data

    if (exportType === EXPORT_ALL) {
      fileName = EXPORT_ALL_FILE_NAME
      data = this.characters
    } else {
      const character = this.currentCharacter
      fileName = character.character_sheet_name || DEFAULT_CHARACTER_FILE_NAME
      data = character
    }
    const blob = new Blob([JSON.stringify(data, undefined, 2)], { type: CHARACTER_FILE_MIME_TYPE })
    saveAs(blob, fileName)
  }

  async import (event) {
    const file = event.currentTarget.files[0]
    if (file === undefined) { return }

    let oldCharacters = this.characters
    if (isEqual(oldCharacters, [CHARACTER_DEFAULT_STATE])) { oldCharacters = [] }

    const data = await file.text()
    const newCharacters = oldCharacters.concat([JSON.parse(data)].flat())

    this.characters = newCharacters

    this.currentCharacterIndex = newCharacters.length === 0 ? 0 : newCharacters.length - 1
    this._load()
    this.importInputTarget.value = null
  }

  delete () {
    const newCharacters = this.characters.filter((_, index) => index !== this.currentCharacterIndex)

    this.characters = newCharacters
    this.currentCharacterIndex = newCharacters.length === 0 ? 0 : newCharacters.length - 1
    this._load()
  }

  selectCharacter () {
    this.currentCharacterIndex = this.charactersDropdownTarget.value
    this._load()
  }

  refreshCharactersDropdown () {
    this.charactersDropdownTarget.replaceChildren()

    this.characters.forEach((character, index) => {
      const option = new window.Option(
        character.character_sheet_name || '', index, false, index === this.currentCharacterIndex
      )
      if (!character.character_sheet_name) {
        option.dataset.i18nTarget = 'translation'
        option.dataset.t = this.defaultCharacterSheetNameValue
      }

      this.charactersDropdownTarget.add(option)
    })
  }

  add () {
    const newCharacters = [...this.characters, CHARACTER_DEFAULT_STATE]
    this.currentCharacterIndex = newCharacters.length - 1
    this.characters = newCharacters
    this._load()
  }

  clone () {
    const newCharacters = [...this.characters, { ...this.currentCharacter }]
    this.characters = newCharacters
    this.currentCharacterIndex = newCharacters.length - 1
    this._load()
  }

  _load () {
    if (this.characters.length === 0) { this.characters = [CHARACTER_DEFAULT_STATE] }

    const character = this.currentCharacter

    this.inputTargets.forEach((target) => {
      const value = character[target.id]
      target.value = value === undefined ? '' : value
    })
    this.refreshCharactersDropdown()

    setTimeout(() => this.dispatch('loaded', { detail: { state: character }, bubbles: true }))
  }

  get storedState () {
    return window.localStorage.getItem(STATE_STORAGE_KEY)
  }

  set storedState (serializedState) {
    window.localStorage.setItem(STATE_STORAGE_KEY, serializedState)
  }

  get characters () {
    return this.storedState ? JSON.parse(this.storedState) : []
  }

  set characters (newCharacters) {
    this.storedState = JSON.stringify(newCharacters)
  }

  get currentCharacterIndex () {
    return parseInt(this.currentCharacterIndexCookie, 10) || 0
  }

  set currentCharacterIndex (value) {
    this.currentCharacterIndexCookie = value.toString()
  }

  get currentCharacter () {
    return this.characters[this.currentCharacterIndex]
  }
}
