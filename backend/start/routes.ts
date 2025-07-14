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
import AdminAuthController from '#modules/admins/controllers/AuthController'
import UserAuthController from '#modules/users/controllers/AuthController'
import { middleware } from '#start/kernel'
import WalletController from '#modules/wallet/controllers/WalletController'
import VerificationController from '#modules/users/controllers/VerificationController'
import EventController from '#modules/events/controllers/EventController'
import FormsController from '#modules/form-builder/controllers/FormsController'
import FormSubmissionsController from '#modules/form-builder/controllers/FormSubmissionController'
import AdminsController from '#modules/admins/controllers/AdminController'
import WaitlistController from '#modules/waitlist/controllers/WaitlistController'

router.post('/admin/auth/login', [AdminAuthController, 'login']).use(
  middleware.adminGuestOnly()
)
router.post('/admin/auth/logout', [AdminAuthController, 'logout']).use(middleware.auth({ guards: ['admin'] }))

router.post('/auth/login', [UserAuthController, 'login']).use([middleware.guestOnly()])
router.post('/auth/logout', [UserAuthController, 'logout']).use(middleware.auth({ guards: ['api'] }))
router.post('/auth/register', [UserAuthController, 'register']).use([middleware.guestOnly()])

// Verification
router
  .get('/verify/new', [VerificationController, 'getVerification'])
  .use(middleware.auth({ guards: ['api'] }))
router
  .post('/verify/', [VerificationController, 'verify'])
  .as('verify')
  .use(middleware.auth({ guards: ['api'] }))

// Reset password routes
router.post('/password/forget', [UserAuthController, 'forgetPassword']).use([middleware.guestOnly()])
router.post('/password/reset', [UserAuthController, 'resetPassword']).use([middleware.guestOnly()])

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

router.post('/tickets', [TicketController, 'create'])
router.get('/tickets', [TicketController, 'getAll'])
router.get('/tickets/:id', [TicketController, 'getOne'])
router.put('/tickets/:id', [TicketController, 'updateOne'])
router.delete('/tickets/:id', [TicketController, 'deleteOne'])
router.get('/tickets/user/:userId', [TicketController, 'userTickets'])
router.get('/tickets/event/:eventId', [TicketController, 'eventTickets'])
router.post('/tickets/bulk-checkin', [TicketController, 'bulkCheckIn'])

// Form management routes
router.post('forms/', [FormsController, 'create'])
router.get('forms/:id', [FormsController, 'get'])
router.put('forms/:id', [FormsController, 'update'])

// Form submission route
router.post('/forms/:id/submit', [FormSubmissionsController, 'submit'])

// Form submissions routes
router.get('forms/:id/submissions', [FormSubmissionsController, 'submissions'])
router.get('forms/:id/export', [FormSubmissionsController, 'exportSubmissions'])
router.get('forms/:id/:submissionId', [FormSubmissionsController, 'submission'])


router.post('/events', [EventController, 'create'])
  .use([
    middleware.auth({ guards: ['api'] }),
    middleware.role(['admin'])
  ])
router.group(() => {
    router.get   ('/',       [EventController, 'getAll'])
    router.get   ('/:id',    [EventController, 'getById'])
    router.put   ('/:id',    [EventController, 'update'])
    router.delete('/:id',    [EventController, 'delete'])
  })
  .prefix('/events')
  .use(middleware.auth({ guards: ['api'] }))

router.get('/admin/', [AdminsController, 'getAllAdmins'])
router.get('/admin/:id', [AdminsController, 'getAdminById'])
router.post('/admin/', [AdminsController, 'createAdmin'])
router.put('/admin/:id', [AdminsController, 'updateAdmin'])
router.delete('/admin/:id', [AdminsController, 'deleteAdmin'])
router.post('/admin/create-user', [AdminsController, 'createUser'])
router.post('/admin/add-event', [AdminsController, 'addEvent'])
router.post('/admin/add-money', [AdminsController, 'addMoney'])
router.post('/admin/generate-ticket', [AdminsController, 'generateTicket'])


router.group(() => {
  router.post('/waitlist/subscribe', [WaitlistController, 'subscribe'])
  router.post('/waitlist/respond',   [WaitlistController, 'respond'])
  router.get ('/waitlist/my',        [WaitlistController, 'myStatus'])
})
.use(middleware.auth({ guards: ['api'] }))

router.group(() => {

    router.post('/lock',   [TicketController, 'lockSeat'])
    router.post('/unlock', [TicketController, 'unlockSeat'])
    router.post('/book',   [TicketController, 'bookSeat'])


    router.get('/event/:eventId', [TicketController, 'getSeatsByEvent'])
  })
  .prefix('/seats')
  .use(middleware.auth({ guards: ['api'] }))
