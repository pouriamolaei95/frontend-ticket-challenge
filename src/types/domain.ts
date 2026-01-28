/**
 * Domain types
 *
 * These types intentionally describe the product domain independent of API transport.
 * They are kept small to avoid "type sprawl" early in the project.
 */

export type MapId = string

/**
 * A seat coordinate on a stadium map.
 *
 * Convention:
 * - x: column index (0-based)
 * - y: row index (0-based)
 */
export type SeatCoordinate = Readonly<{
  x: number
  y: number
}>

/**
 * Seat value as returned by the backend map matrix.
 *
 * - 0: available
 * - 1: reserved
 */
export type SeatAvailability = 0 | 1

/**
 * Stadium map grid. Outer array = rows (y), inner array = columns (x).
 */
export type SeatGrid = ReadonlyArray<ReadonlyArray<SeatAvailability>>

export type TicketId = string


