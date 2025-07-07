/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import TicketController from '#modules/tickets/controllers/TicketController'
import AuthController from '#modules/users/controllers/AuthController'
import { middleware } from './kernel.js'

router.post('/tickets', [TicketController, 'create'])
router.post('/auth/login', [AuthController, 'login'])
router.post('/auth/logout', [AuthController, 'logout']).use(
  middleware.auth({guards: ['api']})
)
router.post('/auth/register', [AuthController, 'register'])
router.post('/', [TicketController, 'create'])
router.get('/', [TicketController, 'getAll'])
router.get('/:id', [TicketController, 'getOne'])
router.put('/:id', [TicketController, 'updateOne'])
router.delete('/:id', [TicketController, 'deleteOne'])
router.get('/user/:userId', [TicketController, 'userTickets'])
router.get('/event/:eventId', [TicketController, 'eventTickets'])
router.post('/tickets/bulk-checkin', [TicketController,'bulkCheckIn'])
