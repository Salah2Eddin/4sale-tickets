'use strict'

import Admin from '#modules/admins/models/Admin'
import User from '#modules/users/models/User'
import Event from '#modules/events/models/Event'
import Wallet from '#modules/wallet/models/Wallet'
import TicketService from '#modules/tickets/services/TicketService'
import { DateTime } from 'luxon'

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

  static async createUser(data: { email: string; password: string }) {
    return User.create({
      email: data.email,
      password: await data.password,
      isBanned: false,
    })
  }

  static async addEvent(data: Partial<Event>) {
    return Event.create({
      ...data,
      createdAt: DateTime.now(),
    })
  }

  static async addMoneyToWallet(userId: number, amount: number) {
    const wallet = await Wallet.findByOrFail('user_id', userId)
    wallet.balance += amount
    await wallet.save()
    return wallet
  }

  static async generateTicketForUser(userId: number, eventId: number, seatId: number, ticketCount: number) {
    const user = await User.find(userId)
    if (!user || user.isBanned) {
      throw new Error('User not found or banned')
    }
    return TicketService.createTicket(userId, eventId, seatId, ticketCount)
  }

  static async banUser(userId: number) {
    const user = await User.find(userId)
    if (!user) return null
    user.isBanned = true
    await user.save()
    return user
  }

  static async unbanUser(userId: number) {
    const user = await User.find(userId)
    if (!user) return null
    user.isBanned = false
    await user.save()
    return user
  }
}