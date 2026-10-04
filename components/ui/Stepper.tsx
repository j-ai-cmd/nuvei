"use client";

import { useEffect, useState } from "react";
import AnimatedStepper, { type AnimatedStepperProps } from "@/components/smoothui/animated-stepper";

// The horizontal stepper needs ~700px for its labels. Below the lg breakpoint it
// overflowed on tablets, so narrower screens get the stepper's own vertical layout.
export default function Stepper(props: Omit<AnimatedStepperProps, "variant">) {
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return <AnimatedStepper {...props} className="nuvei-stepper" variant={wide ? "horizontal" : "vertical"} />;
}
