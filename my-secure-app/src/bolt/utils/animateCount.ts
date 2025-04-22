export function animateValue(
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void
): void {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    
    callback(value);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      callback(end); // Ensure the final value is exact
    }
  };
  
  window.requestAnimationFrame(step);
}