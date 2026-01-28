/**
 * API contract types
 *
 * Mirrors the README "API Standard" section.
 * We keep these separate from domain types to make it easy to swap mocks for real
 * network calls without impacting the rest of the app.
 */

import type { MapId, SeatCoordinate, SeatGrid, TicketId } from './domain'

// GET /map
export type GetMapIdsResponse = ReadonlyArray<MapId>

// GET /map/<map_id>
export type GetMapByIdResponse = SeatGrid

// POST /map/<map_id>/ticket
export type CreateTicketRequest = SeatCoordinate

/**
 * Ticket purchase response.
 *
 * The README only says "shows the ticket ID", not a JSON shape.
 * We standardize on `{ ticketId }` for our client/mocks.
 */
export type CreateTicketResponse = Readonly<{
  ticketId: TicketId
}>


