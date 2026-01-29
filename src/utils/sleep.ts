/**
 * Sleep helper for async flows (mock network delays, transitions, etc).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}



