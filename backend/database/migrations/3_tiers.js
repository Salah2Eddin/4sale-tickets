'use strict'

const Schema = use('Schema')

class TiersSchema extends Schema {
  up () {
    this.create('tiers', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.integer('min_group_size').defaultTo(1)
      table.timestamps()
    })
  }

  down () {
    this.drop('tiers')
  }
}

module.exports = TiersSchema
