'use strict'

import type { HttpContext } from '@adonisjs/core/http'
import AdminService from '#modules/admins/services/AdminService'

export default class AdminsController {
  async getAllAdmins() {
    return AdminService.getAllAdmins()
  }

  async getAdminById({ params }: HttpContext) {
    return AdminService.getAdminById(params.id)
  }

  async createAdmin({ request }: HttpContext) {
    const data = request.only(['email', 'password', 'abilities'])
    return AdminService.createAdmin(data)
  }

  async updateAdmin({ params, request }: HttpContext) {
    const updates = request.only(['email', 'password', 'abilities'])
    return AdminService.updateAdmin(params.id, updates)
  }

  async deleteAdmin({ params }: HttpContext) {
    return AdminService.deleteAdmin(params.id)
  }

  async createUser({ request }: HttpContext) {
    const data = request.only(['email', 'password'])
    return AdminService.createUser(data)
  }

  async addEvent({ request }: HttpContext) {
    const eventData = request.only(['title', 'description', 'startDate', 'endDate', 'organizerId'])
    return AdminService.addEvent(eventData)
  }

  async addMoney({ request }: HttpContext) {
    const { userId, amount } = request.only(['userId', 'amount'])
    return AdminService.addMoneyToWallet(userId, amount)
  }

  async generateTicket({ request }: HttpContext) {
    const { userId, eventId, seatId, ticketCount } = request.only([
      'userId',
      'eventId',
      'seatId',
      'ticketCount',
    ])
    return AdminService.generateTicketForUser(userId, eventId, seatId, ticketCount)
  }

  async banUser({ params }: HttpContext) {
    return AdminService.banUser(params.userId)
  }

  async unbanUser({ params }: HttpContext) {
    return AdminService.unbanUser(params.userId)
  }
}