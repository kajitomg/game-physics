import {rgbToNumber} from "../../utils/rgb-to-number.ts";

export class Mask {
  readonly cvs:HTMLCanvasElement
  readonly ctx:CanvasRenderingContext2D
  readonly options = {
    width: 100,
    height: 100
  }
  
  constructor(selector: string, options?: {
    width?:number,
    height?:number,
  }) {
    this.options = {
      ...this.options,
      ...options,
    }
    this.cvs = document.createElement('canvas');
    
    this.cvs.classList.add('canvas', 'canvas__mask')
    
    const rootElement = document.querySelector(selector);
    
    rootElement?.appendChild(this.cvs);
    
    this.cvs.width = this.options.width;
    this.cvs.height = this.options.height;
    
    this.ctx = this.cvs.getContext('2d',{
      willReadFrequently: false,
    })
    
    const getColor = (e) => {
      if(this.ctx) {
        return this.ctx.getImageData(e.x - 1, e.y - 1, 3, 3)
      }
    }
    
    this.cvs.addEventListener('click', (e) => {
      const items = getColor(e)
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
    })
  }
}