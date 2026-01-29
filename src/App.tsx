import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { TicketConfirmationPage } from './pages/TicketConfirmationPage'

/**
 * Main application component
 *
 * Sets up routing for the ticket booking application:
 * - / : Home page with seat selection
 * - /confirmation/:ticketId : Ticket confirmation page
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/confirmation/:ticketId"
          element={<TicketConfirmationPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

