import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface AnimatedNumberProps {
  value: number;
  formatter?: (value: number) => string;
  duration?: number;
  className?: string;
}

const defaultFormatter = (value: number) =>
  Math.round(value).toLocaleString('id-ID');

export function AnimatedNumber({
  value,
  formatter = defaultFormatter,
  duration = 720,
  className,
}: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();
  const previousValue = useRef(0);
  const [displayValue, setDisplayValue] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion || !Number.isFinite(value)) {
      previousValue.current = value;
      setDisplayValue(value);
      return;
    }

    const startValue = previousValue.current;
    const difference = value - startValue;
    const startTime = performance.now();
    let frameId = 0;

    const update = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(startValue + difference * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(update);
      } else {
        previousValue.current = value;
      }
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [duration, reduceMotion, value]);

  return (
    <span className={`tabular-nums ${className ?? ''}`} aria-label={formatter(value)}>
      {formatter(displayValue)}
    </span>
  );
}
