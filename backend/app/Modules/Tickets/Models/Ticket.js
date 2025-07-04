'use strict'

const Model = use('Model')

class Ticket extends Model {
  user() {
    return this.belongsTo('App/Modules/Users/Models/User')
  }

  event() {
    return this.belongsTo('App/Modules/Events/Models/Event')
  }

  seat() {
    return this.belongsTo('App/Modules/Seats/Models/Seat')
  }
}

module.exports = Ticket
