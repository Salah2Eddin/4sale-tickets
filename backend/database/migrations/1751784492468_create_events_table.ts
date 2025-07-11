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
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.string('location').notNullable()
      table.decimal('base_price', 10, 2).notNullable()
      table.string('currency').notNullable()
      table.integer('capacity').notNullable()
      table.boolean('is_sold_out').defaultTo(false)
      table.timestamp('ends_at', { useTz: true }).notNullable()

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
