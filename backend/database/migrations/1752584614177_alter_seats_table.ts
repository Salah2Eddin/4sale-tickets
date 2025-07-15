import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'seats'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns("created_at", "updated_at")
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }
}