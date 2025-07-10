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
import EventController from '#modules/events/controllers/EventController'
import FormsController from '#modules/form-builder/controllers/FormsController'
import FormSubmissionsController from '#modules/form-builder/controllers/FormSubmissionController'

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
router.post('/password/forget', [AuthController, 'forgetPassword']).use([middleware.guestOnly()])
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

router.post('tickets/', [TicketController, 'create'])
router.get('tickets/', [TicketController, 'getAll'])
router.get('tickets/:id', [TicketController, 'getOne'])
router.put('tickets/:id', [TicketController, 'updateOne'])
router.delete('tickets/:id', [TicketController, 'deleteOne'])
router.get('tickets/user/:userId', [TicketController, 'userTickets'])
router.get('tickets/event/:eventId', [TicketController, 'eventTickets'])
router.post('tickets/tickets/bulk-checkin', [TicketController, 'bulkCheckIn'])

router
  .post('/events', [EventController, 'create'])
  .use([middleware.auth({ guards: ['api'] }), middleware.role(['admin'])])
router.get('/events', [EventController, 'getAll']).use(middleware.auth({ guards: ['api'] }))
router.get('/events/:id', [EventController, 'getById']).use(middleware.auth({ guards: ['api'] }))
router.put('/events/:id', [EventController, 'update']).use(middleware.auth({ guards: ['api'] }))
router.delete('/events/:id', [EventController, 'delete']).use(middleware.auth({ guards: ['api'] }))

// Form management routes
router.post('forms/', [FormsController, 'create'])
router.get('forms/:id', [FormsController, 'get'])
router.put('forms/:id', [FormsController, 'update'])

// Form submissions routes
router.get('forms/:formId/', [FormSubmissionsController, 'submissions'])
router.get('forms/:formId/:id', [FormSubmissionsController, 'submission'])
router.get('forms/:formId/export', [FormSubmissionsController, 'exportSubmissions'])

// Public form submission route
router.post('/forms/:formId/submit', [FormSubmissionsController, 'submit'])
