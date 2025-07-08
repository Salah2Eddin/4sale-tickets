import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
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
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('title', 'description', 'location', 'base_price', 'currency', 'capacity', 'is_sold_out', 'ends_at')
    })
  }
}
