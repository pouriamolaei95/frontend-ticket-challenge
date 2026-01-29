import type { TicketId } from '../types'
import '../styles/ticketConfirmationPage.css'

type TicketConfirmationPageProps = {
  ticketId: TicketId
}

/**
 * Ticket confirmation page
 *
 * Displays the ticket ID to the user after a successful purchase.
 * This is the final step in the ticket booking flow.
 */
export function TicketConfirmationPage({ ticketId }: TicketConfirmationPageProps) {
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
          <div className="ticket-confirmation-page__ticket-id" aria-label={`Ticket ID: ${ticketId}`}>
            {ticketId}
          </div>
        </div>
        <p className="ticket-confirmation-page__note">
          You will need this ticket ID to access the event.
        </p>
      </div>
    </div>
  )
}

