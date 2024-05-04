export class multipleEventBus {
  readonly name:string
  private events: Record<string, (() => void)[]> = {}
  constructor(name:string) {
    this.name = name
  }
  
  publish(fieldName: keyof typeof this.events) {
    const events = this.events[fieldName]
    if (!events) return
    
    for (let event of events) {
        event();
      
    }
  }
  
  subscribe(fieldName: string,event:() => void) {
    if(!this.events[fieldName]) {
      this.events[fieldName] = []
    }
    
    this.events[fieldName].push(event)
  }
}
