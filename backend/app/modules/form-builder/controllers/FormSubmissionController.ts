import type { HttpContext } from '@adonisjs/core/http'
import { createFormSubmissionValidator } from '#modules/form-builder/validators/FormSubmissionValidator'
import FormSubmissionService from '#modules/form-builder/services/FormSubmissionService'
import FormService from '#modules/form-builder/services/FormService'
import TicketService from '#modules/tickets/services/TicketService'

export default class FormSubmissionsController {
  async submissions({ params, response }: HttpContext) {
    const form = await FormService.get(params.id)
    await form.load('submissions')
    return response.ok(form.submissions)
  }

  async submission({ params, response }: HttpContext) {
    const formId = params.formId
    const submissionId = params.id
    const submission = await FormSubmissionService.getSubmission(formId, submissionId)
    return response.ok(submission)
  }

  async submit({ params, auth, request, response }: HttpContext) {
    const form = await FormService.get(params.formId)
    const { ticketId, data } = await createFormSubmissionValidator.validate(request.all())

    // validate that ticket belongs to this form's event
    if(await FormSubmissionService.validateFormEvent(ticketId, form.id)){
      return response.badRequest({message:"Ticket doesn't belong to form's event"})
    }

    // validate that user owns the ticket
    if (await TicketService.validateTicketOwner(ticketId, auth.user!.id)) {
      return response.unauthorized({
        message: "User can't fill the form for a ticket that they don't own",
      })
    }

    // validate submitted form data
    const validationErrors = await FormSubmissionService.validateSubmissionData(form.fields, data)
    if (validationErrors.length > 0) {
      return response.badRequest({ message: 'Validation failed', errors: validationErrors })
    }

    const submission = FormSubmissionService.createOrUpdate(ticketId, form, data)
    return response.created(submission)
  }

  async exportSubmissions({ params, request, response }: HttpContext) {
    const formId = Number(params.formId)
    const format = request.qs().format || 'json'
    const exportData = await FormSubmissionService.export(formId, format)

    if (format === 'csv') {
      response.header('Content-Type', 'text/csv')
      response.header(
        'Content-Disposition',
        `attachment; filename="form-${formId}-submissions.csv"`
      )

      const headers = exportData.headers ?? []
      const rows = exportData.rows ?? []
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n')

      return response.send(csvContent)
    }

    return response.ok(exportData)
  }
}
