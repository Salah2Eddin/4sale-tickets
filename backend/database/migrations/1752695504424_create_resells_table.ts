import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'resells'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE')
      table.integer('tier_id').unsigned().references('id').inTable('tiers').onDelete('CASCADE')
      table.integer('ticket_id').unsigned().references('id').inTable('tickets').onDelete('CASCADE')
      table.decimal('price', 12, 2)

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
