import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("username").unique().notNullable()
      table.string("email").unique().notNullable()
      table.string("password").notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}