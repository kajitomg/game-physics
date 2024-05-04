export const deltaTimeAnimationFrame = (draw:(deltaTime:number) => void) => {
  let id = null as number | null;
  let start = performance.now();
  
  id = requestAnimationFrame(function animate() {
    
    const deltaTime = performance.now() - start;
    
    const deltaTimeSeconds = deltaTime / 1000;
    
    draw(deltaTimeSeconds);
    
    start = performance.now();
    
    id = requestAnimationFrame(animate);
  });
  
  return () => {
    if (id) {
      cancelAnimationFrame(id);
      id = null;
    }
  }
}