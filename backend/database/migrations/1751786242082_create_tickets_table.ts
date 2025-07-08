import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Tickets extends BaseSchema {
  protected tableName = 'tickets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('event_id')
        .unsigned()
        .references('id')
        .inTable('events')
        .onDelete('CASCADE')

      table
        .integer('seat_id')
        .unsigned()
        .references('id')
        .inTable('seats')
        .onDelete('SET NULL')
        
      table.decimal('price', 10, 2).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}