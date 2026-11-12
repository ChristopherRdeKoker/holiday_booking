export function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" className="brand-mark" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="16" className="brand-mark-bg" />
      <path d="M14 34 32 18l18 16v14H14z" className="brand-mark-house" />
      <rect x="27" y="36" width="10" height="12" className="brand-mark-door" />
      <path d="M10 50h44" className="brand-mark-line" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
