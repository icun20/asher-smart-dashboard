"use client";

import React, { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: string;
  duration?: number;
}

export function AnimatedNumber({ value, duration = 1500 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    // Extract prefix (if any) and numeric value
    const prefix = value.startsWith("$") ? "$" : "";
    const numericString = value.replace(/[^0-9.-]+/g, "");
    const targetValue = parseFloat(numericString);

    if (isNaN(targetValue)) {
      setDisplayValue(value);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function: easeOutExpo
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      const currentValue = targetValue * easeOut;

      // Format the number back with commas
      const formattedNumber = Math.round(currentValue).toLocaleString("en-US");
      setDisplayValue(`${prefix}${formattedNumber}`);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value); // Ensure it matches exactly at the end
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{displayValue}</>;
}
