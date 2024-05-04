import {CanvasObject, Position, Size, Style} from "../canvas-object";
import {EventBus} from "../../utils/event-bus.ts";
import idle from '../../../assets/idle.png'
import walk from '../../../assets/walk.png'

export enum Directions {
  'right' = 0,
  'left' = 1,
}

export const UnitStatuses = {
  idle: new EventBus('idle'),
  walk: new EventBus('walk'),
  slide: new EventBus('slide'),
  jump: new EventBus('jump'),
  fly: new EventBus('fly'),
  kick: new EventBus('kick'),
  slash: new EventBus('slash'),
}

export type Status = {
  current: typeof UnitStatuses[keyof typeof UnitStatuses],
  cancel?: () => void,
  list: Record<string, typeof UnitStatuses[keyof typeof UnitStatuses]>,
}

export class Unit extends CanvasObject{
  public status: Status = {
    current: UnitStatuses.idle,
    list: UnitStatuses,
  };
  public direction:Directions = Directions.right;
  
  constructor(props?:{
    size?: Partial<Size>,
    position?: Partial<Position>,
    style?: Partial<Style>,
    image?: string,
    mass?: number,
    acceleration?: number,
    maxVelocity?: number,
  }) {
    super(props)
    
    this.physic.eventBus.subscribe('currentVelocity', () => this.observeStatus())
    this.physic.eventBus.subscribe('currentVelocity', () => this.observeDirection())
  }
  
  private observeStatus() {
    if(this.physic.velocity.current.x || this.physic.velocity.current.y) {
      if(this.status.current.name !== 'walk') {
        this.setStatus('walk')
      }
    } else {
      if(this.status.current.name !== 'idle') {
        this.setStatus('idle')
      }
    }
  }
  
  private observeDirection() {
    if(this.physic.velocity.current.x > 0) {
      this.setDirection('right')
    }
    if(this.physic.velocity.current.x < 0) {
      this.setDirection('left')
    }
  }
  
  public setDirection(direction: keyof typeof Directions) {
    this.direction = Directions[direction]
  }
  
  private setStatus(status: keyof typeof UnitStatuses) {
    this.status.cancel && this.status.cancel()
    this.status.cancel = undefined
    
    this.status.current = UnitStatuses[status] ;
    switch (status) {
      case 'idle': {
        this.setImage(idle)
        break
      }
      case 'walk': {
        this.setImage(walk)
        break
      }
    }
    this.status.current.publish()
  }
 
  
}