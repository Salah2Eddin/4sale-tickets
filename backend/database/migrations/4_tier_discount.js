'use strict'

const Schema = use('Schema')

class TierDiscountsSchema extends Schema {
  up () {
    this.create('tier_discounts', (table) => {
      table.increments()
      table.integer('tier_id').unsigned().references('id').inTable('tiers').onDelete('CASCADE')
      table.timestamp('start_date')
      table.timestamp('end_date')
      table.decimal('discount', 5, 2)
      table.timestamps()
    })
  }

  down () {
    this.drop('tier_discounts')
  }
}

module.exports = TierDiscountsSchema
