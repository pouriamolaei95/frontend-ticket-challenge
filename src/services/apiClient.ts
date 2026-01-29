import type {
  CreateTicketRequest,
  CreateTicketResponse,
  GetMapByIdResponse,
  GetMapIdsResponse,
  MapId,
} from '../types'
import * as mockApi from './mockApi'

/**
 * API client error
 *
 * Normalizes errors from different sources (mock, network, etc) into a consistent shape.
 */
export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/**
 * API client interface
 *
 * This abstraction allows swapping between mock and real implementations
 * without changing the rest of the application.
 */
export interface ApiClient {
  getMapIds(): Promise<GetMapIdsResponse>
  getMapById(mapId: MapId): Promise<GetMapByIdResponse>
  createTicket(mapId: MapId, request: CreateTicketRequest): Promise<CreateTicketResponse>
}

/**
 * Mock API client implementation
 *
 * Wraps the mock API functions and normalizes errors.
 */
class MockApiClient implements ApiClient {
  async getMapIds(): Promise<GetMapIdsResponse> {
    try {
      return await mockApi.getMapIds()
    } catch (error) {
      throw normalizeError(error)
    }
  }

  async getMapById(mapId: MapId): Promise<GetMapByIdResponse> {
    try {
      return await mockApi.getMapById(mapId)
    } catch (error) {
      throw normalizeError(error)
    }
  }

  async createTicket(
    mapId: MapId,
    request: CreateTicketRequest,
  ): Promise<CreateTicketResponse> {
    try {
      return await mockApi.createTicket(mapId, request)
    } catch (error) {
      throw normalizeError(error)
    }
  }
}

function normalizeError(error: unknown): ApiError {
  if (error instanceof mockApi.MockApiError) {
    return new ApiError(error.status, error.message)
  }
  if (error instanceof Error) {
    return new ApiError(500, error.message)
  }
  return new ApiError(500, 'Unknown error occurred')
}

/**
 * Default API client instance
 *
 * Currently uses mock implementation. To switch to a real API:
 * 1. Create a RealApiClient class implementing ApiClient
 * 2. Replace the export below
 */
export const apiClient: ApiClient = new MockApiClient()

