/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import TicketController from '../app/modules/tickets/controllers/TicketController.js'

router.post('/tickets', [TicketController, 'create'])
router.get('/', async () => {
  return {
    hello: 'world',
  }
})
