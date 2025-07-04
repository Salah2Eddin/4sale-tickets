'use strict'

const Model = use('Model')

class Seat extends Model {
  tier() {
    return this.belongsTo('App/Modules/Tiers/Models/Tier')
  }
}

module.exports = Seat
