'use strict'

const Model = use('Model')

class Tier extends Model {
  discounts() {
    return this.hasMany('App/Modules/Tiers/Models/TierDiscount')
  }

  seats() {
    return this.hasMany('App/Modules/Seats/Models/Seat')
  }
}

module.exports = Tier
