'use strict'

const Model = use('Model')

class Event extends Model {
  organizer() {
    return this.belongsTo('App/Modules/Users/Models/User', 'organizer_id')
  }

  waitlist() {
    return this.hasOne('App/Modules/Waitlist/Models/Waitlist')
  }

  tickets() {
    return this.hasMany('App/Modules/Tickets/Models/Ticket')
  }
}

module.exports = Event
