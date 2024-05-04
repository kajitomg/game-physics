import {Position, Size} from "../canvas-object";

export class ObjectImage {
  element?: HTMLImageElement;
  size: Size = { width: 100, height: 100 };
  position: Position = { x: 0, y: 0 };
  
  constructor(src: string, props?:{
    size: Size,
    position: Position,
  }) {
    const img = new Image();
    img.src = src
    
    this.element = img
    
    this.size = {...this.size, ...props?.size}
    this.position = {...this.position, ...props?.position}
  }
  
  setSize({width = this.size.width, height = this.size.height}) {
    this.size = {
      width,
      height,
    }
  }
  
  setPosition({x = this.position.x, y = this.position.y}) {
    this.position = {
      x,
      y,
    }
  }
}