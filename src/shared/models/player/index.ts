import { Position, Size, Style } from "../canvas-object";
import { KeyPressListener } from "../key-press-listener";
import { Unit } from "../unit";
import {animate} from "../../utils/animate.ts";
import {deltaTimeAnimationFrame} from "../../utils/delta-time-animation-frame.ts";

enum Directions {
  'top' = 2,
  'bottom' = 3,
  'right' = 0,
  'right-top' = 4,
  'right-bottom' = 6,
  'left' = 1,
  'left-top' = 5,
  'left-bottom' = 7,
}

export class Player extends Unit {
  direction: Directions = Directions.right;
  moveMechanic = new KeyPressListener({
    keys:{
      KeyW:{
        draw:() => {
          this.physic.appliedForceY = -20
        },
        cancel:() => {
          this.physic.appliedForceY = 0
        }
      },
      KeyA:{
        draw:() => {
          this.physic.appliedForceX = -20
          this.direction = Directions.left
        },
        cancel:() => {
          this.physic.appliedForceX = 0
        }
      },
      KeyS:{
        draw:() => {
          this.physic.appliedForceY = 20
        },
        cancel:() => {
          this.physic.appliedForceY = 0
        }
      },
      KeyD:{
        draw:() => {
          this.physic.appliedForceX = 20
          this.direction = Directions.right
        },
        cancel:() => {
          this.physic.appliedForceX = 0
        }
      },
    }
  })
  
  constructor(props?:{
    size?: Partial<Size>,
    position?: Partial<Position>,
    style?: Partial<Style>,
    image?: string,
    acceleration?: number,
    maxVelocity?: number,
    mass?: number,
  }) {
    super(props)
    this.moveMechanic.call()
    this.idle()
    this.motion.statuses.idle.element.subscribe(() => this.idle())
    this.motion.statuses.walk.element.subscribe(() => this.anim())
    this.draw()
    const test = (deltaTime: number) => {
      if(this.physic.appliedForceX === 0 && this.physic.currentForceX === 0 && this.physic.appliedForceY === 0 && this.physic.currentForceY === 0) return
      
      this.physic.currentForceX = this.calcForce(deltaTime, this.physic.currentForceX, this.physic.appliedForceX)
      this.physic.accelerationX = this.calcAcceleration(this.physic.currentForceX)
      this.physic.currentForceY = this.calcForce(deltaTime, this.physic.currentForceY, this.physic.appliedForceY)
      this.physic.accelerationY = this.calcAcceleration(this.physic.currentForceY)

      this.setVelocity({
        accelerationX:this.physic.accelerationX,
        accelerationY:this.physic.accelerationY,
      })
    }
    deltaTimeAnimationFrame(test)
  }
  
  anim() {
    const duration = 500
    const frames = 24
    const timeOfFrame = duration / frames / duration
    this.motion.status.cancel = animate({
      duration,
      draw:(progress) => {
          this.image?.setPosition({
            x: Math.max(0, Math.round(progress / (timeOfFrame))- 1) * this.image?.size.width,
            y: this.direction * this.image?.size.height,
          })
          this.draw()
        },
      loop: true
      }
    )
  }
  
  idle() {
    const duration = 500
    const frames = 18
    const timeOfFrame = duration / frames / duration
    
    this.motion.status.cancel = animate({
        duration,
        draw:(progress) => {
          this.image?.setPosition({
            x: Math.max(0, Math.round(progress / (timeOfFrame)) - 1) * this.image?.size.width,
            y: this.direction * this.image?.size.height,
          })
          this.draw()
        },
        loop: true
      }
    )
  }
  
}