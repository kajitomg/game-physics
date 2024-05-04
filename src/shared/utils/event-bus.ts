export class EventBus {
  readonly name:string
  private events: (() => void)[] = []
  constructor(name:string) {
    this.name = name
  }
  
  publish() {
    const events = this.events
    if (!events) return
    
    for (let event of events) {
      event();
    }
  }
  
  subscribe(event:() => void) {
    this.events.push(event)
  }
}