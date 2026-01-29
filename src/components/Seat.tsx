import type { SeatAvailability } from '../types'

export type SeatState = 'available' | 'reserved' | 'selected'

type SeatProps = {
  availability: SeatAvailability
  state: SeatState
  onClick?: () => void
  x: number
  y: number
}

/**
 * Individual seat component
 *
 * Renders a single seat with visual state:
 * - available: seat can be selected
 * - reserved: seat is already taken
 * - selected: seat is currently selected by user
 */
export function Seat({ availability, state, onClick, x, y }: SeatProps) {
  const isClickable = availability === 0 && state !== 'reserved' && onClick

  const handleClick = () => {
    if (isClickable) {
      onClick()
    }
  }

  return (
    <button
      type="button"
      className={`seat seat--${state}`}
      onClick={handleClick}
      disabled={!isClickable}
      aria-label={`Seat at row ${y + 1}, column ${x + 1}, ${state}`}
      data-seat-x={x}
      data-seat-y={y}
    >
      <span className="seat__inner" />
    </button>
  )
}

