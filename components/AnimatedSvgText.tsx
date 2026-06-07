"use client";

interface AnimatedSvgTextProps {
  /** The text to render with the drawing animation */
  text: string;
  className?: string;
  /** Animation duration in seconds */
  duration?: number;
  /**
   * The stroke-dasharray / stroke-dashoffset starting value.
   * Should be at least as large as the total perimeter of the text paths.
   * A safe default of 1000 works for most short titles.
   */
  dashOffset?: number;
  /** Stroke color while drawing (defaults to the CSS primary variable) */
  strokeColor?: string;
  /** Fill color after the illumination completes (defaults to currentColor) */
  fillColor?: string;
  /** Font size passed to the SVG <text> element */
  fontSize?: number | string;
  /** Font weight */
  fontWeight?: number | string;
  /** viewBox height; width is derived automatically */
  viewBoxHeight?: number;
  /** Accessible label (defaults to `text`) */
  ariaLabel?: string;
}

/**
 * Renders text as an SVG element with a stroke-draw → fill "illumination"
 * animation modelled after the welcometext pattern on tusharshukla.dev.
 *
 * The animation is skipped when the user prefers reduced motion.
 */
export function AnimatedSvgText({
  text,
  className,
  duration = 3,
  dashOffset = 1000,
  strokeColor = "hsl(var(--primary))",
  fillColor = "currentColor",
  fontSize = 56,
  fontWeight = 700,
  viewBoxHeight = 80,
  ariaLabel,
}: AnimatedSvgTextProps) {
  const style = {
    "--dash-offset": dashOffset,
    "--anim-duration": `${duration}s`,
    "--text-stroke-color": strokeColor,
    "--text-fill-color": fillColor,
  } as React.CSSProperties;

  return (
    <svg
      className={className}
      viewBox={`0 0 800 ${viewBoxHeight}`}
      aria-label={ariaLabel ?? text}
      role="img"
      overflow="visible"
    >
      <text
        x="0"
        y={viewBoxHeight * 0.85}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontFamily="inherit"
        className="animated-svg-text"
        style={style}
      >
        {text}
      </text>
    </svg>
  );
}
