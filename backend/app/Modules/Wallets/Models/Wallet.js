'use strict'

const Model = use('Model')

class Wallet extends Model {
  static get table () {
    return 'wallets'
  }

  user() {
    return this.belongsTo('App/Modules/Users/Models/User')
  }
}

module.exports = Wallet
