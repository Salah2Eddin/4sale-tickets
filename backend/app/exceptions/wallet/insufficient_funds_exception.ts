import { Exception } from '@adonisjs/core/exceptions'

export default class InsufficientFundsException extends Exception {
  static status = 409
}