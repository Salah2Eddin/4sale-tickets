'use strict'

const Schema = use('Schema')

class TicketsSchema extends Schema {
  up () {
    this.create('tickets', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE')
      table.integer('seat_id').unsigned().references('id').inTable('seats').onDelete('SET NULL')
      table.string('status').defaultTo('valid')
      table.boolean('checked_in').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('tickets')
  }
}

module.exports = TicketsSchema
