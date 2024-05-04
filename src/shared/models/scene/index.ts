import {CanvasObject} from "../canvas-object";
import {Mask} from "../mask";
import {Collision} from "../collision";

export class Scene {
  readonly cvs:HTMLCanvasElement
  readonly ctx:CanvasRenderingContext2D
  readonly mask:Mask
  readonly options = {
    width: 100,
    height: 100
  }
  
  private initializedObjectCount:number = 0;
  readonly objects: CanvasObject[] = [];
  public collision: Collision
  
  constructor(selector: string, options?: {
    width?:number,
    height?:number,
  }) {
    this.options = {
      ...this.options,
      ...options,
    }
    this.mask = new Mask(selector, options)
    this.collision = new Collision(this.objects)
    
    this.cvs = document.createElement('canvas');
    
    this.cvs.classList.add('canvas', 'canvas__main')
    
    const rootElement = document.querySelector(selector);
    
    rootElement?.appendChild(this.cvs);
    
    this.cvs.width = this.options.width;
    this.cvs.height = this.options.height;
    
    this.ctx = this.cvs.getContext('2d', {})
    
    history.scrollRestoration = 'manual'
    window.scroll({left:0, top: 0})
  }
  
  getObjectId() {
    this.initializedObjectCount ++
    return this.initializedObjectCount
  }
  
  add(object: CanvasObject) {
    object.init(this.getObjectId(),this)
    this.objects.push(object)
    this.collision.addCollision(object)
  }
}