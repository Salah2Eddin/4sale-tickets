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
import TierController from '#modules/tickets/controllers/TiersController'

// Admin routes
router.group(() => {
  // Auth routes
  router.group(() => {
    router.post('/login', [AdminAuthController, 'login']).use(
      middleware.adminGuestOnly()
    )
    router.post('/logout', [AdminAuthController, 'logout']).use(
      middleware.auth({ guards: ['admin'] })
    )
  }).prefix("/auth")

  router.group(() => {
    // Admin Management routes
    router.group(() => {
      router.get('/', [AdminsController, 'getAllAdmins'])
      router.get('/:id', [AdminsController, 'getAdminById'])
      router.post('/', [AdminsController, 'createAdmin'])
      router.put('/:id', [AdminsController, 'updateAdmin'])
      router.delete('/:id', [AdminsController, 'deleteAdmin'])
    }).prefix("/admins").use(middleware.checkAdminAbility(["manage-admins"]))

    // Tickets routes
    router.group(() => {
      router.post('/tickets', [TicketController, 'create'])
      router.get('/tickets', [TicketController, 'getAll'])
      router.get('/tickets/:id', [TicketController, 'getOne'])
      router.put('/tickets/:id', [TicketController, 'updateOne'])
      router.delete('/tickets/:id', [TicketController, 'deleteOne'])
    }).prefix("/tickets").use(middleware.checkAdminAbility(["manage-events", "manage-tickets"]))

    // Events routes
    router.group(() => {
      router.group(() => {
        router.post('/', [EventController, 'create'])
        router.post('/organizer', [AdminsController, 'createEventOrganizer'])
        router.delete('/:id', [EventController, 'delete'])
      }).use([middleware.checkAdminAbility(["manage-events"])])

      router.group(() => {
        router.get('/:id/tiers', [TierController, 'index'])
        router.group(() => {
          router.post('/', [TierController, 'store'])
          router.get('/:id', [TierController, 'show'])
          router.put('/:id', [TierController, 'update'])
          router.delete('/:id', [TierController, 'destroy'])
        }).prefix("/tiers")
      }).use([middleware.checkAdminAbility(["manage-events", "event-organizer"])])

      router.put('/:id', [EventController, 'update'])
        .use([middleware.checkAdminAbility(["manage-events", "event-organizer"])])
    }).prefix("/events")

    // Forms routes
    router.group(() => {
      // Form management routes
      router.post('/', [FormsController, 'create'])
      router.put('/:id', [FormsController, 'update'])

      // Form submissions routes
      router.get('/:id/submissions', [FormSubmissionsController, 'submissions'])
      router.get('/:id/export', [FormSubmissionsController, 'exportSubmissions'])
      router.get('/:id/:submissionId', [FormSubmissionsController, 'submission'])
    }).prefix("/forms")
      .use([middleware.checkAdminAbility(["event-organizer", "manage-events"])])

    router.post('/create-user', [AdminsController, 'createUser'])
    router.post('/add-event', [AdminsController, 'addEvent'])
    router.post('/add-money', [AdminsController, 'addMoney'])
    router.post('/generate-ticket', [AdminsController, 'generateTicket'])
  }).use(middleware.auth({ guards: ['admin'] }))
}).prefix("/admin")

// User Auth routes
router.group(() => {
  router.post('/login', [UserAuthController, 'login']).use([middleware.guestOnly()])
  router.post('/logout', [UserAuthController, 'logout']).use(middleware.auth({ guards: ['api'] }))
  router.post('/register', [UserAuthController, 'register']).use([middleware.guestOnly()])
}).prefix("/auth")

// Verification routes
router.group(() => {
  router.get('/new', [VerificationController, 'getVerification'])
  router.post('/', [VerificationController, 'verify'])
}).prefix("/verify")
  .use(middleware.auth({ guards: ['api'] }))

// Reset password routes
router.group(() => {
  router.post('/forget', [UserAuthController, 'forgetPassword'])
  router.post('/reset', [UserAuthController, 'resetPassword'])
}).prefix("/password")
  .use([middleware.guestOnly()])

// Wallet Routes
router.group(() => {
  router.get('/balance', [WalletController, 'balance'])
  router.post('/recharge', [WalletController, 'rechargeBalance'])
  router.get('/transactions', [WalletController, 'transactions'])
  router.get('/transaction/:id', [WalletController, 'transaction'])
  router.post('/pay', [WalletController, 'makeTransaction'])
}).prefix("/wallet")
  .use([middleware.auth({ guards: ['api'] }), middleware.verification()])

// Tickets
router.group(() => {
  router.get('/user/:userId', [TicketController, 'userTickets'])
  router.get('/event/:eventId', [TicketController, 'eventTickets'])
  router.post('/bulk-checkin', [TicketController, 'bulkCheckIn'])

  router.group(()=>{
    router.post('/resell', [TicketController, 'resellTicket'])
  }).use([
    middleware.auth({ guards: ['api'] }),
    middleware.verification(),
  ])


}).prefix("/tickets")

// Forms
router.group(() => {
  router.get('/:id', [FormsController, 'get'])
  router.post('/:id/submit', [FormSubmissionsController, 'submit']).use(middleware.auth({ guards: ['api'] }))
}).prefix("/forms")

// Events routes
router.group(() => {
  router.get('/', [EventController, 'getAll'])
  router.get('/:id', [EventController, 'getById'])
}).prefix('/events')

router.group(() => {
  router.post('/subscribe', [WaitlistController, 'subscribe'])
  router.post('/respond', [WaitlistController, 'respond'])
  router.get('/my', [WaitlistController, 'myStatus'])
}).prefix("waitlist")
  .use(middleware.auth({ guards: ['api'] }))

router.group(() => {
  router.post('/lock', [TicketController, 'lockSeat'])
  router.post('/unlock', [TicketController, 'unlockSeat'])
  router.post('/book', [TicketController, 'bookSeat'])
  router.get('/event/:eventId', [TicketController, 'getSeatsByEvent'])
}).prefix('/seats')
  .use(middleware.auth({ guards: ['api'] }))
