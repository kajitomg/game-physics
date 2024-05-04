import {deltaTimeAnimationFrame} from "../../utils/delta-time-animation-frame.ts";
import {multipleEventBus} from "../../utils/multiple-event-bus.ts";

interface Coordinates<T = number> {
  x:T,
  y:T,
}

type Friction = {
  coefficient: number
}

type Forces = {
  applied: Coordinates,
  current: Coordinates,
  friction: Friction,
}

type Acceleration = {
  current: Coordinates,
  gravity: number,
}

type Velocity = {
  current: Coordinates,
}


export class Physics {
  public eventBus = new multipleEventBus('physics')
  private _mass: number;
  private _forces: Forces = {
    applied: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    friction: {
      coefficient: 1,
    }
  };
  private _acceleration: Acceleration = {
    current: { x: 0, y: 0 },
    gravity: 10,
  };
  private _velocity: Velocity = {
    current: { x: 0, y: 0 },
  };
  
  constructor(mass:number) {
    this._mass = mass
    
    this.init()
  }
  
  private calcVelocity(acceleration: number) {
    return acceleration * this.mass * 10
  }
  
  private calcAcceleration(force: number) {
    return force / this.mass
  }
  
  private calcForce(deltaTime: number, currentForce: number, maxForce: number) {
    let result = 0
    
    const direction = Math.sign(maxForce) || Math.sign(currentForce)
    const currentDirection = Math.sign(currentForce) || Math.sign(maxForce)
    
    const frictionForce = this.forces.friction.coefficient * this.mass * this.acceleration.gravity
    maxForce = Math.abs(maxForce) + frictionForce
    currentForce = Math.abs(currentForce)
    
    const force = maxForce * deltaTime
    
    if ((maxForce - frictionForce) > 0) {
      result = Math.max(0, Math.min( maxForce - frictionForce,(force + currentForce) / (1 - this.forces.friction.coefficient)))
    } else if ((maxForce - frictionForce) < frictionForce) {
      result = Math.max(0, (currentForce - frictionForce * deltaTime) * (1 - this.forces.friction.coefficient))
    }
    
    if (currentDirection !== direction) {
      result = (direction * result) + (currentDirection * currentForce)
      return result
    }
    
    return direction * result
  }
  
  private setCurrentForce(force:Partial<Coordinates>) {
    this.forces.current = {
      ...this.forces.current,
      ...force,
    }
    this.eventBus.publish('currentForce')
  }
  
  public setAppliedForce(force:Partial<Coordinates>) {
    this.forces.applied = {
      ...this.forces.applied,
      ...force,
    }
    this.eventBus.publish('appliedForce')
  }
  
  private setCurrentAcceleration(acceleration:Partial<Coordinates>) {
    this.acceleration.current = {
      ...this.acceleration.current,
      ...acceleration,
    }
    this.eventBus.publish('currentAcceleration')
  }
  
  public setCurrentVelocity(velocity:Partial<Coordinates>) {
    this.velocity.current = {
      ...this.velocity.current,
      ...velocity,
    }
    this.eventBus.publish('currentVelocity')
  }
  
  private initMoving() {
    deltaTimeAnimationFrame((deltaTime: number) => {
      if(this.forces.applied.x === 0 && this.forces.current.x === 0 && this.forces.applied.y === 0 && this.forces.current.y === 0) return
      
      this.setCurrentForce({
        x: this.calcForce(deltaTime, this.forces.current.x, this.forces.applied.x),
        y: this.calcForce(deltaTime, this.forces.current.y, this.forces.applied.y),
      })
      this.setCurrentAcceleration({
        x: this.calcAcceleration(this.forces.current.x),
        y: this.calcAcceleration(this.forces.current.y),
      })
      this.setCurrentVelocity({
        x: this.calcVelocity(this.acceleration.current.x),
        y: this.calcVelocity(this.acceleration.current.y),
      })
    })
  }
  
  private init() {
    this.initMoving()
  }
  
  public get mass() {
    return this._mass
  }
  
  public get forces() {
    return this._forces
  }
  
  public get acceleration() {
    return this._acceleration
  }
  
  public get velocity() {
    return this._velocity
  }
}