'use strict'

const Schema = use('Schema')

class WaitlistsSchema extends Schema {
  up () {
    this.create('waitlists', (table) => {
      table.increments()
      table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE')
      table.json('users') // dh optional
      table.json('queue')
      table.timestamps()
    })
  }

  down () {
    this.drop('waitlists')
  }
}

module.exports = WaitlistsSchema
