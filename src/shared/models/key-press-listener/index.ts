import {Listener} from "../listener";
import {deltaTimeAnimationFrame} from "../../utils/delta-time-animation-frame.ts";

export type ListenerKey = {
  cancel?:() => void,
  draw:(deltaTime: number) => void
}

export type ListenerKeys = Record<string, ListenerKey>

type ListenerClearedKey = ListenerKey & {
  clear?:() => void
}

export type ListenerClearedKeys = Record<string, ListenerClearedKey>

export class KeyPressListener extends Listener {
  keys: ListenerClearedKeys;
  
  constructor({ keys }: { keys:ListenerKeys }) {
    super();
    this.keys = keys;
  }
  
  private createKeyDownInterval(event: KeyboardEvent) {
    const keys = Object.keys(this.keys);
    
    keys.map((key) => {
      if(key === event.code) {
        if (this.keys[key].clear) {
          this.cancelKeyAnimationFrame(key);
        }
        this.keys[key].clear = deltaTimeAnimationFrame(this.keys[key].draw);
      }
    });
    
  }
  private cancelKeyUpAnimationFrame(event: KeyboardEvent) {
    const keys = Object.keys(this.keys)

    keys.map((key) => {
      if(key === event.code) {
        if (this.keys[key].clear) {
          const item = this.keys[key]
          this.cancelKeyAnimationFrame(key);
          item.cancel && item.cancel()
        }
      }
    });
  }
  private cancelKeysAnimationFrame() {
    const keys = Object.keys(this.keys);
    
    keys.map(key => {
      this.cancelKeyAnimationFrame(key);
    });
  }
  
  private cancelKeyAnimationFrame(id:keyof typeof this.keys) {
    const clear = this.keys[id]?.clear

    if(clear) {
      clear();
      this.keys[id].clear = undefined;
    }
  }
  
  call() {
    document.addEventListener('keydown', (e) => {
      this.createKeyDownInterval(e)
    });
    document.addEventListener('keyup', (e) => {
      this.cancelKeyUpAnimationFrame(e)
    });
    window.addEventListener('blur', () => {
      this.cancelKeysAnimationFrame()
    });
  }
}