import { getScrollJourneyController } from '@/lib/scroll-journey-instance';

export class InputController {
  handleWheel(deltaY: number): boolean {
    return getScrollJourneyController().handleWheel(deltaY);
  }

  dispose(): void {
    getScrollJourneyController().reset();
  }
}
