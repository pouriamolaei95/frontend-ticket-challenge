import type {
  CreateTicketRequest,
  CreateTicketResponse,
  GetMapByIdResponse,
  GetMapIdsResponse,
  MapId,
  SeatAvailability,
} from '../types'
import { sleep } from '../utils/sleep'

/**
 * Mock API implementation
 *
 * The backend is assumed to be in progress. This module provides in-memory,
 * deterministic-ish data with a small artificial delay to exercise async UI flows.
 *
 * Endpoints mirrored from README:
 * - GET    /map
 * - GET    /map/<map_id>
 * - POST   /map/<map_id>/ticket
 */

export class MockApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'MockApiError'
    this.status = status
  }
}

type MapConfig = Readonly<{
  id: MapId
  width: number
  height: number
  /** Initial reserved ratio, e.g. 0.25 => 25% of seats start reserved */
  initialReservedRatio: number
}>

const MAPS: ReadonlyArray<MapConfig> = [
  { id: 'm213', width: 80, height: 60, initialReservedRatio: 0.2 },
  { id: 'm654', width: 120, height: 70, initialReservedRatio: 0.25 },
  { id: 'm63', width: 60, height: 60, initialReservedRatio: 0.15 },
  // ~100k seats (400 * 250 = 100000)
  { id: 'm6888', width: 400, height: 250, initialReservedRatio: 0.3 },
] as const

const DEFAULT_LATENCY_MS = 250

type MapState = {
  /** Reserved seats stored as "x,y" keys */
  reserved: Set<string>
}

const stateByMapId = new Map<MapId, MapState>()

function getMapConfig(mapId: MapId): MapConfig {
  const map = MAPS.find((m) => m.id === mapId)
  if (!map) throw new MockApiError(404, `Map not found: ${mapId}`)
  return map
}

function getOrInitMapState(mapId: MapId): MapState {
  const existing = stateByMapId.get(mapId)
  if (existing) return existing

  const cfg = getMapConfig(mapId)
  const reserved = new Set<string>()

  // Deterministic-ish initial reservation:
  // Use a simple hash of mapId as seed so the same map looks stable across reloads.
  let seed = hashStringToUint32(cfg.id)
  const totalSeats = cfg.width * cfg.height
  const targetReserved = Math.floor(totalSeats * cfg.initialReservedRatio)

  while (reserved.size < targetReserved) {
    seed = xorshift32(seed)
    const idx = seed % totalSeats
    const x = idx % cfg.width
    const y = Math.floor(idx / cfg.width)
    reserved.add(toSeatKey(x, y))
  }

  const created: MapState = { reserved }
  stateByMapId.set(mapId, created)
  return created
}

function toSeatKey(x: number, y: number): string {
  return `${x},${y}`
}

function assertValidCoordinate(mapId: MapId, x: number, y: number): void {
  const cfg = getMapConfig(mapId)
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    throw new MockApiError(400, 'Seat coordinates must be integers')
  }
  if (x < 0 || y < 0 || x >= cfg.width || y >= cfg.height) {
    throw new MockApiError(400, 'Seat coordinate out of bounds')
  }
}

function hashStringToUint32(input: string): number {
  // FNV-1a 32-bit
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function xorshift32(x: number): number {
  // https://en.wikipedia.org/wiki/Xorshift
  let n = x >>> 0
  n ^= n << 13
  n ^= n >>> 17
  n ^= n << 5
  return n >>> 0
}

function createTicketId(): string {
  // Prefer stable browser-native UUIDs when available.
  const uuid = globalThis.crypto?.randomUUID?.()
  return uuid ?? `t_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

/**
 * GET /map
 */
export async function getMapIds(opts?: { latencyMs?: number }): Promise<GetMapIdsResponse> {
  await sleep(opts?.latencyMs ?? DEFAULT_LATENCY_MS)
  return MAPS.map((m) => m.id)
}

/**
 * GET /map/<map_id>
 *
 * Returns a 2D matrix of 0/1. Outer array = rows (y), inner array = columns (x).
 */
export async function getMapById(
  mapId: MapId,
  opts?: { latencyMs?: number },
): Promise<GetMapByIdResponse> {
  await sleep(opts?.latencyMs ?? DEFAULT_LATENCY_MS)

  const cfg = getMapConfig(mapId)
  const { reserved } = getOrInitMapState(mapId)

  const grid: SeatAvailability[][] = Array.from({ length: cfg.height }, () =>
    Array.from({ length: cfg.width }, () => 0 as SeatAvailability),
  )

  for (const key of reserved) {
    const [xStr, yStr] = key.split(',')
    const x = Number(xStr)
    const y = Number(yStr)
    // Defensive: ignore corrupted keys.
    if (Number.isFinite(x) && Number.isFinite(y) && grid[y]?.[x] !== undefined) {
      grid[y][x] = 1
    }
  }

  return grid
}

/**
 * POST /map/<map_id>/ticket
 */
export async function createTicket(
  mapId: MapId,
  request: CreateTicketRequest,
  opts?: { latencyMs?: number },
): Promise<CreateTicketResponse> {
  await sleep(opts?.latencyMs ?? DEFAULT_LATENCY_MS)

  const { x, y } = request
  assertValidCoordinate(mapId, x, y)

  const mapState = getOrInitMapState(mapId)
  const key = toSeatKey(x, y)

  if (mapState.reserved.has(key)) {
    throw new MockApiError(409, 'Seat is already reserved')
  }

  mapState.reserved.add(key)

  return { ticketId: createTicketId() }
}



