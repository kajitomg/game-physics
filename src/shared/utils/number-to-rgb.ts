export const numberToRgb = (num:number) => {
  if(num >= 256**3 || num <= 0) return;
  const r = Math.floor(Math.floor(num / 256 ) / 256 ) % 256;
  const g = Math.floor(num / 256 ) % 256;
  const b = num % 256;
  const a = 1;
  
  return `rgba(${r},${g},${b},${a})`;
}
