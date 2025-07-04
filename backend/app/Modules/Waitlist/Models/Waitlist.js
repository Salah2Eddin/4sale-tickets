'use strict'

const Model = use('Model')

class Waitlist extends Model {
  event() {
    return this.belongsTo('App/Modules/Events/Models/Event')
  }
}

module.exports = Waitlist
