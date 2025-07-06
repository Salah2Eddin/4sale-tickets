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
import AuthController from '../app/modules/users/controllers/AuthController.js'
import { middleware } from './kernel.js'

router.post('/tickets', [TicketController, 'create'])
router.post('/auth/login', [AuthController, 'login'])
router.post('/auth/logout', [AuthController, 'logout']).use(
  middleware.auth({guards: ['api']})
)
router.post('/auth/register', [AuthController, 'register'])
router.get('/', async () => {
  return {
    hello: 'world',
  }
})
