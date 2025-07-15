import { SeatStatus } from '#contracts/tickets/enums/SeatStatus'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'seats'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("is_taken")
      table.enum("status", Object.values(SeatStatus)).notNullable().defaultTo(SeatStatus.AVAILABLE)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_taken').defaultTo(false)
      table.dropColumn("status")
    })
  }
}