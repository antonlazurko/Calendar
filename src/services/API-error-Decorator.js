import eventsSingleton from './API-services-Singleton';
class ErrorDecorator {
  constructor(eventsSingleton) {
    this.eventsSingleton = eventsSingleton;
  }
  getEventDecorator() {
    this.eventsSingleton();
    if (this.eventsSingleton.status === 200) {
      return this.eventsSingleton.data;
    }
  }
}
export const errorDecorator = new ErrorDecorator();
