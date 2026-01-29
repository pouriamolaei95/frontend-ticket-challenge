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

  if (!ticketId) {
    return <Navigate to="/" replace />
  }

  const decodedTicketId = decodeURIComponent(ticketId)
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
          <div className="ticket-confirmation-page__ticket-id" aria-label={`Ticket ID: ${decodedTicketId}`}>
            {decodedTicketId}
          </div>
        </div>
        <p className="ticket-confirmation-page__note">
          You will need this ticket ID to access the event.
        </p>
      </div>
    </div>
  )
}

