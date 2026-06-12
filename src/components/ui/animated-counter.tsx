"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  duration = 0.8,
  className = "",
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current));
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    spring.set(value);
    prevValue.current = value;
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => {
      setDisplayValue(v);
    });
    return unsubscribe;
  }, [display]);

  return (
    <motion.span className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </motion.span>
  );
}
