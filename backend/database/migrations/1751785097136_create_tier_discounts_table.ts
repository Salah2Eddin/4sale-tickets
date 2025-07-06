import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tier_discounts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.decimal('discount', 5, 2).notNullable()

      table
        .integer('tier_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tiers')
        .onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}