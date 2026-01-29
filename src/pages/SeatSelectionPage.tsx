import { useState } from 'react'
import type { SeatCoordinate, SeatGrid, TicketId } from '../types'
import { SeatMap } from '../components/SeatMap'
import { apiClient, ApiError } from '../services/apiClient'
import '../styles/seatSelectionPage.css'

type SeatSelectionPageProps = {
  grid: SeatGrid
  mapId: string
  onPurchaseSuccess?: (ticketId: TicketId) => void
}

/**
 * Seat selection page
 *
 * Manages seat selection state and provides UI for users to select a seat.
 * This component handles the selection logic before ticket purchase.
 */
export function SeatSelectionPage({ grid, mapId, onPurchaseSuccess }: SeatSelectionPageProps) {
  const [selectedSeat, setSelectedSeat] = useState<SeatCoordinate | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)

  const handleSeatClick = (coordinate: SeatCoordinate) => {
    setSelectedSeat(coordinate)
    setPurchaseError(null)
  }

  const handleClearSelection = () => {
    setSelectedSeat(null)
    setPurchaseError(null)
  }

  const handlePurchase = async () => {
    if (!selectedSeat) {
      return
    }

    setIsPurchasing(true)
    setPurchaseError(null)

    try {
      const response = await apiClient.createTicket(mapId, selectedSeat)
      setIsPurchasing(false)
      if (onPurchaseSuccess) {
        onPurchaseSuccess(response.ticketId)
      }
    } catch (error) {
      setIsPurchasing(false)
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setPurchaseError('This seat is already reserved. Please select another seat.')
        } else if (error.status === 400) {
          setPurchaseError('Invalid seat selection. Please try again.')
        } else {
          setPurchaseError(`Purchase failed: ${error.message}`)
        }
      } else {
        setPurchaseError('An unexpected error occurred. Please try again.')
      }
    }
  }

  return (
    <div className="seat-selection-page">
      <header className="seat-selection-page__header">
        <h1>Select Your Seat</h1>
        <p className="seat-selection-page__map-id">Map: {mapId}</p>
      </header>

      <div className="seat-selection-page__content">
        <div className="seat-selection-page__map-container">
          <SeatMap
            grid={grid}
            selectedSeat={selectedSeat}
            onSeatClick={handleSeatClick}
          />
        </div>

        <aside className="seat-selection-page__sidebar">
          <div className="seat-selection-page__info">
            <h2>Selection</h2>
            {selectedSeat ? (
              <div className="seat-selection-page__selected-info">
                <p>
                  <strong>Row:</strong> {selectedSeat.y + 1}
                </p>
                <p>
                  <strong>Column:</strong> {selectedSeat.x + 1}
                </p>
                {purchaseError && (
                  <div className="seat-selection-page__error" role="alert">
                    {purchaseError}
                  </div>
                )}
                <div className="seat-selection-page__actions">
                  <button
                    type="button"
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className="seat-selection-page__purchase-btn"
                  >
                    {isPurchasing ? 'Processing...' : 'Purchase Ticket'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    disabled={isPurchasing}
                    className="seat-selection-page__clear-btn"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            ) : (
              <p className="seat-selection-page__no-selection">
                Click on an available seat to select it
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

