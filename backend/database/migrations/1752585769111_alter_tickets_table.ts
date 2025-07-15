import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean("checked_in").notNullable().defaultTo(false)
      table.dropColumns("created_at", "updated_at")
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("checked_in")
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }
}