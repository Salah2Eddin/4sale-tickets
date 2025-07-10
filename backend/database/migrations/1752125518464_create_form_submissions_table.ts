import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'form_submissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('form_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('forms')
        .onDelete('CASCADE')
      table
        .integer('ticket_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tickets')
        .onDelete('CASCADE')
        .unique()
      table.json('data').notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
