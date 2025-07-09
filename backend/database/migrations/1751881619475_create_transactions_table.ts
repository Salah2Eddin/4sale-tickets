import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      
      table
        .integer('from_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('wallets')
        .onDelete('CASCADE')

      table
        .integer('to_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('wallets')
        .onDelete('CASCADE')

      table.decimal('amount', 12, 2).notNullable()

      table.timestamp('date', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}