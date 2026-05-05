type Props = { size?: number; light?: boolean };

// Custom SVG logo: shield with a checkmark — the safety mark for Safe Start.
export function Logo({ size = 32, light = false }: Props) {
  const fg = light ? "white" : "rgb(88, 204, 2)";
  const inner = light ? "rgb(88, 204, 2)" : "white";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Safe Start"
    >
      <rect width="64" height="64" rx="14" fill={fg} />
      <path
        d="M32 14 L46 22 V36 C46 44 40 50 32 52 C24 50 18 44 18 36 V22 Z"
        fill={inner}
      />
      <path
        d="M25 33 L30 38 L40 27"
        stroke={fg}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
