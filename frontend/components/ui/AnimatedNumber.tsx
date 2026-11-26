"use client";

import React, { useEffect, useState, useRef } from "react";

interface AnimatedNumberProps {
  value: string;
  duration?: number;
}

export function AnimatedNumber({ value, duration = 650 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevNumericRef = useRef<number | null>(null);

  useEffect(() => {
    const prefix = value.startsWith("$") ? "$" : "";
    const numericString = value.replace(/[^0-9.-]+/g, "");
    const targetValue = parseFloat(numericString);

    if (isNaN(targetValue)) {
      setDisplayValue(value);
      return;
    }

    const startValue = prevNumericRef.current ?? targetValue;
    prevNumericRef.current = targetValue;

    if (startValue === targetValue) {
      setDisplayValue(value);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      const currentValue = startValue + (targetValue - startValue) * easeOut;

      const formattedNumber = Math.round(currentValue).toLocaleString("en-US");
      setDisplayValue(`${prefix}${formattedNumber}`);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{displayValue}</>;
}
