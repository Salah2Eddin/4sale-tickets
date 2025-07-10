import vine from '@vinejs/vine'
import Form from '#modules/form-builder/models/Form'
import FormSubmission from '#modules/form-builder/models/FormSubmission'
import TicketService from '#modules/tickets/services/TicketService'

export default class FormSubmissionService {
  static async getSubmission(formId: number, id: number) {
    return FormSubmission.query()
      .where('id', id)
      .where('form_id', formId)
      .preload('form')
      .firstOrFail()
  }

  static async createOrUpdate(ticketId: number, form: Form, data: Record<string, any>) {
    // if ticket submitted this form, update submission data
    // otherwise create a new submission
    if (await this.isFirstSubmission(ticketId)) {
      const submission = await FormSubmissionService.createSubmission(form, data)
      return submission
    } else {
      const submission = await FormSubmissionService.updateSubmission(ticketId, data)
      return submission
    }
  }

  static async createSubmission(form: Form, data: Record<string, any>) {
    return FormSubmission.create({
      formId: form.id,
      data: data,
    })
  }

  static async updateSubmission(ticketId: number, data: Record<string, any>) {
    const submission = await FormSubmission.findByOrFail({ticketId: ticketId})
    submission.merge({
      data: data
    })
    await submission.save()
  }

  static async validateFormEvent(formId: number, ticketId: number): Promise<boolean> {
    const ticket = await TicketService.getTicketById(ticketId)
    const form = await Form.findOrFail(formId)
    return ticket?.eventId == form.eventId
  }

  static async isFirstSubmission(ticketId: number): Promise<boolean> {
    const submission = await FormSubmission.findBy({ ticketId: ticketId })
    return submission == null
  }

  static async validateSubmissionData(fields: any[], data: Record<string, any>): Promise<string[]> {
    const schemaObject: Record<string, any> = {}

    for (const field of fields) {
      let validator: any

      switch (field.type) {
        case 'email':
          validator = vine.string().email()
          break
        case 'number':
          validator = vine.number()
          break
        case 'select':
        case 'radio':
          validator = field.options ? vine.enum(field.options) : vine.string()
          break
        case 'checkbox':
          validator = field.options
            ? vine.array(vine.enum(field.options))
            : vine.array(vine.string())
          break
        default:
          validator = vine.string()
      }

      schemaObject[field.id] = field.required ? validator : validator.optional()
    }

    const schema = vine.object(schemaObject)

    const result = await vine.compile(schema).validate(data)

    if (result.errors) {
      return result.errors
    }

    return []
  }

  static async export(formId: number, format: 'json' | 'csv') {
    const form = await Form.findOrFail(formId)
    await form.load('event')
    await form.load('submissions')
    const submissions = form.submissions

    if (format === 'json') {
      return {
        form: {
          id: form.id,
          title: form.event.title,
          description: form.event.description,
          fields: form.fields,
        },
        submissions: submissions.map((sub) => ({
          id: sub.id,
          data: sub.data,
          submittedAt: sub.createdAt,
        })),
      }
    }

    // CSV format
    const headers = form.fields.map((field) => field.label)
    const rows = submissions.map((sub) => form.fields.map((field) => sub.data[field.id] || ''))

    return {
      headers: ['ID', 'Submitted At', ...headers],
      rows: submissions.map((sub, index) => [sub.id, sub.createdAt.toISO(), ...rows[index]]),
    }
  }
}
