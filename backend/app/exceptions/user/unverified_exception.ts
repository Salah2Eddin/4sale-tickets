import { Exception } from '@adonisjs/core/exceptions'

export default class UnverifiedUserExepction extends Exception {
  static status = 403
  static code = 'E_UNVERIFIED_USER'
}