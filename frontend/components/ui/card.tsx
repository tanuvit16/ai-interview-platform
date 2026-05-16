// export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
//   return (
//     <div className={`bg-gray-900 border border-gray-700 rounded-xl p-6 ${className}`}>
//       {children}
//     </div>
//   );
// }














// import { ReactNode } from "react";

// interface CardProps {
//   children: ReactNode;
//   className?: string;
//   glow?: boolean;
//   hover?: boolean;
// }

// export default function Card({ children, className = "", glow = false, hover = false }: CardProps) {
//   return (
//     <div
//       className={`rounded-2xl p-6 transition-all duration-300 ${hover ? "cursor-pointer" : ""} ${className}`}
//       style={{
//         background: 'var(--bg-surface)',
//         border: '1px solid var(--border)',
//         boxShadow: glow ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
//       }}
//       onMouseEnter={hover ? e => {
//         (e.currentTarget as HTMLElement).style.border = '1px solid var(--border-hover)';
//         (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
//       } : undefined}
//       onMouseLeave={hover ? e => {
//         (e.currentTarget as HTMLElement).style.border = '1px solid var(--border)';
//         (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
//       } : undefined}
//     >
//       {children}
//     </div>
//   );
// }


















import { ReactNode, useState } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  accent?: boolean;
}

export default function Card({ children, className = "", glow = false, hover = false, accent = false }: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={className}
      style={{
        background: '#0c1018',
        border: `1px solid ${accent ? 'rgba(99,102,241,0.4)' : hovered && hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.2s ease',
        transform: hovered && hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: glow
          ? '0 0 0 1px rgba(99,102,241,0.15), 0 8px 32px rgba(99,102,241,0.12)'
          : '0 1px 4px rgba(0,0,0,0.3)',
        cursor: hover ? 'pointer' : 'default',
      }}
      onMouseEnter={hover ? () => setHovered(true) : undefined}
      onMouseLeave={hover ? () => setHovered(false) : undefined}
    >
      {children}
    </div>
  );
}