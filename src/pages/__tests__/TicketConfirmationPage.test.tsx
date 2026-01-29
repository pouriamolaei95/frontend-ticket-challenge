import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { TicketConfirmationPage } from '../TicketConfirmationPage'

const renderWithRouter = (ticketId: string) => {
  const path = `/confirmation/${encodeURIComponent(ticketId)}`
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/confirmation/:ticketId" element={<TicketConfirmationPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('TicketConfirmationPage', () => {
  it('displays the ticket ID', () => {
    const ticketId = 'test-ticket-123'
    renderWithRouter(ticketId)
    
    expect(screen.getByText(ticketId)).toBeInTheDocument()
  })

  it('displays success message', () => {
    const ticketId = 'test-ticket-456'
    renderWithRouter(ticketId)
    
    expect(screen.getByText(/Ticket Purchased Successfully!/i)).toBeInTheDocument()
  })

  it('displays helpful instructions', () => {
    const ticketId = 'test-ticket-789'
    renderWithRouter(ticketId)
    
    expect(screen.getByText(/save your ticket ID/i)).toBeInTheDocument()
  })

  it('has correct ticket ID label', () => {
    const ticketId = 'test-ticket-abc'
    renderWithRouter(ticketId)
    
    expect(screen.getByText('Ticket ID')).toBeInTheDocument()
  })

  it('handles URL-encoded ticket IDs', () => {
    const ticketId = 'ticket-with-special-chars-@#$'
    const encoded = encodeURIComponent(ticketId)
    renderWithRouter(encoded)
    
    expect(screen.getByText(ticketId)).toBeInTheDocument()
  })
})

