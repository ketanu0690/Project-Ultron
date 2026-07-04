import { ScrollJourneyController } from '@/controllers/ScrollJourneyController';

let instance: ScrollJourneyController | null = null;

export function getScrollJourneyController(): ScrollJourneyController {
  if (!instance) {
    instance = new ScrollJourneyController();
  }
  return instance;
}
