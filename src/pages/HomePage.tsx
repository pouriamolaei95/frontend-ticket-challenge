import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MapId, SeatGrid } from '../types'
import { apiClient, ApiError } from '../services/apiClient'
import { SeatSelectionPage } from './SeatSelectionPage'
import '../styles/homePage.css'

/**
 * Home page
 *
 * Loads a random stadium map and displays the seat selection interface.
 * This is the entry point of the application.
 */
export function HomePage() {
  const [mapId, setMapId] = useState<MapId | null>(null)
  const [grid, setGrid] = useState<SeatGrid | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadRandomMap()
  }, [])

  const loadRandomMap = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const mapIds = await apiClient.getMapIds()
      if (mapIds.length === 0) {
        setError('No maps available')
        setIsLoading(false)
        return
      }

      const randomMapId = mapIds[Math.floor(Math.random() * mapIds.length)]
      const mapData = await apiClient.getMapById(randomMapId)

      setMapId(randomMapId)
      setGrid(mapData)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      if (err instanceof ApiError) {
        setError(`Failed to load map: ${err.message}`)
      } else {
        setError('An unexpected error occurred')
      }
    }
  }

  const handlePurchaseSuccess = (ticketId: string) => {
    navigate(`/confirmation/${encodeURIComponent(ticketId)}`)
  }

  if (isLoading) {
    return (
      <div className="home-page home-page--loading">
        <div className="home-page__spinner">Loading stadium map...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home-page home-page--error">
        <div className="home-page__error-container">
          <p className="home-page__error-message">{error}</p>
          <button
            type="button"
            onClick={loadRandomMap}
            className="home-page__retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!mapId || !grid) {
    return null
  }

  return (
    <SeatSelectionPage
      grid={grid}
      mapId={mapId}
      onPurchaseSuccess={handlePurchaseSuccess}
    />
  )
}

