'use strict'

const Model = use('Model')

class Affiliate extends Model {
  user() {
    return this.belongsTo('App/Modules/Users/Models/User')
  }
}

module.exports = Affiliate
