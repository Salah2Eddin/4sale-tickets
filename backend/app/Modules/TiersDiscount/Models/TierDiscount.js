'use strict'

const Model = use('Model')

class TierDiscount extends Model {
  tier() {
    return this.belongsTo('App/Modules/Tiers/Models/Tier')
  }
}

module.exports = TierDiscount
