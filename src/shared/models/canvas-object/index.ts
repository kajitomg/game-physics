import {ObjectImage} from "../image";
import {Scene} from "../scene";
import {numberToRgb} from "../../utils/number-to-rgb.ts";
import {Camera} from "../camera";
import {Status, UnitStatuses} from "../unit";
import {deltaTimeAnimationFrame} from "../../utils/delta-time-animation-frame.ts";
import idle from '../../../assets/idle.png'
import walk from '../../../assets/walk.png'

export enum Directions {
  'right' = 0,
  'left' = 1,
}

export type Size = {
  width: number,
  height: number,
}

export type Style = {
  fillColor: string,
  strokeColor: string,
  image: string,
}

export type Position = {
  x: number,
  y: number,
}

export class CanvasObject {
  public id?: number;
  public ctx?: CanvasRenderingContext2D;
  public size: Size = { width: 100, height: 100 };
  public position: Position = { x: 0, y: 0 };
  public image?: ObjectImage;
  public style: Partial<Style>;
  public directions:Directions = Directions.right;
  readonly motion: {
    status: Status;
    statuses: Record<string, Status>;
    acceleration?: number;
  } = {
    status: {
      element:UnitStatuses.idle,
    },
    statuses: {
      idle: {
        element: UnitStatuses.idle,
      },
      walk: {
        element: UnitStatuses.walk,
      },
      slide: {
        element: UnitStatuses.slide,
      },
      jump: {
        element: UnitStatuses.jump,
      },
      fly: {
        element: UnitStatuses.fly,
      },
      kick: {
        element: UnitStatuses.kick,
      },
      slash: {
        element: UnitStatuses.slash,
      },
    },
  }
  
  public physic = {
    frictionCoefficient: 0.4,
    mass: 10,
    accelerationOfGravity: 10,
    appliedForceX: 0,
    currentForceX: 0,
    accelerationX: 0,
    velocityX: 0,
    appliedForceY: 0,
    currentForceY: 0,
    accelerationY: 0,
    velocityY: 0,
  }
  
  public collision: boolean = true;
  
  private scene?: Scene;
  private color?: string;
  private camera?: Camera;
  
  constructor(props?:{
    size?: Partial<Size>,
    position?: Partial<Position>,
    style?: Partial<Style>,
    image?: string,
    mass?: number,
    acceleration?: number,
    maxVelocity?: number,
  }) {
    this.size = {...this.size, ...props?.size};
    this.position = {...this.position, ...props?.position};
    this.style = {...props?.style};
    this.motion.acceleration = props?.acceleration || this.motion.acceleration
    this.physic.mass = props?.mass || this.physic.mass
    
    if (props?.image) {
      this.image = new ObjectImage(props?.image, {
        size: { width: 200, height: 200 },
        position: { x: 0, y: 0 },
      });
    }
    this.walk()
    //this.deceleration()
  }
  
  setCollision(collision: boolean) {
    this.collision = collision
  }
  
  setPosition({ x  = this.position.x, y = this.position.y }) {
    if(x !== this.position.x || y !== this.position.y){
      this.scene?.mask.ctx.clearRect(this.position.x - 2, this.position.y - 2, this.size.width + 4, this.size.height + 4);
    }
    this.camera && this.camera.follow(this,{x,y})
    
    const collisionPosition = this.scene?.collision.getCollisionPosition(this, {x,y})
    
    this.position = {
      x,
      y,
      ...collisionPosition,
    }
 
    if(this.scene) {
      if(x <= 0) this.position.x = 0
      if(x + this.size.width >= this.scene?.options.width) this.position.x = this.scene?.options.width - this.size.width
      if(y <= 0) this.position.y = 0
      if(y + this.size.height >= this.scene?.options.height) this.position.y = this.scene?.options.height - this.size.height
    }
  }
  
  draw() {
    if (this.ctx) {
      this.drawMask()
      this.ctx.clearRect(this.position.x , this.position.y, this.size.width, this.size.height);
      
      this.ctx.beginPath()
      
      this.ctx.fillStyle = this.style.fillColor || 'black'
      this.ctx.strokeStyle = this.style.strokeColor || 'black'
      
      if (this.image?.element){
        if(this.image.element?.complete) {
          this.ctx.drawImage(this.image.element, this.image.position.x, this.image.position.y, this.image.size.width, this.image.size.height, this.position.x, this.position.y, this.size.width, this.size.height)
        } else {
          this.image.element.onload = () => {
            if(this.image?.element?.complete) {
              this.ctx?.drawImage(this.image.element, this.image.position.x, this.image.position.y, this.image.size.width, this.image.size.height, this.position.x, this.position.y, this.size.width, this.size.height)
            }
          }
        }
      } else {
        this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
      }
      this.ctx.closePath()
    }
  }
  
