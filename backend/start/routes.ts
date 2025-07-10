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
import { middleware } from '#start/kernel'
import WalletController from '#modules/wallet/controllers/WalletController'
import VerificationController from '#modules/users/controllers/VerificationController'

router.post('/tickets', [TicketController, 'create'])
router.post('/auth/login', [AuthController, 'login']).use([middleware.guestOnly()])
router.post('/auth/logout', [AuthController, 'logout']).use(middleware.auth({ guards: ['api'] }))
router.post('/auth/register', [AuthController, 'register']).use([middleware.guestOnly()])

// Verification
router
  .get('/verify/new', [VerificationController, 'getVerification'])
  .use(middleware.auth({ guards: ['api'] }))
router
  .post('/verify/', [VerificationController, 'verify'])
  .as('verify')
  .use(middleware.auth({ guards: ['api'] }))

// Reset password routes
router
  .post('/password/forget', [AuthController, 'forgetPassword'])
  .use([middleware.auth({ guards: ['api'] })])
router.post('/password/reset', [AuthController, 'resetPassword']).use([middleware.guestOnly()])

// Wallet Routes
router
  .get('/wallet/balance', [WalletController, 'balance'])
  .use([middleware.auth({ guards: ['api'] }), middleware.verification()])
router
  .post('/wallet/recharge', [WalletController, 'rechargeBalance'])
  .use([middleware.auth({ guards: ['api'] }), middleware.verification()])
router
  .get('/wallet/transactions', [WalletController, 'transactions'])
  .use([middleware.auth({ guards: ['api'] }), middleware.verification()])
router
  .get('/wallet/transaction/:id', [WalletController, 'transaction'])
  .use([middleware.auth({ guards: ['api'] }), middleware.verification()])
router
  .post('/wallet/pay', [WalletController, 'makeTransaction'])
  .use([middleware.auth({ guards: ['api'] }), middleware.verification()])

router.post('/', [TicketController, 'create'])
router.get('/', [TicketController, 'getAll'])
router.get('/:id', [TicketController, 'getOne'])
router.put('/:id', [TicketController, 'updateOne'])
router.delete('/:id', [TicketController, 'deleteOne'])
router.get('/user/:userId', [TicketController, 'userTickets'])
router.get('/event/:eventId', [TicketController, 'eventTickets'])
router.post('/tickets/bulk-checkin', [TicketController, 'bulkCheckIn'])
