import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sleep } from '../sleep'

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves after the specified delay', async () => {
    const delay = 100
    const promise = sleep(delay)
    
    expect(vi.getTimerCount()).toBe(1)
    
    vi.advanceTimersByTime(delay)
    
    await expect(promise).resolves.toBeUndefined()
  })

  it('resolves immediately for zero delay', async () => {
    const promise = sleep(0)
    
    vi.advanceTimersByTime(0)
    
    await expect(promise).resolves.toBeUndefined()
  })

  it('handles different delay values', async () => {
    const delays = [10, 50, 100, 500, 1000]
    
    for (const delay of delays) {
      const promise = sleep(delay)
      vi.advanceTimersByTime(delay)
      await expect(promise).resolves.toBeUndefined()
    }
  })
})

