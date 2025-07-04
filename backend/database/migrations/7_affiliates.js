'use strict'

const Schema = use('Schema')

class AffiliatesSchema extends Schema {
  up () {
    this.create('affiliates', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('referral_code').unique()
      table.json('referred_ticket_ids').defaultTo('[]')
      table.decimal('commission', 5, 2).defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('affiliates')
  }
}

module.exports = AffiliatesSchema
