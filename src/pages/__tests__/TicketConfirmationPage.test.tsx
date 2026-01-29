import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  describe('copy functionality', () => {
    beforeEach(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(() => Promise.resolve()),
        },
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('has a copy button', () => {
      const ticketId = 'test-ticket-123'
      renderWithRouter(ticketId)
      
      const copyButton = screen.getByRole('button', { name: /copy ticket id/i })
      expect(copyButton).toBeInTheDocument()
      expect(copyButton).toHaveTextContent('Copy')
    })

    it('copies ticket ID to clipboard when copy button is clicked', async () => {
      const user = userEvent.setup()
      const ticketId = 'test-ticket-456'
      renderWithRouter(ticketId)
      
      const copyButton = screen.getByRole('button', { name: /copy ticket id/i })
      await user.click(copyButton)
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(ticketId)
    })

    it('shows "Copied!" feedback after copying', async () => {
      const user = userEvent.setup()
      const ticketId = 'test-ticket-789'
      renderWithRouter(ticketId)
      
      const copyButton = screen.getByRole('button', { name: /copy ticket id/i })
      await user.click(copyButton)
      
      await waitFor(() => {
        expect(copyButton).toHaveTextContent('✓ Copied!')
      })
    })

    it('reverts to "Copy" after 2 seconds', async () => {
      vi.useFakeTimers()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const ticketId = 'test-ticket-abc'
      renderWithRouter(ticketId)
      
      const copyButton = screen.getByRole('button', { name: /copy ticket id/i })
      await user.click(copyButton)
      
      await waitFor(() => {
        expect(copyButton).toHaveTextContent('✓ Copied!')
      })
      
      vi.advanceTimersByTime(2000)
      
      await waitFor(() => {
        expect(copyButton).toHaveTextContent('Copy')
      })
      
      vi.useRealTimers()
    })
  })
})

