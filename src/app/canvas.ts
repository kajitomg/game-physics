import './styles.css';
import idle from '../assets/idle.png'
import {Scene} from "../shared/models/scene";
import {Player} from "../shared/models/player";
import {Camera} from "../shared/models/camera";
import {CanvasObject} from "../shared/models/canvas-object";

const scene = new Scene('#app', {width:3000,height:3000})
const camera = new Camera(300)

const player = new Player({
  image:idle,
  mass: 5,
  maxVelocity: 300,
  position: {
    x: 1500,
    y: 1500,
  },
  size: {
    height:200,
    width:200,
  }
})

const object = new CanvasObject({
  style: {
    fillColor: '#000',
  },
  position: {
    x:500,
    y:500,
  },
  size: {
    height:200,
    width:100,
  }
})



const object2 = new CanvasObject({
  style: {
    fillColor: '#000',
  },
  position: {
    x:1000,
    y:1000,
  },
  size: {
    height:200,
    width:100,
  }
})

const object1 = new CanvasObject({
  style: {
    fillColor: '#000',
  },
  position: {
    x:700,
    y:400,
  },
  size: {
    height:100,
    width:100,
  }
})

player.addCamera(camera)

scene.add(player)
scene.add(object)
scene.add(object1)
scene.add(object2)

/*
const getColor = (e) => {
  if(scene.ctxMask) {
    return scene.ctxMask.getImageData(e.x - 1, e.y - 1, 3, 3)
  }
}

  if (scene.ctxMask) {
    scene.ctxMask?.beginPath()
    scene.ctxMask.fillStyle = 'red'
    
    scene.ctxMask?.fillRect(0, 0, 200, 200)
    
    scene.ctxMask?.closePath()
    scene.ctxMask?.beginPath()
    
    scene.ctxMask?.closePath()
    
    scene.cvsMask.addEventListener('click', (e) => {
      const item = getColor(e)
      const res:number[][] = []
      item?.data.map((item:number, i:number) => {
        if(res.length <= Math.floor(i / 4)) {
          res.push([])
        }
       res[Math.floor(i / 4)].push(item)
      })
    })
    const num = Math.floor(255 / 256)
    console.log(num)
    
  }*/
  




