import {CanvasObject, Position, Size} from "../canvas-object";

export class Collision {
  public vertices: {[id:string]:number[]} = {}
  
  private objects:CanvasObject[] = []
  
  constructor() {
    this.init()
  }
  
  init() {
    requestAnimationFrame(() => {
      const vertices: {[id:string]:number[]} = {}
      this.objects.map((object) => {
        if (object.id) vertices[object.id] = [object.position.x, object.position.y, object.position.x + object.size.width, object.position.y + object.size.height, object.id]
      })
      this.vertices = vertices
      requestAnimationFrame(() => this.init())
    })
  }
  
  collisionReaction(givingReaction: CanvasObject, reacted: CanvasObject) {
    const velocityX = givingReaction.physic.velocity.current.x / 2
    const velocityY = givingReaction.physic.velocity.current.y / 2
    
    givingReaction.physic.setCurrentVelocity({x:velocityX,y:velocityY})
    reacted.physic.setCurrentVelocity({x:velocityX,y:velocityY})
  }
  
  buildMap(id?:number) {
    const keys = Object.keys(this.vertices)
    const vertices:number[][] = JSON.parse(JSON.stringify(Object.values(keys.filter(key => key !== id?.toString()).map((key) => this.vertices[key]))))
    
    return vertices
  }
  
  getIntersections(position:Position, size:Size, id?: number, offset = 0) {
    const vertices = this.buildMap(id)
    const res:number[][] = []

    vertices.map((item) => {
      item[0] = item[0] - offset
      item[1] = item[1] - offset
      item[2] = item[2] + offset
      item[3] = item[3] + offset
      if((position.x + size.width + offset  > item[0] && position.y + size.height + offset > item[1]) && (position.x - offset < item[2] && position.y - offset < item[3])) {
        res.push(item)
      }
    })
    return res
  }
  
  getCollisionPosition(object: CanvasObject, position: Position, intersectingOffsetoffset = 10, offset = 0) {
    const result:{x?: number, y?: number} = {}
    
    const intersecting = this.getIntersections(object.position, object.size,object.id, intersectingOffsetoffset)
    
    intersecting?.map((item) => {
      //const itemObject = this.objects.find((object) => object.id === item[4])
      const centerItemX = (item[2] - item[0]) / 2 + item[0]
      const centerItemY = (item[3] - item[1]) / 2 + item[1]
      const centerObjX = object.size.width / 2 + position.x
      const centerObjY = object.size.height / 2 + position.y
      if (centerObjX <= centerItemX) {
        if((object.position.y + object.size.height > item[1] + intersectingOffsetoffset) && (object.position.y < item[1] + item[3] - intersectingOffsetoffset - item[1])){
          result.x = Math.min(position.x,item[0] - object.size.width + intersectingOffsetoffset - offset)
        }
      }
      if (centerObjX >= centerItemX) {
        if((object.position.y + object.size.height > item[1] + intersectingOffsetoffset) && (object.position.y < item[1] + item[3] - intersectingOffsetoffset - item[1])){
          result.x = Math.max(position.x,item[2] - intersectingOffsetoffset + offset)
          
        }
      }
      if (centerObjY <= centerItemY) {
        if((object.position.x + object.size.width > item[0] + intersectingOffsetoffset) && (object.position.x < item[0] + item[2] - intersectingOffsetoffset - item[0])){
          result.y = Math.min(position.y,item[1] - object.size.height + intersectingOffsetoffset - offset)
        }
      }
      if (centerObjY >= centerItemY) {
        if((object.position.x + object.size.width > item[0] + intersectingOffsetoffset) && (object.position.x < item[0] + item[2] - intersectingOffsetoffset - item[0])){
          result.y = Math.max(position.y,item[3] - intersectingOffsetoffset + offset)
        }
      }
      // itemObject && this.collisionReaction(object, itemObject)
    })
    
    return result
  }
  
  addCollision(object: CanvasObject) {
    object.collision && this.objects.push(object)
  }
  
  deleteCollision(object: CanvasObject) {
    const objects = [...this.objects]
    
    this.objects = objects.filter((item) => item.id === object.id)
  }
}