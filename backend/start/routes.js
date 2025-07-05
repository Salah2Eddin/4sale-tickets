'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const View = use('View')

Route.on('/').render('welcome')
Route.post('/tickets', '../../Modules/Tickets/Controllers/TicketController.create')

Route.get('/tickets/:id', async ({ params, view, response }) => {
  const Ticket = use('App/Modules/Tickets/Models/Ticket')

  const ticket = await Ticket
    .query()
    .where('id', params.id)
    .with('user')
    .with('event')
    .with('seat')
    .first()

  if (!ticket) return response.status(404).send('Ticket not found')

  return view.render('ticket', {
    ticket: ticket.toJSON()
  })
})
