import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'seats'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('tier_id')
        .unsigned()
        .references('id')
        .inTable('tiers')
        .onDelete('CASCADE')
        
      table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE')
      table.boolean('is_taken').defaultTo(false)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}