  setDirection(direction: keyof typeof Directions) {
    this.directions = Directions[direction]
  }
  
  private drawMask() {
    if (this.scene) {
      if (this.color) this.scene.mask.ctx.fillStyle = this.color
      
      this.scene.mask.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
  }
  setStatus(status: keyof typeof UnitStatuses) {
    this.motion.status.cancel && this.motion.status.cancel()
    this.motion.status.cancel = undefined
    
    this.motion.status.element = this.motion.statuses[status].element;
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
    this.motion.status.element.publish()
  }
  
  move({ distanceX = 0, distanceY = 0 }) {
    this.setPosition({
      x: this.position.x + distanceX,
      y: this.position.y + distanceY,
    })
    this.draw()
  }
  
  walk() {
    deltaTimeAnimationFrame((deltaTime) => {
      if(this.physic.velocityX || this.physic.velocityY) {
        this.ctx?.clearRect(this.position.x, this.position.y, this.size.width, this.size.height);
        
        this.move({
          distanceX: this.physic.velocityX * deltaTime,
          distanceY: this.physic.velocityY * deltaTime,
        })
      }
    })
  }
  
  setVelocity({ accelerationX = this.physic.accelerationX, accelerationY = this.physic.accelerationY }) {
    this.physic.velocityX = this.calcVelocity(accelerationX);
    this.physic.velocityY = this.calcVelocity(accelerationY);
    
    if(this.physic.velocityX > 0) {
      this.setDirection('right')
    }
    if(this.physic.velocityX < 0) {
      this.setDirection('left')
    }
    
    if(this.physic.velocityX || this.physic.velocityY) {
      if(this.motion.status.element.name !== 'walk') {
        this.setStatus('walk')
      }
    } else {
      if(this.motion.status.element.name !== 'idle') {
        this.setStatus('idle')
      }
    }
  }
  /*
  deceleration() {
    deltaTimeAnimationFrame((deltaTime) => {
      if(this.physic.velocityX || this.physic.velocityY) {
        this.setVelocity({
          velocityX:Math.sign(this.physic.velocityX) * Math.max(0, (Math.abs(this.physic.velocityX) - this.physic.mass * 5 * deltaTime)),
          velocityY:Math.sign(this.physic.velocityY) * Math.max(0, (Math.abs(this.physic.velocityY) - this.physic.mass * 5 * deltaTime)),
        })
      }
    })
  }*/
  
  setImage(image: string) {
    this.image = new ObjectImage(image, {
      size: { width: 200, height: 200 },
      position: { x: 0, y: 0 },
    });
  }
  
  addCamera(camera: Camera) {
    this.camera = camera
    camera.setPosition(this.position, this.size)
  }
  
  friction() {
  
  }
  
  calcVelocity(acceleration: number) {
    return acceleration * this.physic.mass * 10
  }
  
  calcAcceleration(force: number) {
    return force / this.physic.mass
  }
  
  calcForce(deltaTime: number, currentForce: number, maxForce: number) {
    let result = 0
    
    const direction = Math.sign(maxForce) || Math.sign(currentForce)
    const currentDirection = Math.sign(currentForce) || Math.sign(maxForce)
    
    const frictionForce = this.physic.frictionCoefficient * this.physic.mass * this.physic.accelerationOfGravity
    maxForce = Math.abs(maxForce) + frictionForce
    currentForce = Math.abs(currentForce)
    
    const force = maxForce * deltaTime

    if ((maxForce - frictionForce) > 0) {
      result = Math.max(0, Math.min( maxForce - frictionForce,(force + currentForce) / (1 - this.physic.frictionCoefficient)))
    } else if ((maxForce - frictionForce) < frictionForce) {
      result = Math.max(0, (currentForce - frictionForce * deltaTime) * (1 - this.physic.frictionCoefficient))
    }
    
    if (currentDirection !== direction) {
      result = (direction * result) + (currentDirection * currentForce)
      return result
    }

    return direction * result
  }
  
  init(id:number, scene: Scene) {
    this.ctx = scene.ctx
    
    this.scene = scene
    this.id = id
    this.color = numberToRgb(this.id)
    this.draw()
  }
}