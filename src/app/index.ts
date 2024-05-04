import './styles.css';


{/*
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id="scene" class="scene">
      <div id="unit" class="unit">
      
      </div>
    </div>
  </div>
`
*/}

type Unit = {
  element: HTMLElement,
  style: {
    width: string,
    height: string,
    background: string,
  },
  position: {
    x: number,
    y: number,
  },
}

const createScene = ({ elementId, width = 100, height = 100 }:{ elementId:string, width?:number, height?:number }) => {
  const scene = {
    element: null as HTMLElement | null,
    width,
    height,
    camera: {},
    texture: '#fff',
    units:[] as Unit[],
    setCamera() {},
    setTexture(texture: string) {
      this.texture = texture;
      if (this.element) this.element.style.background = texture
    },
    addUnit(unit:Unit) {
      unit.element.style.position = 'absolute';
      unit.element.style.width = unit.style.width;
      unit.element.style.height = unit.style.height;
      unit.element.style.background = unit.style.background;
      this.units.push(unit)
    },
    deleteUnit() {},
    render(callback?: () => void) {

      const unitsLayout = this.element?.querySelector('#units')
      
      unitsLayout?.replaceChildren(...this.units.map(unit => unit.element))
      
      callback && callback()
      
    },
    init() {
      this.element = document.querySelector(`#${elementId}`)
      if (this.element) {
        this.element.style.width = `${width}px`
        this.element.style.height = `${height}px`
      }
      
      const unitsLayout = document.createElement('div')
      unitsLayout.id = 'units'
      
      this.element?.appendChild(unitsLayout)
    },
  }
  
  scene.init()
  
  return scene
}

const scene = createScene({
  elementId:'app',
  width: 3000,
  height: 3000,
})

scene.setTexture('rgb(63,94,251) radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)')

const unit =  {
  element: document.createElement('div'),
  style: {
    width: '100px',
    height: '100px',
    background: 'red',
  },
  position: {
    x: 0,
    y: 0.
  }
}
unit.element.id = 'unit'

scene.addUnit(unit)



  const keyDown = (key) => {
    if (key.code === 'KeyW') {
      unit.position.y = unit.position.y - 3
      if (unit) unit.element.style.top = `${unit.position.y}px`
    }
    if (key.code === 'KeyA') {
      unit.position.x = unit.position.x - 3
      if (unit) unit.element.style.left = `${unit.position.x}px`
    }
    if (key.code === 'KeyS') {
      unit.position.y = unit.position.y + 3
      if (unit) unit.element.style.top = `${unit.position.y}px`
    }
    if (key.code === 'KeyD') {
      unit.position.x = unit.position.x + 3
      if (unit) unit.element.style.left = `${unit.position.x}px`
    }
  }
function animate({timing, draw, duration}) {
  
  let start = performance.now();
  
  requestAnimationFrame(function animate(time) {
    // timeFraction изменяется от 0 до 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    
    // вычисление текущего состояния анимации
    let progress = timing(timeFraction);
    
    draw(progress); // отрисовать её
    
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
    
  });
}
const render = () => {
  document.removeEventListener('keydown', keyDown)
  animate(render)
  
  
  document.addEventListener('keydown', keyDown)
}

scene.render()
render()

