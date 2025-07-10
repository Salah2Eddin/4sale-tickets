import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Admin from '#modules/admins/models/Admin'

export default class extends BaseSeeder {
  async run() {
    await Admin.firstOrCreate(
      { email: 'super@admin.com' },
      {
        password:'passwordforadmin',
        isSuper: true,
        abilities: ['*'],
      }
    )
  }
}