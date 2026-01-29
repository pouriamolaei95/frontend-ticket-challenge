import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Seat } from '../Seat'

describe('Seat', () => {
  it('renders an available seat correctly', () => {
    const handleClick = vi.fn()
    render(<Seat availability={0} state="available" x={0} y={0} onClick={handleClick} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('seat', 'seat--available')
    expect(button).not.toBeDisabled()
  })

  it('renders a reserved seat correctly', () => {
    render(<Seat availability={1} state="reserved" x={1} y={2} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('seat', 'seat--reserved')
    expect(button).toBeDisabled()
  })

  it('renders a selected seat correctly', () => {
    render(<Seat availability={0} state="selected" x={2} y={3} onClick={vi.fn()} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('seat', 'seat--selected')
    expect(button).not.toBeDisabled()
  })

  it('calls onClick when available seat is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Seat availability={0} state="available" x={0} y={0} onClick={handleClick} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when reserved seat is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Seat availability={1} state="reserved" x={0} y={0} onClick={handleClick} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when no onClick handler is provided', async () => {
    const user = userEvent.setup()
    render(<Seat availability={0} state="available" x={0} y={0} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    await user.click(button)
    
    // Should not throw
    expect(button).toBeInTheDocument()
  })

  it('has correct aria-label', () => {
    render(<Seat availability={0} state="available" x={5} y={10} />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Seat at row 11, column 6, available')
  })

  it('has correct data attributes', () => {
    render(<Seat availability={0} state="available" x={3} y={7} />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-seat-x', '3')
    expect(button).toHaveAttribute('data-seat-y', '7')
  })
})

