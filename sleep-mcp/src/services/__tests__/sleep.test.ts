import { jest } from '@jest/globals';
import { SleepService } from '../sleep.js';

describe('SleepService', () => {
  let service: SleepService;
  
  beforeEach(() => {
    service = new SleepService();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('sleep', () => {
    it('should wait for the specified duration', async () => {
      const duration = 1000;
      const promise = service.sleep(duration);
      
      // Fast-forward time
      jest.advanceTimersByTime(duration);
      
      await promise; // Should resolve without throwing
    });

    it('should reject negative durations', async () => {
      await expect(service.sleep(-1000))
        .rejects
        .toThrow('milliseconds must be a non-negative number');
    });

    it('should reject NaN durations', async () => {
      await expect(service.sleep(NaN))
        .rejects
        .toThrow('milliseconds must be a non-negative number');
    });

    it('should handle zero duration', async () => {
      const promise = service.sleep(0);
      jest.advanceTimersByTime(0);
      await promise; // Should resolve without throwing
    });

    it('should handle large durations', async () => {
      const duration = 24 * 60 * 60 * 1000; // 24 hours
      const promise = service.sleep(duration);
      jest.advanceTimersByTime(duration);
      await promise; // Should resolve without throwing
    });
  });
});
