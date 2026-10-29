import { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const base = (size: number): P => ({
  width: size,
  height: size,
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
})

export function HospitableMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 26) / 22} viewBox="0 0 20 24" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5451 20.3077C14.5647 20.3077 15.3912 21.1342 15.3912 22.1538C15.3912 23.1734 14.5647 24 13.5451 24H6.17397C5.15437 24 4.32782 23.1734 4.32782 22.1538C4.32782 21.1342 5.15437 20.3077 6.17397 20.3077H13.5451ZM9.85953 0C14.9513 0 19.079 4.13276 19.079 9.23077C19.079 14.3288 14.9513 18.4615 9.85953 18.4615C4.76773 18.4615 0.640015 14.3288 0.640015 9.23077C0.640015 4.13276 4.76773 0 9.85953 0ZM9.85953 3.69231C6.80445 3.69231 4.32782 6.17196 4.32782 9.23077C4.32782 12.2896 6.80445 14.7692 9.85953 14.7692C12.9146 14.7692 15.3912 12.2896 15.3912 9.23077C15.3912 6.17196 12.9146 3.69231 9.85953 3.69231Z"
        fill="#ED3C6A"
      />
    </svg>
  )
}

export const Icon = {
  Collapse: (p: P) => (
    <svg {...base(18)} {...p}>
      <path d="M4 4v12M16 10H8m0 0l3-3m-3 3l3 3" />
    </svg>
  ),
  Search: (p: P) => (
    <svg {...base(18)} {...p}>
      <circle cx="9" cy="9" r="5.5" />
      <path d="M13.2 13.2L17 17" />
    </svg>
  ),
  Grow: (p: P) => (
    <svg {...base(20)} {...p}>
      <path d="M2 14l5-5 3 3 7-7M12 5h5v5" />
    </svg>
  ),
  Home: (p: P) => (
    <svg {...base(20)} {...p}>
      <path d="M3 9.5L10 3l7 6.5V17H3z" />
    </svg>
  ),
  Inbox: (p: P) => (
    <svg {...base(20)} {...p}>
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
      <path d="M3 6l7 5 7-5" />
    </svg>
  ),
  Properties: (p: P) => (
    <svg {...base(20)} {...p}>
      <rect x="3.5" y="2.5" width="9" height="15" rx="1" />
      <path d="M12.5 8h4v9.5h-4M6.5 6h3M6.5 9h3M6.5 12h3" />
    </svg>
  ),
  Calendar: (p: P) => (
    <svg {...base(20)} {...p}>
      <rect x="3" y="4.5" width="14" height="12.5" rx="2" />
      <path d="M3 8.5h14M7 3v3M13 3v3" />
    </svg>
  ),
  Heart: (p: P) => (
    <svg {...base(20)} {...p}>
      <path d="M10 16.5S3 12.3 3 7.8A3.8 3.8 0 0110 6a3.8 3.8 0 017 1.8c0 4.5-7 8.7-7 8.7z" />
    </svg>
  ),
  Metrics: (p: P) => (
    <svg {...base(20)} {...p}>
      <path d="M3 3v14h14M6.5 12l3-3.5 2.5 2L16 6" />
    </svg>
  ),
  Cursor: (p: P) => (
    <svg {...base(20)} {...p}>
      <path d="M4 3l13 6-5.5 2L9 16.5z" />
    </svg>
  ),
  Wifi: (p: P) => (
    <svg {...base(20)} {...p}>
      <path d="M2.5 8a11 11 0 0115 0M5 11a7.5 7.5 0 0110 0M7.5 14a4 4 0 015 0" />
      <circle cx="10" cy="16.5" r=".8" fill="currentColor" />
    </svg>
  ),
  Ops: (p: P) => (
    <svg {...base(20)} {...p}>
      <rect x="3" y="3" width="14" height="14" rx="2.5" />
      <path d="M6.5 10l2.5 2.5 4.5-5" />
    </svg>
  ),
  Chevron: (p: P) => (
    <svg {...base(14)} viewBox="0 0 14 14" {...p}>
      <path d="M5 3l4 4-4 4" />
    </svg>
  ),
  Sparkle: (p: P) => (
    <svg {...base(19)} strokeWidth={1.5} {...p}>
      <path d="M8 3l1.5 4.5L14 9l-4.5 1.5L8 15l-1.5-4.5L2 9l4.5-1.5zM15 12l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </svg>
  ),
  Help: (p: P) => (
    <svg {...base(19)} strokeWidth={1.5} {...p}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M8 8a2 2 0 114 0c0 1.5-2 1.5-2 3M10 14v.2" />
    </svg>
  ),
  Settings: (p: P) => (
    <svg {...base(19)} strokeWidth={1.5} {...p}>
      <circle cx="10" cy="10" r="2.6" />
      <path d="M10 1.8v2.4M10 15.8v2.4M1.8 10h2.4M15.8 10h2.4M4.2 4.2l1.7 1.7M14.1 14.1l1.7 1.7M4.2 15.8l1.7-1.7M14.1 5.9l1.7-1.7" />
    </svg>
  ),
  Warning: (p: P) => (
    <svg {...base(22)} viewBox="0 0 24 24" strokeWidth={1.8} {...p}>
      <path d="M12 3.5l9.5 16.5h-19z" />
      <path d="M12 10v4.5M12 17.3v.2" />
    </svg>
  ),
  CheckCircle: (p: P) => (
    <svg {...base(22)} viewBox="0 0 24 24" strokeWidth={2} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.3l2.7 2.7L16 9.5" />
    </svg>
  ),
  Info: (p: P) => (
    <svg {...base(16)} {...p}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9v4.5M10 6.5v.2" />
    </svg>
  ),
  Upload: (p: P) => (
    <svg {...base(20)} viewBox="0 0 24 24" strokeWidth={1.8} {...p}>
      <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" />
      <path d="M4.5 14.5v3a2 2 0 002 2h11a2 2 0 002-2v-3" />
    </svg>
  ),
  ShieldCheck: (p: P) => (
    <svg {...base(20)} viewBox="0 0 24 24" strokeWidth={1.8} {...p}>
      <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z" />
      <path d="M8.8 12.2l2.2 2.2 4.3-4.6" />
    </svg>
  ),
  Undo: (p: P) => (
    <svg {...base(20)} viewBox="0 0 24 24" strokeWidth={1.8} {...p}>
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 010 11H11" />
    </svg>
  ),
}
