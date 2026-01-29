import { useState } from 'react'
import type { SeatCoordinate, SeatGrid } from '../types'
import { SeatMap } from '../components/SeatMap'
import '../styles/seatSelectionPage.css'

type SeatSelectionPageProps = {
  grid: SeatGrid
  mapId: string
}

/**
 * Seat selection page
 *
 * Manages seat selection state and provides UI for users to select a seat.
 * This component handles the selection logic before ticket purchase.
 */
export function SeatSelectionPage({ grid, mapId }: SeatSelectionPageProps) {
  const [selectedSeat, setSelectedSeat] = useState<SeatCoordinate | null>(null)

  const handleSeatClick = (coordinate: SeatCoordinate) => {
    setSelectedSeat(coordinate)
  }

  const handleClearSelection = () => {
    setSelectedSeat(null)
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
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="seat-selection-page__clear-btn"
                >
                  Clear Selection
                </button>
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

