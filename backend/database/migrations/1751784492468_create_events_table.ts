import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
 protected tableName = 'events'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('organizer_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('starts_at', { useTz: true }).notNullable()
      table.timestamp('early_bird_ends_at', { useTz: true }).nullable()

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
