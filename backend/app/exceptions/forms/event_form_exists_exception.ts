import { Exception } from '@adonisjs/core/exceptions'

export default class EventFormExistsException extends Exception {
  static status = 400
  static code = 'E_EVENT_FORM_EXISTS'
  static message = "This event already has a form"
}