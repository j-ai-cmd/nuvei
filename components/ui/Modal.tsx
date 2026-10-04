"use client";

import { useEffect } from "react";
import BasicModal, { type BasicModalProps } from "@/components/smoothui/basic-modal";

// While a modal is open, the page behind it is inert: not focusable, not clickable,
// and hidden from screen readers. basic-modal traps focus but leaves the page reachable.
const BACKGROUND = ["#main", "header", "nav", "footer"];

export default function Modal(props: BasicModalProps) {
  const { isOpen } = props;

  useEffect(() => {
    if (!isOpen) return;
    const els = BACKGROUND.flatMap((sel) => Array.from(document.querySelectorAll<HTMLElement>(sel)));
    els.forEach((el) => {
      el.inert = true;
      el.setAttribute("aria-hidden", "true");
    });
    return () => {
      els.forEach((el) => {
        el.inert = false;
        el.removeAttribute("aria-hidden");
      });
    };
  }, [isOpen]);

  return <BasicModal {...props} />;
}
