'use strict'

import type { HttpContext } from '@adonisjs/core/http'
import AdminService from '#modules/admins/services/AdminService'
import { addEventValidator, addMoneyValidator, createAdminValidator, createEventOrganizerValidator, createUserValidator, generateTicketValidator, updateAdminValidator } from '#modules/admins/validators/AdminValidators'

export default class AdminsController {
  async getAllAdmins() {
    return AdminService.getAllAdmins()
  }

  async getAdminById({ params }: HttpContext) {
    return AdminService.getAdminById(params.id)
  }

  async createAdmin({ request }: HttpContext) {
    const data = await request.validateUsing(createAdminValidator)
    return AdminService.createAdmin(data)
  }

  async createEventOrganizer({request}: HttpContext){
    const payload = await request.validateUsing(createEventOrganizerValidator)
    return AdminService.createAdmin({ ...payload, abilities: ['event-organizer'] })
  }

  async updateAdmin({ params, request }: HttpContext) {
    const updates = await request.validateUsing(updateAdminValidator)
    return AdminService.updateAdmin(params.id, updates)
  }

  async deleteAdmin({ params }: HttpContext) {
    return AdminService.deleteAdmin(params.id)
  }

  async createUser({ request }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)
    return AdminService.createUser(data)
  }

  async addEvent({ request }: HttpContext) {
    const eventData = await request.validateUsing(addEventValidator)
    return AdminService.addEvent(eventData)
  }

  async addMoney({ request }: HttpContext) {
    const { userId, amount } = await request.validateUsing(addMoneyValidator)
    return AdminService.addMoneyToWallet(userId, amount)
  }

  async generateTicket({ request }: HttpContext) {
    const { userId, eventId, seatId, ticketCount } = await request.validateUsing(generateTicketValidator)
    return AdminService.generateTicketForUser(userId, eventId, seatId, ticketCount)
  }

  // async banUser({ params }: HttpContext) {
  //   return AdminService.banUser(params.userId)
  // }

  // async unbanUser({ params }: HttpContext) {
  //   return AdminService.unbanUser(params.userId)
  // }
}