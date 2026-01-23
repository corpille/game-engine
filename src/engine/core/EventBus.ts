type EventHandler = (data?: any) => void;

export default class EventBus {
  private listeners = new Map<string, EventHandler[]>();

  on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  emit(event: string, data?: any) {
    this.listeners.get(event)?.forEach((handler) => handler(data));
  }
}
