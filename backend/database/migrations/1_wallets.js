'use strict'

const Schema = use('Schema')

class WalletsSchema extends Schema {
  up () {
    this.create('wallets', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('currency').notNullable()
      table.decimal('amount', 10, 2).defaultTo(0)
      table.json('transaction_history').defaultTo('[]')
      table.timestamps()
    })
  }

  down () {
    this.drop('wallets')
  }
}

module.exports = WalletsSchema
