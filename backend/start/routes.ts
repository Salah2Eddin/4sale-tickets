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

router.post('/', [TicketController, 'create'])
router.get('/', [TicketController, 'getAll'])
router.get('/:id', [TicketController, 'getOne'])
router.put('/:id', [TicketController, 'updateOne'])
router.delete('/:id', [TicketController, 'deleteOne'])
router.get('/user/:userId', [TicketController, 'userTickets'])
router.get('/event/:eventId', [TicketController, 'eventTickets'])
router.post('/tickets/bulk-checkin', [TicketController,'bulkCheckIn'])