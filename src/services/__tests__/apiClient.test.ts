import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient, ApiError } from '../apiClient'
import type { MapId } from '../../types'

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMapIds', () => {
    it('returns map IDs successfully', async () => {
      const result = await apiClient.getMapIds()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(typeof result[0]).toBe('string')
    })
  })

  describe('getMapById', () => {
    it('returns map data for valid map ID', async () => {
      const mapIds = await apiClient.getMapIds()
      const mapId = mapIds[0]
      const result = await apiClient.getMapById(mapId)
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(Array.isArray(result[0])).toBe(true)
    })

    it('throws ApiError for invalid map ID', async () => {
      const invalidMapId = 'invalid-map-id' as MapId
      
      await expect(apiClient.getMapById(invalidMapId)).rejects.toThrow(ApiError)
      await expect(apiClient.getMapById(invalidMapId)).rejects.toThrow('Map not found')
    })
  })

  describe('createTicket', () => {
    it('creates a ticket successfully for available seat', async () => {
      const mapIds = await apiClient.getMapIds()
      const mapId = mapIds[0]
      const mapData = await apiClient.getMapById(mapId)
      
      // Find an available seat (0)
      let availableX = -1
      let availableY = -1
      for (let y = 0; y < mapData.length; y++) {
        for (let x = 0; x < mapData[y].length; x++) {
          if (mapData[y][x] === 0) {
            availableX = x
            availableY = y
            break
          }
        }
        if (availableX !== -1) break
      }
      
      expect(availableX).toBeGreaterThanOrEqual(0)
      expect(availableY).toBeGreaterThanOrEqual(0)
      
      const result = await apiClient.createTicket(mapId, { x: availableX, y: availableY })
      
      expect(result).toHaveProperty('ticketId')
      expect(typeof result.ticketId).toBe('string')
      expect(result.ticketId.length).toBeGreaterThan(0)
    })

    it('throws ApiError for invalid coordinates', async () => {
      const mapIds = await apiClient.getMapIds()
      const mapId = mapIds[0]
      
      await expect(
        apiClient.createTicket(mapId, { x: -1, y: 0 })
      ).rejects.toThrow(ApiError)
      
      await expect(
        apiClient.createTicket(mapId, { x: 0, y: -1 })
      ).rejects.toThrow(ApiError)
    })

    it('throws ApiError when seat is already reserved', async () => {
      const mapIds = await apiClient.getMapIds()
      const mapId = mapIds[0]
      const mapData = await apiClient.getMapById(mapId)
      
      // Find a reserved seat (1)
      let reservedX = -1
      let reservedY = -1
      for (let y = 0; y < mapData.length; y++) {
        for (let x = 0; x < mapData[y].length; x++) {
          if (mapData[y][x] === 1) {
            reservedX = x
            reservedY = y
            break
          }
        }
        if (reservedX !== -1) break
      }
      
      if (reservedX !== -1) {
        await expect(
          apiClient.createTicket(mapId, { x: reservedX, y: reservedY })
        ).rejects.toThrow(ApiError)
      }
    })
  })

  describe('ApiError', () => {
    it('creates error with status and message', () => {
      const error = new ApiError(404, 'Not found')
      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(ApiError)
      expect(error.status).toBe(404)
      expect(error.message).toBe('Not found')
      expect(error.name).toBe('ApiError')
    })

    it('can include optional code', () => {
      const error = new ApiError(400, 'Bad request', 'INVALID_INPUT')
      expect(error.code).toBe('INVALID_INPUT')
    })
  })
})

