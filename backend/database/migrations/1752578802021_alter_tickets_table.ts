import { TicketStatus } from '#contracts/tickets/enums/TicketStatus'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum("status", Object.values(TicketStatus)).notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("status")
    })
  }
}