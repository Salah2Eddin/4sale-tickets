import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['organizer_id'])
      table
        .foreign('organizer_id')
        .references('id')
        .inTable('admins')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Revert back to old foreign key
      table.dropForeign(['organizer_id'])

      table
        .foreign('organizer_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }
}