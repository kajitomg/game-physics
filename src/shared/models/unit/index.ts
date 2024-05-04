import {CanvasObject, Position, Size, Style} from "../canvas-object";
import {EventBus} from "../../utils/event-bus.ts";

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
  element: typeof UnitStatuses[keyof typeof UnitStatuses],
  cancel?: () => void,
}

export class Unit extends CanvasObject{
 
  
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
  }
  
 
  
}