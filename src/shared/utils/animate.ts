
type Timing = (timeFraction: number) => number

type Draw = (progress: number) => void

const defaultTiming = (timeFraction: number) => {
  return timeFraction;
}

export function animate({draw, duration, timing = defaultTiming, loop = false}: {draw: Draw, duration:number, timing?: Timing, loop?: boolean }) {
  let id = null as number | null;
  let cancel = null as (() => void )| null;
  
  let start = performance.now();
  
  id = requestAnimationFrame(function anim(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    
    let progress = timing(timeFraction);
    
    draw(progress);
    
    if ( loop && timeFraction === 1 ) {
      cancel = animate({draw, duration, timing, loop});
    }
    
    if (timeFraction < 1) {
      id = requestAnimationFrame(anim);
    }
    
  });
  
  return () => {
    if (id) {
      cancelAnimationFrame(id);
      cancel && cancel()
      id = null;
    }
  }
}