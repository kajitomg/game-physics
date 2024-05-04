import {rgbToNumber} from "../../utils/rgb-to-number.ts";

export class Mask {
  readonly cvs:HTMLCanvasElement
  readonly ctx:CanvasRenderingContext2D
  readonly size = {
    width: 100,
    height: 100
  }
  
  constructor(selector: string, options?: {
    width?:number,
    height?:number,
  }) {
    this.size = {
      ...this.size,
      ...options,
    }
    this.cvs = document.createElement('canvas');
    
    this.cvs.classList.add('canvas', 'canvas__mask')
    
    const rootElement = document.querySelector(selector);
    
    rootElement?.appendChild(this.cvs);
    
    this.cvs.width = this.size.width;
    this.cvs.height = this.size.height;
    
    this.ctx = this.cvs.getContext('2d',{
      willReadFrequently: false,
    })
    
    this.cvs.addEventListener('click', (event) => this.getIdByClick(event))
  }
  
  getColor(event: MouseEvent) {
    if(this.ctx) {
      return this.ctx.getImageData(event.x - 1, event.y - 1, 3, 3)
    }
  }
  
  getIdByClick(event: MouseEvent) {
    const items = this.getColor(event)
    const res:number[][] = []
    
    items?.data.map((item:number, i:number) => {
      if(res.length <= Math.floor(i / 4)) {
        res.push([])
      }
      res[Math.floor(i / 4)].push(item)
      return item
    })
    const data = res.map((item) => {
      return rgbToNumber(item[0],item[1],item[2])
    })
    console.log(data)
    return data
  }
  
}