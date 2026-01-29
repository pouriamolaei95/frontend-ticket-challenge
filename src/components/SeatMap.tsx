import React, { useRef, useEffect, useState } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import type { SeatGrid, SeatCoordinate } from '../types'
import { Seat, type SeatState } from './Seat'
import '../styles/seatMap.css'

type SeatMapProps = {
  grid: SeatGrid
  selectedSeat?: SeatCoordinate | null
  onSeatClick?: (coordinate: SeatCoordinate) => void
  seatSize?: number
}

/**
 * Virtualized seat map component
 *
 * Efficiently renders large stadium maps (100k+ seats) using windowing.
 * Only visible seats are rendered to the DOM, ensuring smooth performance.
 *
 * Grid layout:
 * - Outer array (grid) = rows (y-axis)
 * - Inner array (grid[y]) = columns (x-axis)
 */
export function SeatMap({
  grid,
  selectedSeat,
  onSeatClick,
  seatSize = 20,
}: SeatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(800)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const height = grid.length
  const width = height > 0 ? grid[0].length : 0

  const getSeatState = (x: number, y: number): SeatState => {
    if (selectedSeat && selectedSeat.x === x && selectedSeat.y === y) {
      return 'selected'
    }
    const availability = grid[y]?.[x]
    return availability === 1 ? 'reserved' : 'available'
  }

  const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
    const x = columnIndex
    const y = rowIndex
    const availability = grid[y]?.[x] ?? 1
    const state = getSeatState(x, y)

    const handleClick = () => {
      if (onSeatClick && availability === 0) {
        onSeatClick({ x, y })
      }
    }

    return (
      <div style={style}>
        <Seat
          availability={availability}
          state={state}
          onClick={handleClick}
          x={x}
          y={y}
        />
      </div>
    )
  }

  if (width === 0 || height === 0) {
    return <div className="seat-map seat-map--empty">No seats available</div>
  }

  return (
    <div className="seat-map" ref={containerRef}>
      <Grid
        columnCount={width}
        columnWidth={seatSize}
        height={Math.min(height * seatSize, 600)}
        rowCount={height}
        rowHeight={seatSize}
        width={containerWidth}
        className="seat-map__grid"
      >
        {Cell}
      </Grid>
    </div>
  )
}

