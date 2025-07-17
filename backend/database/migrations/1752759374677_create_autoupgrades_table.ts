import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AutoUpgrades extends BaseSchema {
  protected tableName = 'auto_upgrades'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('ticket_id')
        .unsigned()
        .references('id')
        .inTable('tickets')
        .onDelete('CASCADE')

      table
        .integer('target_tier_id')
        .unsigned()
        .references('id')
        .inTable('tiers')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
