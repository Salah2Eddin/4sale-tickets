import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'waitlists'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      
      table.integer('user_id').unsigned()
           .references('id').inTable('users')
           .onDelete('CASCADE')

      table.integer('tier_id').unsigned().nullable()
           .references('id').inTable('tiers')
           .onDelete('CASCADE')

      table.enum('status', ['waiting', 'notified', 'expired', 'declined', 'bought'])
           .notNullable()
           .defaultTo('waiting')

      table.timestamp('notified_at', { useTz: true }).nullable()
      table.timestamp('expires_at',  { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns(
        'user_id',
        'tier_id',
        'status',
        'notified_at',
        'expires_at'
      )
    })
  }
}
