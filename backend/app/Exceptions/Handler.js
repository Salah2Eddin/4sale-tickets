'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception and return a custom response
   */
  async handle (error, { response }) {
    if (error.status === 404) {
      return response.status(404).send('Not Found')
    }

    return response.status(error.status || 500).send(error.message)
  }

  /**
   * Report exception (e.g., log it)
   */
  async report (error, { request }) {
    console.error(error)
  }
}

module.exports = ExceptionHandler