import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tiers'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("name").notNullable()
      table.integer("capacity").notNullable().checkPositive()
      table.integer('event_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('events')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns("name", "capacity", "event_id")
    })
  }
}