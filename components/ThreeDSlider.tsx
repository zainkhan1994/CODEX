"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { clamp } from "@/lib/animation-utils";
import "@/styles/animations.css";

export interface SliderItem {
  id: string | number;
  content: ReactNode;
}

interface ThreeDSliderProps {
  items: SliderItem[];
  /** Height of the carousel stage in pixels */
  stageHeight?: number;
  /**
   * translateZ distance. Defaults to "45vmin" (CSS string) for viewport
   * relative sizing; pass a pixel number to override.
   */
  translateZ?: string | number;
  /** Auto-rotation speed in degrees per second (0 = disabled) */
  autoRotateSpeed?: number;
  /** Accessible label for the carousel container */
  ariaLabel?: string;
  className?: string;
}

/**
 * Pure CSS 3D rotating carousel.
 *
 * Each item is placed in a ring using:
 *   rotateY(positionIndex × (360° / totalItems))  translateZ(radius)
 *
 * Drag / swipe to spin; auto-rotates when idle.
 */
export function ThreeDSlider({
  items,
  stageHeight = 420,
  translateZ = "45vmin",
  autoRotateSpeed = 20,
  ariaLabel = "3D carousel",
  className,
}: ThreeDSliderProps) {
  const total = items.length;
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const rotationAtDragStartRef = useRef(0);

  /* Auto-rotation */
  const tick = useCallback(
    (timestamp: number) => {
      if (!isDraggingRef.current && autoRotateSpeed !== 0) {
        if (lastTimeRef.current === null) {
          lastTimeRef.current = timestamp;
        }
        const delta = (timestamp - lastTimeRef.current) / 1000; // seconds
        lastTimeRef.current = timestamp;
        setRotation((r) => r + autoRotateSpeed * delta);
      } else {
        lastTimeRef.current = null;
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [autoRotateSpeed]
  );

  useEffect(() => {
    /* Respect reduced motion */
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  /* ── Pointer / Mouse drag ── */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      rotationAtDragStartRef.current = rotation;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [rotation]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartXRef.current;
      // 1 px drag ≈ 0.3° rotation feels natural
      setRotation(rotationAtDragStartRef.current + dx * 0.3);
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    lastTimeRef.current = null;
  }, []);

  const translateZValue =
    typeof translateZ === "number" ? `${translateZ}px` : translateZ;

  return (
    <div
      className={`slider-3d-container select-none${className ? ` ${className}` : ""}`}
      style={{ height: stageHeight }}
      aria-label={ariaLabel}
    >
      <div
        className="slider-3d-scene"
        style={{
          height: "100%",
          transform: `rotateY(${rotation}deg)`,
          cursor: isDraggingRef.current ? "grabbing" : "grab",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className="slider-3d-item"
            style={
              {
                "--position-index": index,
                "--total-items": total,
                "--translate-z": translateZValue,
              } as React.CSSProperties
            }
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
