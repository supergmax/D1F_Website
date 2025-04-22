import React, { useState, useEffect, useRef } from 'react';
import { animateValue } from '../utils/animateCount';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState<number>(0);
  const hasAnimated = useRef<boolean>(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateValue(0, end, duration, setCount);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [end, duration]);

  return (
    <div ref={counterRef} className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}