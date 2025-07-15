import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tiers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.decimal('price', 10, 2).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}