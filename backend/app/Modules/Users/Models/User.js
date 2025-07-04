'use strict'

const Model = use('Model')

class User extends Model {
  static get table () {
    return 'users'
  }

  wallet() {
    return this.hasOne('App/Modules/Wallets/Models/Wallet')
  }

  tickets() {
    return this.hasMany('App/Modules/Tickets/Models/Ticket')
  }

  affiliate() {
    return this.hasOne('App/Modules/Affiliates/Models/Affiliate')
  }
}

module.exports = User
