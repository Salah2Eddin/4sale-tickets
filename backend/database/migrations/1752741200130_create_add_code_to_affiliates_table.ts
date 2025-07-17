import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCodeToAffiliatesTable extends BaseSchema {
  protected tableName = 'affiliates'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('code').unique().notNullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('code')
    })
  }
}
