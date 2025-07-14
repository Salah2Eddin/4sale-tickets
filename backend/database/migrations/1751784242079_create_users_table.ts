import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("username").unique().notNullable()
      table.string("email").unique().notNullable()
      table.string("password").notNullable()
      table.enum('role', ['admin', 'user']).notNullable().defaultTo("user")
      table.boolean("is_verified").defaultTo(false).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}