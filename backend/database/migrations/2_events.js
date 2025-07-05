'use strict'

const Schema = use('Schema')

class EventsSchema extends Schema {
  up () {
    this.create('events', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.timestamp('start_date')
      table.timestamp('end_date') // date of event
      table.string('location')
      table.integer('organizer_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.text('description')
      table.timestamps()
    })
  }

  down () {
    this.drop('events')
  }
}

module.exports = EventsSchema
