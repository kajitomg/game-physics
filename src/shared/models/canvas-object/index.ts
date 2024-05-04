import {ObjectImage} from "../image";
import {Scene} from "../scene";
import {numberToRgb} from "../../utils/number-to-rgb.ts";
import {Camera} from "../camera";
import {Physics} from "../physics";
import {deltaTimeAnimationFrame} from "../../utils/delta-time-animation-frame.ts";

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
  
  public physic: Physics
  
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
  }) {
    this.size = {...this.size, ...props?.size};
    this.position = {...this.position, ...props?.position};
    this.style = {...props?.style};
    this.physic = new Physics(props?.mass || 10)

    if (props?.image) {
      this.setImage(props.image)
    }
  }
  
  private setPosition({ x  = this.position.x, y = this.position.y }) {
    if(x !== this.position.x || y !== this.position.y){
      this.draw({x, y})
    }
    
    const collisionPosition = this.scene?.collision.getCollisionPosition(this, {x,y}) // Должен быть только object
    
    this.position = {
      x,
      y,
      ...collisionPosition,
    }
    
    this.camera && this.camera.follow(this)
  }
  
  public draw(prevPosition: Position = {x:this.position.x,y:this.position.y}) {
    this.drawObjectMask(prevPosition)
    this.drawObject(prevPosition)
  }
  
  private drawObjectMask(prevPosition: Position) {
    if (this.scene) {
      this.scene?.mask.ctx.clearRect(prevPosition.x - 5, prevPosition.y - 5, this.size.width + 10, this.size.height + 10);
      
      if (this.color) this.scene.mask.ctx.fillStyle = this.color
      
      this.scene.mask.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
  }
  
  private drawObject(prevPosition: Position) {
    if (this.ctx) {
      this.ctx.clearRect(prevPosition.x , prevPosition.y, this.size.width, this.size.height);
      
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
  
  private setMove({ distanceX = 0, distanceY = 0 }) {
    this.setPosition({
      x: this.position.x + distanceX,
      y: this.position.y + distanceY,
    })
  }
  
  private initMoving() {
    deltaTimeAnimationFrame((deltaTime) => {
      if(this.physic.velocity.current.x || this.physic.velocity.current.y) {
        this.setMove({
          distanceX: this.physic.velocity.current.x * deltaTime,
          distanceY: this.physic.velocity.current.y * deltaTime,
        })
      }
    })
  }
  
  public setImage(image: string) {
    this.image = new ObjectImage(image, {
      size: { width: 200, height: 200 },
      position: { x: 0, y: 0 },
    });
  }
  
  public addCamera(camera: Camera) {
    this.camera = camera
    camera.setPosition(this.position, this.size)
  }
  
  public init(id:number, scene: Scene) {
    this.ctx = scene.ctx
    
    this.scene = scene
    this.id = id
    this.color = numberToRgb(this.id)
    
    this.draw()
    this.initMoving()
  }
}