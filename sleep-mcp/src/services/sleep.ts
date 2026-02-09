/**
 * Service class that handles sleep functionality
 */
export class SleepService {
  /**
   * Wait for the specified duration
   * @param ms Duration to wait in milliseconds
   * @returns Promise that resolves after the duration
   */
  async sleep(ms: number): Promise<void> {
    if (isNaN(ms) || ms < 0) {
      throw new Error("milliseconds must be a non-negative number");
    }
    
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
