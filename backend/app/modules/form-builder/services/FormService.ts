import Form from '#modules/form-builder/models/Form'

export default class FormService {
  static async get(id: number) {
    const form = await Form.findOrFail(id)
    await form.load("submissions")
    return form
  }

  static async create(payload: Partial<Form>) {
    return Form.create(payload)
  }

  static async update(id: number, payload: Partial<Form>) {
    const form = await Form.findOrFail(id)
    form.merge(payload)
    await form.save()
    return form
  }

  static async delete(id: number) {
    const form = await Form.findOrFail(id)
    await form.delete()
  }

  static async getSchema(id: number) {
    const form = await Form.findOrFail(id)
    return form.fields
  }
}
