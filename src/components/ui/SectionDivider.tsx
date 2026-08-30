interface SectionDividerProps {
  /** Hex color of the bottom section (the divider blends into the section above it). */
  fill?: string;
  flip?: boolean;
  className?: string;
}

/**
 * Soft SVG wave divider. Place between two sections of different background
 * colors; `fill` should match the section *below* the divider.
 */
export function SectionDivider({
  fill = "#ffffff",
  flip = false,
  className = "",
}: SectionDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`block leading-none -mb-px ${className}`}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="w-full h-12 md:h-20 block"
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export default SectionDivider;
