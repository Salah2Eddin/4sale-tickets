'use strict'

const Schema = use('Schema')

class SeatsSchema extends Schema {
  up () {
    this.create('seats', (table) => {
      table.increments()
      table.integer('tier_id').unsigned().references('id').inTable('tiers').onDelete('SET NULL')
      table.timestamps()
    })
  }

  down () {
    this.drop('seats')
  }
}

module.exports = SeatsSchema
