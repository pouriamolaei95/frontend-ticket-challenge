import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import '../styles/ticketConfirmationPage.css'

/**
 * Ticket confirmation page
 *
 * Displays the ticket ID to the user after a successful purchase.
 * This is the final step in the ticket booking flow.
 */
export function TicketConfirmationPage() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const [copied, setCopied] = useState(false)

  if (!ticketId) {
    return <Navigate to="/" replace />
  }

  const decodedTicketId = decodeURIComponent(ticketId)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(decodedTicketId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy ticket ID:', err)
    }
  }

  return (
    <div className="ticket-confirmation-page">
      <div className="ticket-confirmation-page__container">
        <div className="ticket-confirmation-page__icon">✓</div>
        <h1 className="ticket-confirmation-page__title">Ticket Purchased Successfully!</h1>
        <p className="ticket-confirmation-page__message">
          Your ticket has been confirmed. Please save your ticket ID for your records.
        </p>
        <div className="ticket-confirmation-page__ticket-id-container">
          <label className="ticket-confirmation-page__ticket-id-label">Ticket ID</label>
          <div className="ticket-confirmation-page__ticket-id-wrapper">
            <div className="ticket-confirmation-page__ticket-id" aria-label={`Ticket ID: ${decodedTicketId}`}>
              {decodedTicketId}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="ticket-confirmation-page__copy-btn"
              aria-label="Copy ticket ID to clipboard"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <p className="ticket-confirmation-page__note">
          You will need this ticket ID to access the event.
        </p>
      </div>
    </div>
  )
}

