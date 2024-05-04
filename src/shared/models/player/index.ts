import { Position, Size, Style } from "../canvas-object";
import { KeyPressListener } from "../key-press-listener";
import { Unit } from "../unit";
import {animate} from "../../utils/animate.ts";

export class Player extends Unit {
  moveMechanic = new KeyPressListener({
    keys:{
      KeyW:{
        draw:() => {
          this.physic.setAppliedForce({y: -20})
        },
        cancel:() => {
          this.physic.setAppliedForce({y: 0})
        }
      },
      KeyA:{
        draw:() => {
          this.physic.setAppliedForce({x: -20})
          this.setDirection('left')
        },
        cancel:() => {
          this.physic.setAppliedForce({x: 0})
        }
      },
      KeyS:{
        draw:() => {
          this.physic.setAppliedForce({y: 20})
        },
        cancel:() => {
          this.physic.setAppliedForce({y: 0})
        }
      },
      KeyD:{
        draw:() => {
          this.physic.setAppliedForce({x: 20})
          this.setDirection('right')
        },
        cancel:() => {
          this.physic.setAppliedForce({x: 0})
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
    this.status.list.idle.subscribe(() => this.idle())
    this.status.list.walk.subscribe(() => this.walk())
  }
  
  private walk() {
    const animation = this.createAnimation(500, 24)
    
    animation((progress, timeOfFrame) => {
      this.image?.setPosition({
        x: Math.max(0, Math.round(progress / (timeOfFrame))- 1) * this.image?.size.width,
        y: this.direction * this.image?.size.height,
      })
      this.draw()
    })
  }
  
  private idle() {
    const animation = this.createAnimation(500, 18)
    
    animation((progress, timeOfFrame) => {
      this.image?.setPosition({
        x: Math.max(0, Math.round(progress / (timeOfFrame)) - 1) * this.image?.size.width,
        y: this.direction * this.image?.size.height,
      })
      this.draw()
    })
  }
  
  private createAnimation(duration: number, frames: number) {
    const timeOfFrame = duration / frames / duration
    
    return (draw:(progress: number, timeOfFrame: number) => void) => {
      this.status.cancel = animate({
          duration,
          draw:(progress) => draw(progress, timeOfFrame),
          loop: true
        }
      )
    }
  }
  
}