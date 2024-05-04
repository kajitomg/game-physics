import {CanvasObject, Position, Size} from "../canvas-object";

export class Camera {
  public offset: number = 0
  
  constructor(offset?: number) {
    
    this.offset = offset || this.offset
  }
  
  follow(object: CanvasObject, position: Position) {
    if ((object.position.y - window.scrollY + this.offset >= window.innerHeight - object.size.height) && (position.y - object.position.y > 0)) {
      window.scroll({top:object.position.y - window.innerHeight + object.size.height + this.offset})
    }
    if ((object.position.y - this.offset < window.scrollY) && (position.y - object.position.y < 0)) {
      window.scroll({top:object.position.y - this.offset})
    }
    
    if ((object.position.x - window.scrollX + this.offset >= window.innerWidth - object.size.width) && (position.x - object.position.x > 0)) {
      window.scroll({left:object.position.x - window.innerWidth + object.size.width + this.offset})
    }
    if ((object.position.x - this.offset < window.scrollX) && (position.x - object.position.x < 0)) {
      window.scroll({left:object.position.x - this.offset})
    }
  }
  
  setPosition(position: Position, size: Size) {
    window.scroll({top:position.y - (window.innerHeight - size.height) / 2, left: position.x - (window.innerWidth - size.width) / 2})
  }
  
  setOffset(offset: number) {
    this.offset = offset
  }
}