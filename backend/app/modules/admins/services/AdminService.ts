'use strict'

import Admin from '#modules/admins/models/Admin'
import { DateTime } from 'luxon'
import UserService from '#modules/users/services/UserService'
import TicketService from '#modules/tickets/services/TicketService'
import EventService from '#modules/events/services/EventService'
import WalletService from '#modules/wallet/services/WalletService'

export default class AdminService {
  static async createAdmin(data: { email: string; password: string; abilities: string[] }) {
    return Admin.create({
      email: data.email,
      password: data.password,
      isSuper: false,
      abilities: data.abilities,
    })
  }

  static async getAllAdmins() {
    return Admin.all()
  }

  static async getAdminById(id: number) {
    return Admin.find(id)
  }

  static async updateAdmin(id: number, updates: Partial<Admin>) {
    const admin = await Admin.find(id)
    if (!admin) return null
    admin.merge(updates)
    await admin.save()
    return admin
  }

  static async deleteAdmin(id: number) {
    const admin = await Admin.find(id)
    if (!admin) return null
    await admin.delete()
    return true
  }

  static async createUser(data: { username: string, email: string; password: string }) {
    return UserService.createUser(data.username, data.email, data.password)
  }

  static async addEvent(data: Record<string, any>) {
    return await EventService.create(
      {
        ...data,
        createdAt: DateTime.now(),
      }
    )
  }

  static async addMoneyToWallet(userId: number, amount: number) {
    const wallet = await WalletService.getUserWallet(userId)
    return await WalletService.addBalance(wallet!.id, amount)
  }

  static async generateTicketForUser(userId: number, eventId: number, seatId: number, ticketCount: number) {
    return TicketService.createTicket(userId, eventId, seatId, ticketCount)
  }
}