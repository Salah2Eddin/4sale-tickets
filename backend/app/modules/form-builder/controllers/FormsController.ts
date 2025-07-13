import type { HttpContext } from '@adonisjs/core/http'
import FormService from '#modules/form-builder/services/FormService'
import { createFormValidator, updateFormValidator } from '#modules/form-builder/validators/FormValidator'

export default class FormsController {
  async get({ params, response }: HttpContext) {
    const form = await FormService.get(params.id)
    return response.ok(form)
  }

  async create({ request, response }: HttpContext) {
    const payload = await createFormValidator.validate(request.all())
    const form = await FormService.create(payload)
    return response.created(form)
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await updateFormValidator.validate(request.all())
    const form = await FormService.update(params.id, payload)
    return response.ok(form)
  }
}
